import { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// MediaPipe FaceMesh landmark indices, ordered as [p1, p2, p3, p4, p5, p6]
// so the EAR formula maps directly:
//   EAR = (|p2-p6| + |p3-p5|) / (2 * |p1-p4|)
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

const DEFAULT_EAR_THRESHOLD = 0.21; // fallback when baseline history is insufficient
const SMOOTH_WINDOW = 3; // average last N EAR samples to fight noise
const NO_FACE_TIMEOUT = 3000; // ms without a face before we warn + pause
const MIN_BLINK_MS = 40; // ignore sub-frame flickers as false blinks

// MediaPipe ships wasm/data assets separately; load them from the CDN.
const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// EAR for a single eye. Landmarks are normalized [0..1]; multiply by the frame
// dimensions so horizontal/vertical distances share the same pixel scale.
function eyeEAR(landmarks, idx, w, h) {
  const p = idx.map((i) => ({ x: landmarks[i].x * w, y: landmarks[i].y * h }));
  const vertical = dist(p[1], p[5]) + dist(p[2], p[4]);
  const horizontal = dist(p[0], p[3]);
  if (horizontal === 0) return 0;
  return vertical / (2 * horizontal);
}

/**
 * useFaceMesh wires up the webcam + MediaPipe FaceMesh, computes a smoothed EAR
 * every frame, draws eye landmarks on the canvas, and runs the blink state
 * machine. Per-frame work lives in refs to avoid re-render lag; only coarse
 * lifecycle changes (ready / error / face presence) hit React state.
 *
 * @param {object} opts
 * @param {React.RefObject<HTMLVideoElement>} opts.videoRef
 * @param {React.RefObject<HTMLCanvasElement>} opts.canvasRef
 * @param {(blink: {t:number, duration:number}) => void} opts.onBlink
 * @param {(sample: {t:number, ear:number, threshold:number}) => void} opts.onEyeSample
 * @param {(sample: {t:number, landmarks:Array, width:number, height:number}) => void} opts.onFaceLandmarks
 */
export function useFaceMesh({ videoRef, canvasRef, onBlink, onEyeSample, onFaceLandmarks }) {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [faceDetected, setFaceDetected] = useState(false);

  // Live, per-frame values read imperatively by CameraFeed (no re-render).
  const liveRef = useRef({ ear: 0, inBlink: false, lastBlinkAt: 0, dynamicThreshold: 0.21 });

  // Blink detection internals.
  const earHistoryRef = useRef([]); // last SMOOTH_WINDOW raw EAR values
  const baselineHistoryRef = useRef([]); // rolling buffer of eye-open EAR values for dynamic baseline
  const blinkStateRef = useRef({ closed: false, startedAt: 0 });
  const lastFaceTimeRef = useRef(0);
  // Mirror coarse state in refs so the per-frame callback can avoid redundant
  // setState calls (its closure would otherwise see stale render values).
  const readyRef = useRef(false);
  const faceRef = useRef(false);

  // Keep the latest onBlink without re-initializing the whole pipeline.
  const onBlinkRef = useRef(onBlink);
  useEffect(() => {
    onBlinkRef.current = onBlink;
  }, [onBlink]);
  const onEyeSampleRef = useRef(onEyeSample);
  useEffect(() => {
    onEyeSampleRef.current = onEyeSample;
  }, [onEyeSample]);
  const onFaceLandmarksRef = useRef(onFaceLandmarks);
  useEffect(() => {
    onFaceLandmarksRef.current = onFaceLandmarks;
  }, [onFaceLandmarks]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let camera = null;
    let cancelled = false;
    const ctx = canvas.getContext('2d');

    const faceMesh = new FaceMesh({
      locateFile: (file) => `${CDN_BASE}/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (cancelled) return;
      if (!readyRef.current) {
        readyRef.current = true;
        setStatus('ready');
      }

      const w = results.image?.width || video.videoWidth || 640;
      const h = results.image?.height || video.videoHeight || 480;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const faces = results.multiFaceLandmarks;
      if (!faces || faces.length === 0) {
        // No face this frame. faceDetected flips off via the watchdog interval.
        return;
      }

      lastFaceTimeRef.current = performance.now();
      if (!faceRef.current) {
        faceRef.current = true;
        setFaceDetected(true);
      }

      const lm = faces[0];
      onFaceLandmarksRef.current?.({
        t: Date.now(),
        landmarks: lm,
        width: w,
        height: h,
      });

      const rawEAR =
        (eyeEAR(lm, LEFT_EYE, w, h) + eyeEAR(lm, RIGHT_EYE, w, h)) / 2;

      // Smooth over the last few frames before thresholding.
      const hist = earHistoryRef.current;
      hist.push(rawEAR);
      if (hist.length > SMOOTH_WINDOW) hist.shift();
      const smoothEAR = hist.reduce((a, b) => a + b, 0) / hist.length;
      liveRef.current.ear = smoothEAR;

      // Update baseline tracking buffer (ignore micro-sleeps or blinks)
      const baseHist = baselineHistoryRef.current;
      if (smoothEAR >= 0.12) {
        baseHist.push(smoothEAR);
        if (baseHist.length > 300) baseHist.shift();
      }

      // Calculate dynamic threshold
      let dynamicThreshold = DEFAULT_EAR_THRESHOLD;
      if (baseHist.length >= 100) {
        const sorted = [...baseHist].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length * 0.5)];
        dynamicThreshold = median * 0.82; // Threshold is 82% of the median eye-open state
      }
      liveRef.current.dynamicThreshold = dynamicThreshold;
      onEyeSampleRef.current?.({
        t: Date.now(),
        ear: smoothEAR,
        threshold: dynamicThreshold,
      });

      // Blink state machine: falling edge opens a blink, rising edge closes it.
      const state = blinkStateRef.current;
      const now = performance.now();
      if (smoothEAR < dynamicThreshold) {
        if (!state.closed) {
          state.closed = true;
          state.startedAt = now;
        }
        liveRef.current.inBlink = true;
      } else if (state.closed) {
        state.closed = false;
        liveRef.current.inBlink = false;
        const duration = now - state.startedAt;
        if (duration >= MIN_BLINK_MS) {
          liveRef.current.lastBlinkAt = Date.now();
          onBlinkRef.current?.({ t: Date.now(), duration });
        }
      }

      // Draw eye landmark dots.
      ctx.fillStyle = liveRef.current.inBlink ? '#f87171' : '#34d399';
      for (const idx of [LEFT_EYE, RIGHT_EYE]) {
        for (const i of idx) {
          ctx.beginPath();
          ctx.arc(lm[i].x * w, lm[i].y * h, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    camera = new Camera(video, {
      onFrame: async () => {
        if (!cancelled) await faceMesh.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    camera
      .start()
      .catch((err) => {
        if (cancelled) return;
        const denied =
          err?.name === 'NotAllowedError' ||
          err?.name === 'PermissionDeniedError';
        setErrorMessage(
          denied
            ? 'Camera access was denied. Enable camera permissions for this site and reload.'
            : `Could not start the camera: ${err?.message || err}`
        );
        setStatus('error');
      });

    // Watchdog: flip faceDetected off after NO_FACE_TIMEOUT of no landmarks.
    const watchdog = setInterval(() => {
      if (cancelled) return;
      const since = performance.now() - lastFaceTimeRef.current;
      if (since > NO_FACE_TIMEOUT && faceRef.current) {
        faceRef.current = false;
        setFaceDetected(false);
        liveRef.current.inBlink = false;
      }
    }, 500);

    return () => {
      cancelled = true;
      clearInterval(watchdog);
      camera?.stop?.();
      faceMesh.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, errorMessage, faceDetected, liveRef };
}
