import { useCallback, useRef, useState } from 'react';
import { assessGazeFrameQuality } from '../analytics/gazeTracking.js';
import {
  analyzeGazeDirection,
  classifyGazeDirection,
  DEFAULT_GAZE_THRESHOLDS,
  summarizeGazeThresholds,
} from '../analytics/gazeDirection.js';
import { createGazeMetricsStore, updateGazeMetrics } from '../analytics/gazeMetrics.js';
import {
  createGazeCalibrationStore,
  getGazeCalibrationStatus,
  recordGazeCalibrationFrame,
  startGazeCalibration,
} from '../analytics/gazeCalibration.js';

const STATE_UPDATE_MS = 250;

const EMPTY_GAZE = {
  gazeDirection: 'Center',
  horizontalRatio: 0.5,
  verticalRatio: 0.5,
  gazeConfidence: 0,
  frameQuality: {
    valid: false,
    reasons: [],
    qualityScore: 0,
    irisVisibility: 0,
    eyeOpenness: 0,
    faceSize: 0,
    irisJump: 0,
    headMotion: 0,
  },
  currentGazeScore: 0,
  rollingGazeScore: 0,
  sessionGazeScore: 0,
  gazeScore: 0,
  totalFrames: 0,
  centerFrames: 0,
  timeLookingCenterMs: 0,
  timeByDirectionMs: {
    Center: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  },
  directionDistribution: {
    Center: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  },
  directionFrameCounts: {
    Center: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  },
  thresholds: DEFAULT_GAZE_THRESHOLDS,
  thresholdSummary: summarizeGazeThresholds(DEFAULT_GAZE_THRESHOLDS),
  classification: {
    centerHorizontalMedian: DEFAULT_GAZE_THRESHOLDS.centerHorizontal,
    centerVerticalMedian: DEFAULT_GAZE_THRESHOLDS.centerVertical,
    horizontalOffset: 0,
    verticalOffset: 0,
    distanceFromCenter: 0,
    horizontalScore: 0,
    verticalScore: 0,
    reason: 'Awaiting valid gaze frame.',
  },
  rawRatios: {
    leftHorizontalRatio: 0.5,
    rightHorizontalRatio: 0.5,
    averagedHorizontalRatio: 0.5,
    leftVerticalRatio: 0.5,
    rightVerticalRatio: 0.5,
    averagedVerticalRatio: 0.5,
  },
  calibration: {
    active: false,
    completed: false,
    currentTarget: null,
    stageIndex: -1,
    stageProgress: 0,
    overallProgress: 0,
    successful: false,
    sampleCounters: {},
    validationReport: {},
    report: {},
  },
};

export function useGazeTracking() {
  const metricsRef = useRef(createGazeMetricsStore());
  const calibrationRef = useRef(createGazeCalibrationStore());
  const lastStateUpdateRef = useRef(0);
  const previousFrameRef = useRef(null);
  const [gaze, setGaze] = useState(EMPTY_GAZE);

  const recordGazeFrame = useCallback(({ t, landmarks, width, height }) => {
    const frameQuality = assessGazeFrameQuality({
      landmarks,
      width,
      height,
      previousFrame: previousFrameRef.current,
    });

    const thresholds = calibrationRef.current.thresholds;
    const classification = frameQuality.ratios
      ? analyzeGazeDirection(frameQuality.ratios, thresholds)
      : null;
    const gazeDirection = classification?.direction
      ?? (frameQuality.ratios ? classifyGazeDirection(frameQuality.ratios, thresholds) : 'Center');
    recordGazeCalibrationFrame(calibrationRef.current, frameQuality, gazeDirection, t);
    const calibrationStatus = getGazeCalibrationStatus(calibrationRef.current, t);

    if (!frameQuality.valid || !frameQuality.ratios) {
      if (frameQuality.ratios && frameQuality.anchors) {
        previousFrameRef.current = {
          ratios: frameQuality.ratios,
          anchors: frameQuality.anchors,
        };
      }
      publishGazeState({
        t,
        gazeDirection: 'Rejected',
        ratios: null,
        frameQuality,
        calibrationStatus,
        metrics: null,
        classification: null,
      });
      return;
    }

    const ratios = frameQuality.ratios;
    const metrics = updateGazeMetrics(metricsRef.current, {
      t,
      gazeDirection,
    });
    previousFrameRef.current = {
      ratios,
      anchors: frameQuality.anchors,
    };

    publishGazeState({
      t,
      gazeDirection,
      ratios,
      frameQuality,
      calibrationStatus,
      metrics,
      classification,
    });
  }, []);

  const publishGazeState = useCallback(({
    t,
    gazeDirection,
    ratios,
    frameQuality,
    calibrationStatus,
    metrics,
    classification,
  }) => {
    if (t - lastStateUpdateRef.current < STATE_UPDATE_MS) return;
    lastStateUpdateRef.current = t;

    setGaze((prev) => ({
      ...prev,
      gazeDirection,
      horizontalRatio: ratios?.horizontalRatio ?? prev.horizontalRatio,
      verticalRatio: ratios?.verticalRatio ?? prev.verticalRatio,
      gazeConfidence: gazeConfidence(frameQuality, calibrationStatus),
      frameQuality: summarizeFrameQuality(frameQuality),
      thresholds: calibrationRef.current.thresholds,
      thresholdSummary: summarizeGazeThresholds(calibrationRef.current.thresholds),
      classification: summarizeClassification(
        classification,
        calibrationRef.current.thresholds,
        frameQuality
      ),
      rawRatios: {
        leftHorizontalRatio: ratios?.leftEye?.horizontalRatio ?? prev.rawRatios.leftHorizontalRatio,
        rightHorizontalRatio: ratios?.rightEye?.horizontalRatio ?? prev.rawRatios.rightHorizontalRatio,
        averagedHorizontalRatio: ratios?.horizontalRatio ?? prev.rawRatios.averagedHorizontalRatio,
        leftVerticalRatio: ratios?.leftEye?.verticalRatio ?? prev.rawRatios.leftVerticalRatio,
        rightVerticalRatio: ratios?.rightEye?.verticalRatio ?? prev.rawRatios.rightVerticalRatio,
        averagedVerticalRatio: ratios?.verticalRatio ?? prev.rawRatios.averagedVerticalRatio,
      },
      calibration: {
        ...calibrationStatus,
        report: calibrationRef.current.report,
        validationReport: calibrationRef.current.validationReport,
      },
      ...(metrics || {}),
    }));
  }, []);

  const beginCalibration = useCallback(() => {
    startGazeCalibration(calibrationRef.current, Date.now());
    setGaze((prev) => ({
      ...prev,
      thresholds: DEFAULT_GAZE_THRESHOLDS,
      thresholdSummary: summarizeGazeThresholds(DEFAULT_GAZE_THRESHOLDS),
      classification: summarizeClassification(null, DEFAULT_GAZE_THRESHOLDS, null),
      calibration: {
        ...getGazeCalibrationStatus(calibrationRef.current, Date.now()),
        report: calibrationRef.current.report,
        validationReport: calibrationRef.current.validationReport,
      },
    }));
  }, []);

  return {
    recordGazeFrame,
    beginCalibration,
    gaze,
  };
}

function gazeConfidence(frameQuality, calibrationStatus) {
  const iris = frameQuality.irisVisibility ?? 0;
  const openness = Math.min(100, ((frameQuality.eyeOpenness ?? 0) / 0.28) * 100);
  const stability = Math.max(
    0,
    100 -
      ((frameQuality.irisJump ?? 0) / 0.12) * 60 -
      ((frameQuality.headMotion ?? 0) / 0.08) * 40
  );
  const calibration = calibrationStatus.successful
    ? 100
    : Math.min(100, (calibrationStatus.overallProgress ?? 0) * 70);
  const gatePenalty = frameQuality.valid ? 1 : 0.35;
  return Math.round((iris * 0.3 + openness * 0.25 + stability * 0.25 + calibration * 0.2) * gatePenalty);
}

function summarizeFrameQuality(frameQuality) {
  return {
    valid: frameQuality.valid,
    reasons: frameQuality.reasons,
    qualityScore: frameQuality.qualityScore,
    irisVisibility: frameQuality.irisVisibility,
    eyeOpenness: frameQuality.eyeOpenness,
    faceSize: frameQuality.faceSize,
    irisJump: frameQuality.irisJump,
    headMotion: frameQuality.headMotion,
  };
}

function summarizeClassification(classification, thresholds, frameQuality) {
  const centerHorizontalMedian = thresholds.centerHorizontal ?? DEFAULT_GAZE_THRESHOLDS.centerHorizontal;
  const centerVerticalMedian = thresholds.centerVertical ?? DEFAULT_GAZE_THRESHOLDS.centerVertical;

  if (!classification) {
    return {
      centerHorizontalMedian,
      centerVerticalMedian,
      horizontalOffset: 0,
      verticalOffset: 0,
      distanceFromCenter: 0,
      horizontalScore: 0,
      verticalScore: 0,
      reason: frameQuality?.valid
        ? 'No classification available.'
        : `Frame rejected: ${(frameQuality?.reasons || ['invalid_frame']).join(', ')}.`,
    };
  }

  return {
    centerHorizontalMedian,
    centerVerticalMedian,
    horizontalOffset: classification.horizontalOffset ?? 0,
    verticalOffset: classification.verticalOffset ?? 0,
    distanceFromCenter: classification.distanceFromCenter ?? 0,
    horizontalScore: classification.horizontalScore ?? 0,
    verticalScore: classification.verticalScore ?? 0,
    reason: classification.reason || 'No classification reason available.',
  };
}
