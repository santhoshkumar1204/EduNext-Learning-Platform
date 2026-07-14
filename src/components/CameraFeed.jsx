import { useEffect, useRef, useState } from 'react';

/**
 * Live webcam feed with a landmark overlay. Reads the per-frame `liveRef` from
 * useFaceMesh on its own rAF loop so the EAR readout and blink dot update
 * smoothly without re-rendering the rest of the app.
 */
export default function CameraFeed({ videoRef, canvasRef, liveRef, faceDetected }) {
  const [ear, setEar] = useState(0);
  const [threshold, setThreshold] = useState(0.21);
  const [flash, setFlash] = useState(false);
  const lastBlinkSeen = useRef(0);

  useEffect(() => {
    let raf;
    const loop = () => {
      const live = liveRef.current;
      setEar(live.ear);
      setThreshold(live.dynamicThreshold || 0.21);
      if (live.lastBlinkAt && live.lastBlinkAt !== lastBlinkSeen.current) {
        lastBlinkSeen.current = live.lastBlinkAt;
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [liveRef]);

  return (
    <div className="glass-strong flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Live Camera
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-100 ${
              flash ? 'bg-red-400 shadow-[0_0_10px_2px_rgba(248,113,113,0.8)]' : 'bg-emerald-500/70'
            }`}
          />
          {flash ? 'Blink' : 'Tracking'}
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10">
        {/* Both video and canvas are mirrored so dots align with a selfie view */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
        />

        {!faceDetected && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-amber-500/15 py-2 text-sm font-medium text-amber-200 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            No face detected — BPM paused
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg bg-white/5 px-3 py-2 text-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Live EAR</span>
          <span className="font-mono text-base font-semibold text-slate-100">
            {ear.toFixed(3)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Ocular Threshold</span>
          <span className="font-mono text-base font-semibold text-emerald-400 font-bold">
            {threshold.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
