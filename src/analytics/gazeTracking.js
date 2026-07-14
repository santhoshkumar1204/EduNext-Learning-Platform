import { clamp } from './statistics.js';

export const GAZE_LANDMARKS = {
  leftEyeOuter: 33,
  leftEyeInner: 133,
  leftEyeTop: 159,
  leftEyeBottom: 145,
  rightEyeInner: 362,
  rightEyeOuter: 263,
  rightEyeTop: 386,
  rightEyeBottom: 374,
  leftIris: [468, 469, 470, 471],
  rightIris: [473, 474, 475, 476],
};

const LEFT_EYE_EAR = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE_EAR = [362, 385, 387, 263, 373, 380];
const QUALITY_LIMITS = {
  minEyeOpenness: 0.16,
  minFaceSize: 0.08,
  maxIrisJump: 0.12,
  maxHeadMotion: 0.08,
};

function point(landmarks, index) {
  return landmarks[index];
}

function averagePoint(landmarks, indices) {
  const valid = indices.map((index) => point(landmarks, index)).filter(Boolean);
  if (!valid.length) return null;
  return {
    x: valid.reduce((sum, item) => sum + item.x, 0) / valid.length,
    y: valid.reduce((sum, item) => sum + item.y, 0) / valid.length,
    z: valid.reduce((sum, item) => sum + (item.z || 0), 0) / valid.length,
  };
}

// Gaze ratios are normalized inside each eye box. A value near 0.5 means the
// iris center sits near the geometric eye center. Values below/above the center
// indicate horizontal or vertical displacement toward the corresponding eyelid
// or eye corner. Both eyes are averaged to reduce single-eye landmark noise.
export function estimateGazeRatios(landmarks) {
  if (!landmarks?.[GAZE_LANDMARKS.leftIris[0]] || !landmarks?.[GAZE_LANDMARKS.rightIris[0]]) {
    return null;
  }

  const left = eyeRatios(landmarks, {
    inner: GAZE_LANDMARKS.leftEyeInner,
    outer: GAZE_LANDMARKS.leftEyeOuter,
    top: GAZE_LANDMARKS.leftEyeTop,
    bottom: GAZE_LANDMARKS.leftEyeBottom,
    iris: GAZE_LANDMARKS.leftIris,
  });
  const right = eyeRatios(landmarks, {
    inner: GAZE_LANDMARKS.rightEyeInner,
    outer: GAZE_LANDMARKS.rightEyeOuter,
    top: GAZE_LANDMARKS.rightEyeTop,
    bottom: GAZE_LANDMARKS.rightEyeBottom,
    iris: GAZE_LANDMARKS.rightIris,
  });

  if (!left || !right) return null;

  return {
    horizontalRatio: (left.horizontalRatio + right.horizontalRatio) / 2,
    verticalRatio: (left.verticalRatio + right.verticalRatio) / 2,
    leftEye: left,
    rightEye: right,
  };
}

export function assessGazeFrameQuality({ landmarks, width = 1, height = 1, previousFrame = null }) {
  const reasons = [];
  const irisVisibility = irisLandmarkVisibility(landmarks);
  if (irisVisibility < 1) reasons.push('iris_landmarks_missing');

  const eyeOpenness = averageEyeOpenness(landmarks, width, height);
  if (eyeOpenness < QUALITY_LIMITS.minEyeOpenness) reasons.push('eyes_partially_closed');

  const faceSize = normalizedFaceSize(landmarks);
  if (faceSize < QUALITY_LIMITS.minFaceSize) reasons.push('face_too_small');

  const headMotion = normalizedHeadMotion(landmarks, previousFrame?.anchors);
  if (headMotion > QUALITY_LIMITS.maxHeadMotion) reasons.push('excessive_head_movement');

  const ratios = estimateGazeRatios(landmarks);
  const irisJump =
    ratios && previousFrame?.ratios
      ? Math.hypot(
          ratios.horizontalRatio - previousFrame.ratios.horizontalRatio,
          ratios.verticalRatio - previousFrame.ratios.verticalRatio
        )
      : 0;
  if (irisJump > QUALITY_LIMITS.maxIrisJump) reasons.push('iris_landmarks_unstable');

  const qualityScore = clamp(
    irisVisibility * 30 +
      clamp(eyeOpenness / 0.28, 0, 1) * 25 +
      clamp(faceSize / 0.16, 0, 1) * 20 +
      clamp(1 - irisJump / QUALITY_LIMITS.maxIrisJump, 0, 1) * 15 +
      clamp(1 - headMotion / QUALITY_LIMITS.maxHeadMotion, 0, 1) * 10,
    0,
    100
  );

  return {
    valid: reasons.length === 0 && Boolean(ratios),
    reasons,
    ratios,
    qualityScore,
    irisVisibility: irisVisibility * 100,
    eyeOpenness,
    faceSize,
    irisJump,
    headMotion,
    anchors: frameAnchors(landmarks),
  };
}

function eyeRatios(landmarks, indices) {
  const inner = point(landmarks, indices.inner);
  const outer = point(landmarks, indices.outer);
  const top = point(landmarks, indices.top);
  const bottom = point(landmarks, indices.bottom);
  const iris = averagePoint(landmarks, indices.iris);
  if (!inner || !outer || !top || !bottom || !iris) return null;

  const leftX = Math.min(inner.x, outer.x);
  const rightX = Math.max(inner.x, outer.x);
  const topY = Math.min(top.y, bottom.y);
  const bottomY = Math.max(top.y, bottom.y);
  const width = rightX - leftX;
  const height = bottomY - topY;
  if (width <= 0 || height <= 0) return null;

  return {
    horizontalRatio: clamp((iris.x - leftX) / width, 0, 1),
    verticalRatio: clamp((iris.y - topY) / height, 0, 1),
    irisCenter: iris,
  };
}

function irisLandmarkVisibility(landmarks) {
  const indices = [...GAZE_LANDMARKS.leftIris, ...GAZE_LANDMARKS.rightIris];
  const visible = indices.filter((index) => Boolean(landmarks?.[index])).length;
  return visible / indices.length;
}

function averageEyeOpenness(landmarks, width, height) {
  const left = eyeOpenness(landmarks, LEFT_EYE_EAR, width, height);
  const right = eyeOpenness(landmarks, RIGHT_EYE_EAR, width, height);
  if (!left && !right) return 0;
  if (!left) return right;
  if (!right) return left;
  return (left + right) / 2;
}

function eyeOpenness(landmarks, indices, width, height) {
  const points = indices.map((index) => landmarks?.[index]);
  if (points.some((item) => !item)) return 0;
  const p = points.map((item) => ({ x: item.x * width, y: item.y * height }));
  const vertical =
    Math.hypot(p[1].x - p[5].x, p[1].y - p[5].y) +
    Math.hypot(p[2].x - p[4].x, p[2].y - p[4].y);
  const horizontal = Math.hypot(p[0].x - p[3].x, p[0].y - p[3].y);
  if (!horizontal) return 0;
  return vertical / (2 * horizontal);
}

function normalizedFaceSize(landmarks) {
  const left = point(landmarks, GAZE_LANDMARKS.leftEyeOuter);
  const right = point(landmarks, GAZE_LANDMARKS.rightEyeOuter);
  if (!left || !right) return 0;
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function normalizedHeadMotion(landmarks, previousAnchors) {
  const anchors = frameAnchors(landmarks);
  if (!anchors || !previousAnchors) return 0;
  const keys = Object.keys(anchors);
  const motion = keys.map((key) =>
    Math.hypot(anchors[key].x - previousAnchors[key].x, anchors[key].y - previousAnchors[key].y)
  );
  return motion.reduce((sum, value) => sum + value, 0) / motion.length;
}

function frameAnchors(landmarks) {
  const indices = {
    nose: 1,
    chin: 152,
    leftEye: GAZE_LANDMARKS.leftEyeOuter,
    rightEye: GAZE_LANDMARKS.rightEyeOuter,
  };
  const anchors = {};
  for (const [key, index] of Object.entries(indices)) {
    const item = point(landmarks, index);
    if (!item) return null;
    anchors[key] = { x: item.x, y: item.y, z: item.z || 0 };
  }
  return anchors;
}
