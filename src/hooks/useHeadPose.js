import { useCallback, useRef, useState } from 'react';
import {
  createHeadPoseCalibrationStore,
  estimateHeadPose,
} from '../analytics/headPoseCalculation.js';
import { classifyHeadDirection } from '../analytics/headDirection.js';
import {
  createHeadAttentionStore,
  updateHeadAttentionMetrics,
} from '../analytics/headAttentionMetrics.js';

const STATE_UPDATE_MS = 250;

const EMPTY_HEAD_POSE = {
  pitchAngle: 0,
  yawAngle: 0,
  rollAngle: 0,
  headDirection: 'Forward',
  headLabels: {
    pitch: 'Level',
    yaw: 'Centered',
    roll: 'Level',
  },
  isForward: true,
  isTilted: false,
  calibrationReady: false,
  calibrationConfidence: 0,
  currentHeadScore: 0,
  rollingHeadScore: 0,
  sessionHeadScore: 0,
  headScore: 0,
  totalFrames: 0,
  forwardFrames: 0,
  timeLookingForwardMs: 0,
  timeLookingAwayMs: 0,
  directionDistribution: {
    Forward: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  },
  directionFrameCounts: {
    Forward: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  },
  directionDurationsMs: {
    Forward: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  },
};

export function useHeadPose() {
  const calibrationRef = useRef(createHeadPoseCalibrationStore());
  const metricsRef = useRef(createHeadAttentionStore());
  const lastStateUpdateRef = useRef(0);
  const [headPose, setHeadPose] = useState(EMPTY_HEAD_POSE);

  const recordHeadFrame = useCallback(({ t, landmarks, width, height }) => {
    const pose = estimateHeadPose({
      landmarks,
      width,
      height,
      calibrationStore: calibrationRef.current,
      t,
    });
    if (!pose) return;

    const direction = classifyHeadDirection(pose);
    const metrics = updateHeadAttentionMetrics(metricsRef.current, {
      t,
      headDirection: direction.headDirection,
      isForward: direction.isForward,
    });

    if (t - lastStateUpdateRef.current < STATE_UPDATE_MS) return;
    lastStateUpdateRef.current = t;

    setHeadPose({
      pitchAngle: pose.pitchAngle,
      yawAngle: pose.yawAngle,
      rollAngle: pose.rollAngle,
      headDirection: direction.headDirection,
      headLabels: direction.labels,
      isForward: direction.isForward,
      isTilted: direction.isTilted,
      calibrationReady: pose.calibrationReady,
      calibrationConfidence: pose.calibrationConfidence,
      ...metrics,
    });
  }, []);

  return {
    recordHeadFrame,
    headPose,
  };
}
