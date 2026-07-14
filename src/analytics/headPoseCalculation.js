import { median, robustScale } from './statistics.js';

export const HEAD_POSE_LANDMARKS = {
  noseTip: 1,
  chin: 152,
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  leftMouthCorner: 61,
  rightMouthCorner: 291,
};

const RAD_TO_DEG = 180 / Math.PI;
const YAW_SCALE = 42;
const PITCH_SCALE = 55;

function toPoint(landmarks, index, width, height) {
  const point = landmarks[index];
  return {
    x: point.x * width,
    y: point.y * height,
    z: point.z * width,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function createHeadPoseCalibrationStore() {
  return {
    samples: [],
    neutral: null,
  };
}

// This lightweight pose estimator uses stable FaceMesh anchors and normalizes
// by face size so values remain comparable across camera distance. It is not a
// full PnP solve, but it produces calibrated Euler-like angles suitable for
// continuous attention monitoring with the existing browser-only dependency set.
export function estimateHeadPose({ landmarks, width, height, calibrationStore, t }) {
  if (!landmarks?.length) return null;

  const points = {
    nose: toPoint(landmarks, HEAD_POSE_LANDMARKS.noseTip, width, height),
    chin: toPoint(landmarks, HEAD_POSE_LANDMARKS.chin, width, height),
    leftEye: toPoint(landmarks, HEAD_POSE_LANDMARKS.leftEyeOuter, width, height),
    rightEye: toPoint(landmarks, HEAD_POSE_LANDMARKS.rightEyeOuter, width, height),
    leftMouth: toPoint(landmarks, HEAD_POSE_LANDMARKS.leftMouthCorner, width, height),
    rightMouth: toPoint(landmarks, HEAD_POSE_LANDMARKS.rightMouthCorner, width, height),
  };

  const eyeMid = midpoint(points.leftEye, points.rightEye);
  const mouthMid = midpoint(points.leftMouth, points.rightMouth);
  const faceCenter = midpoint(eyeMid, mouthMid);
  const eyeDistance = distance(points.leftEye, points.rightEye) || 1;
  const eyeMouthDistance = distance(eyeMid, mouthMid) || 1;

  const raw = {
    yawAngle:
      ((points.nose.x - faceCenter.x) / eyeDistance) * YAW_SCALE +
      ((points.rightEye.z - points.leftEye.z) / eyeDistance) * (YAW_SCALE * 0.4),
    pitchAngle:
      ((points.nose.y - faceCenter.y) / eyeMouthDistance) * PITCH_SCALE +
      ((points.nose.z - points.chin.z) / eyeDistance) * (PITCH_SCALE * 0.18),
    rollAngle: Math.atan2(points.rightEye.y - points.leftEye.y, points.rightEye.x - points.leftEye.x) * RAD_TO_DEG,
  };

  const neutral = updateCalibration(calibrationStore, raw, t);
  return {
    pitchAngle: raw.pitchAngle - neutral.pitchAngle,
    yawAngle: raw.yawAngle - neutral.yawAngle,
    rollAngle: raw.rollAngle - neutral.rollAngle,
    rawAngles: raw,
    calibrationReady: neutral.ready,
    calibrationConfidence: neutral.confidence,
  };
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
  };
}

function updateCalibration(store, raw, t) {
  if (!store) {
    return { pitchAngle: 0, yawAngle: 0, rollAngle: 0, ready: false, confidence: 0 };
  }

  store.samples.push({ t, ...raw });
  if (store.samples.length > 90) store.samples.shift();

  const pitchValues = store.samples.map((sample) => sample.pitchAngle);
  const yawValues = store.samples.map((sample) => sample.yawAngle);
  const rollValues = store.samples.map((sample) => sample.rollAngle);
  const stable =
    robustScale(pitchValues) < 12 &&
    robustScale(yawValues) < 12 &&
    robustScale(rollValues) < 8;

  if (store.samples.length >= 30 && stable) {
    store.neutral = {
      pitchAngle: median(pitchValues),
      yawAngle: median(yawValues),
      rollAngle: median(rollValues),
      ready: true,
      confidence: Math.min(1, store.samples.length / 90),
    };
  }

  return store.neutral ?? {
    pitchAngle: 0,
    yawAngle: 0,
    rollAngle: 0,
    ready: false,
    confidence: Math.min(0.5, store.samples.length / 90),
  };
}
