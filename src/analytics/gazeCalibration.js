import { mean, median, medianAbsoluteDeviation, minMax, standardDeviation } from './statistics.js';
import { classifyGazeDirection, DEFAULT_GAZE_THRESHOLDS } from './gazeDirection.js';

export const GAZE_CALIBRATION_STAGES = ['Center', 'Left', 'Right', 'Up', 'Down'];
export const GAZE_CALIBRATION_STAGE_MS = 5_000;

const MIN_VALID_SAMPLES_PER_STAGE = 10;
const EMPTY_CONFUSION = {
  Center: 0,
  Left: 0,
  Right: 0,
  Up: 0,
  Down: 0,
};

export function createGazeCalibrationStore() {
  return {
    active: false,
    startedAt: 0,
    completed: false,
    successful: false,
    samplesByTarget: emptySamples(),
    rejectedByTarget: emptyRejected(),
    countersByTarget: emptyCounters(),
    thresholds: DEFAULT_GAZE_THRESHOLDS,
    report: createEmptyReport(),
    validationReport: createValidationReport({
      quality: 'Not calibrated',
      confidence: 0,
      separability: 0,
      reliabilityScore: 'Poor',
      recommendation: 'Run guided gaze calibration with stable lighting and open eyes.',
    }),
  };
}

export function startGazeCalibration(store, now = Date.now()) {
  store.active = true;
  store.startedAt = now;
  store.completed = false;
  store.successful = false;
  store.samplesByTarget = emptySamples();
  store.rejectedByTarget = emptyRejected();
  store.countersByTarget = emptyCounters();
  store.thresholds = DEFAULT_GAZE_THRESHOLDS;
  store.report = createEmptyReport();
  store.validationReport = createValidationReport({
    quality: 'Collecting',
    confidence: 0,
    separability: 0,
    reliabilityScore: 'Poor',
    recommendation: 'Complete all five gaze targets.',
  });
}

export function recordGazeCalibrationFrame(store, frame, detectedDirection, now = frame.t) {
  if (!store.active) return;

  const target = currentTarget(store, now);
  if (!target) {
    completeGazeCalibration(store);
    return;
  }

  const counters = store.countersByTarget[target];
  counters.collectedFrames += 1;

  if (!frame.valid) {
    counters.rejectedFrames += 1;
    for (const reason of frame.reasons || ['unknown']) {
      counters.rejectionReasons[reason] = (counters.rejectionReasons[reason] || 0) + 1;
    }
    store.rejectedByTarget[target].push({
      t: now,
      reasons: frame.reasons || ['unknown'],
      qualityScore: frame.qualityScore ?? 0,
    });
    refreshActiveCalibrationReport(store);
    return;
  }

  counters.validFrames += 1;
  const sample = frame.ratios;
  store.samplesByTarget[target].push({
    t: now,
    detectedDirection,
    horizontalRatio: sample.horizontalRatio,
    verticalRatio: sample.verticalRatio,
    leftHorizontalRatio: sample.leftEye?.horizontalRatio ?? 0,
    rightHorizontalRatio: sample.rightEye?.horizontalRatio ?? 0,
    leftVerticalRatio: sample.leftEye?.verticalRatio ?? 0,
    rightVerticalRatio: sample.rightEye?.verticalRatio ?? 0,
    qualityScore: frame.qualityScore ?? 0,
  });
  refreshActiveCalibrationReport(store);
}

export function getGazeCalibrationStatus(store, now = Date.now()) {
  if (!store.active) {
    return {
      active: false,
      completed: store.completed,
      successful: store.successful,
      currentTarget: null,
      stageIndex: -1,
      stageProgress: 0,
      overallProgress: store.completed ? 1 : 0,
      sampleCounters: store.countersByTarget,
      validationReport: store.validationReport,
    };
  }

  const elapsed = now - store.startedAt;
  const stageIndex = Math.floor(elapsed / GAZE_CALIBRATION_STAGE_MS);
  if (stageIndex >= GAZE_CALIBRATION_STAGES.length) {
    completeGazeCalibration(store);
    return getGazeCalibrationStatus(store, now);
  }

  return {
    active: true,
    completed: false,
    successful: false,
    currentTarget: GAZE_CALIBRATION_STAGES[stageIndex],
    stageIndex,
    stageProgress: (elapsed % GAZE_CALIBRATION_STAGE_MS) / GAZE_CALIBRATION_STAGE_MS,
    overallProgress: elapsed / (GAZE_CALIBRATION_STAGE_MS * GAZE_CALIBRATION_STAGES.length),
    sampleCounters: store.countersByTarget,
    validationReport: store.validationReport,
  };
}

function completeGazeCalibration(store) {
  store.active = false;
  store.completed = true;
  store.successful = hasMinimumSamples(store.samplesByTarget);
  store.thresholds = store.successful
    ? derivePersonalizedThresholds(store.samplesByTarget)
    : DEFAULT_GAZE_THRESHOLDS;
  store.report = buildAccuracyReport(store.samplesByTarget, store.countersByTarget, store.thresholds);
  store.validationReport = buildValidationReport(store);
}

function refreshActiveCalibrationReport(store) {
  store.report = buildAccuracyReport(store.samplesByTarget, store.countersByTarget, store.thresholds);
  store.validationReport = createValidationReport({
    quality: 'Collecting',
    confidence: calibrationConfidence(store),
    separability: directionSeparability(store.samplesByTarget),
    reliabilityScore: 'Poor',
    recommendation: 'Complete all five gaze targets.',
  });
}

function currentTarget(store, now) {
  const elapsed = now - store.startedAt;
  const stageIndex = Math.floor(elapsed / GAZE_CALIBRATION_STAGE_MS);
  return GAZE_CALIBRATION_STAGES[stageIndex] || null;
}

function hasMinimumSamples(samplesByTarget) {
  return GAZE_CALIBRATION_STAGES.every(
    (target) => samplesByTarget[target].length >= MIN_VALID_SAMPLES_PER_STAGE
  );
}

function derivePersonalizedThresholds(samplesByTarget) {
  const center = summarizeSamples(samplesByTarget.Center);
  const left = summarizeSamples(samplesByTarget.Left);
  const right = summarizeSamples(samplesByTarget.Right);
  const up = summarizeSamples(samplesByTarget.Up);
  const down = summarizeSamples(samplesByTarget.Down);
  const centerHorizontal = finiteOr(center.horizontal.median, DEFAULT_GAZE_THRESHOLDS.centerHorizontal);
  const centerVertical = finiteOr(center.vertical.median, DEFAULT_GAZE_THRESHOLDS.centerVertical);
  const horizontalDeadzone = Math.max(center.horizontal.mad * 2, 0.03);
  const verticalDeadzone = Math.max(center.vertical.mad * 2, 0.03);

  return {
    centerHorizontal,
    centerVertical,
    left: lowerBoundary(
      left.horizontal.median,
      centerHorizontal,
      horizontalDeadzone,
      DEFAULT_GAZE_THRESHOLDS.left
    ),
    right: upperBoundary(
      centerHorizontal,
      right.horizontal.median,
      horizontalDeadzone,
      DEFAULT_GAZE_THRESHOLDS.right
    ),
    up: lowerBoundary(
      up.vertical.median,
      centerVertical,
      verticalDeadzone,
      DEFAULT_GAZE_THRESHOLDS.up
    ),
    down: upperBoundary(
      centerVertical,
      down.vertical.median,
      verticalDeadzone,
      DEFAULT_GAZE_THRESHOLDS.down
    ),
  };
}

function buildAccuracyReport(samplesByTarget, countersByTarget, thresholds) {
  return Object.fromEntries(
    GAZE_CALIBRATION_STAGES.map((target) => {
      const samples = samplesByTarget[target];
      const confusion = { ...EMPTY_CONFUSION };
      for (const sample of samples) {
        const predicted = classifyGazeDirection(sample, thresholds);
        confusion[predicted] = (confusion[predicted] || 0) + 1;
      }
      const detectedFrames = confusion[target] || 0;
      return [
        target,
        {
          detectedFrames,
          totalFrames: samples.length,
          percentage: samples.length ? (detectedFrames / samples.length) * 100 : 0,
          confusionCases: confusion,
          confusionMatrixRow: confusion,
          sampleCounters: countersByTarget[target],
          qualityMetrics: summarizeSamples(samples),
          observedRanges: summarizeSamples(samples),
        },
      ];
    })
  );
}

function buildValidationReport(store) {
  const separability = directionSeparability(store.samplesByTarget);
  const confidence = calibrationConfidence(store);
  const reliabilityScore = reliabilityLabel(separability, confidence, store.successful);
  return createValidationReport({
    quality: store.successful ? 'Complete' : 'Insufficient valid samples',
    confidence,
    separability,
    reliabilityScore,
    recommendation: recommendationFor(reliabilityScore, store.successful),
  });
}

function calibrationConfidence(store) {
  const counters = GAZE_CALIBRATION_STAGES.map((stage) => store.countersByTarget[stage]);
  const valid = counters.reduce((sum, item) => sum + item.validFrames, 0);
  const collected = counters.reduce((sum, item) => sum + item.collectedFrames, 0);
  const sampleCoverage = GAZE_CALIBRATION_STAGES.reduce(
    (sum, stage) =>
      sum + Math.min(1, store.samplesByTarget[stage].length / MIN_VALID_SAMPLES_PER_STAGE),
    0
  ) / GAZE_CALIBRATION_STAGES.length;
  const validRate = collected ? valid / collected : 0;
  return Math.round((sampleCoverage * 0.65 + validRate * 0.35) * 100);
}

function directionSeparability(samplesByTarget) {
  const center = summarizeSamples(samplesByTarget.Center);
  const left = summarizeSamples(samplesByTarget.Left);
  const right = summarizeSamples(samplesByTarget.Right);
  const up = summarizeSamples(samplesByTarget.Up);
  const down = summarizeSamples(samplesByTarget.Down);
  const horizontalSpread =
    center.horizontal.mad + left.horizontal.mad + right.horizontal.mad + 0.001;
  const verticalSpread = center.vertical.mad + up.vertical.mad + down.vertical.mad + 0.001;
  const leftSep = Math.abs(center.horizontal.median - left.horizontal.median) / horizontalSpread;
  const rightSep = Math.abs(right.horizontal.median - center.horizontal.median) / horizontalSpread;
  const upSep = Math.abs(center.vertical.median - up.vertical.median) / verticalSpread;
  const downSep = Math.abs(down.vertical.median - center.vertical.median) / verticalSpread;
  return Math.round(Math.min(100, mean([leftSep, rightSep, upSep, downSep]) * 25));
}

function reliabilityLabel(separability, confidence, successful) {
  if (!successful) return 'Poor';
  const score = separability * 0.6 + confidence * 0.4;
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function recommendationFor(reliabilityScore, successful) {
  if (!successful) return 'Repeat calibration; keep eyes open and face centered for all targets.';
  if (reliabilityScore === 'Excellent') return 'Calibration is reliable for current conditions.';
  if (reliabilityScore === 'Good') return 'Calibration is usable; retest if lighting or camera position changes.';
  if (reliabilityScore === 'Fair') return 'Use with caution; repeat calibration for stronger class separation.';
  return 'Repeat calibration with steadier head position, larger face framing, and brighter lighting.';
}

function summarizeSamples(samples) {
  const horizontalValues = samples.map((sample) => sample.horizontalRatio);
  const verticalValues = samples.map((sample) => sample.verticalRatio);
  const leftHorizontalValues = samples.map((sample) => sample.leftHorizontalRatio);
  const rightHorizontalValues = samples.map((sample) => sample.rightHorizontalRatio);
  const leftVerticalValues = samples.map((sample) => sample.leftVerticalRatio);
  const rightVerticalValues = samples.map((sample) => sample.rightVerticalRatio);

  return {
    horizontal: summarizeValues(horizontalValues),
    vertical: summarizeValues(verticalValues),
    leftHorizontal: summarizeValues(leftHorizontalValues),
    rightHorizontal: summarizeValues(rightHorizontalValues),
    leftVertical: summarizeValues(leftVerticalValues),
    rightVertical: summarizeValues(rightVerticalValues),
    sampleCount: samples.length,
  };
}

function summarizeValues(values) {
  const { min, max } = minMax(values);
  return {
    min,
    max,
    mean: mean(values),
    median: median(values),
    mad: medianAbsoluteDeviation(values),
    standardDeviation: standardDeviation(values),
    sampleCount: values.length,
  };
}

function midpoint(a, b, fallback) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return fallback;
  return (a + b) / 2;
}

function lowerBoundary(targetMedian, centerMedian, centerDeadzone, fallback) {
  const midpointValue = midpoint(targetMedian, centerMedian, fallback);
  return Math.min(midpointValue, centerMedian - centerDeadzone);
}

function upperBoundary(centerMedian, targetMedian, centerDeadzone, fallback) {
  const midpointValue = midpoint(centerMedian, targetMedian, fallback);
  return Math.max(midpointValue, centerMedian + centerDeadzone);
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function emptySamples() {
  return Object.fromEntries(GAZE_CALIBRATION_STAGES.map((stage) => [stage, []]));
}

function emptyRejected() {
  return Object.fromEntries(GAZE_CALIBRATION_STAGES.map((stage) => [stage, []]));
}

function emptyCounters() {
  return Object.fromEntries(
    GAZE_CALIBRATION_STAGES.map((stage) => [
      stage,
      {
        collectedFrames: 0,
        validFrames: 0,
        rejectedFrames: 0,
        rejectionReasons: {},
      },
    ])
  );
}

function createEmptyReport() {
  return Object.fromEntries(
    GAZE_CALIBRATION_STAGES.map((stage) => [
      stage,
      {
        detectedFrames: 0,
        totalFrames: 0,
        percentage: 0,
        confusionCases: { ...EMPTY_CONFUSION },
        confusionMatrixRow: { ...EMPTY_CONFUSION },
        sampleCounters: emptyCounters()[stage],
        qualityMetrics: summarizeSamples([]),
        observedRanges: summarizeSamples([]),
      },
    ])
  );
}

function createValidationReport({
  quality,
  confidence,
  separability,
  reliabilityScore,
  recommendation,
}) {
  return {
    calibrationQuality: quality,
    confidence,
    directionSeparability: separability,
    reliabilityScore,
    recommendation,
  };
}
