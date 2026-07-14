export const DEFAULT_GAZE_THRESHOLDS = {
  left: 0.42,
  right: 0.58,
  up: 0.38,
  down: 0.62,
  centerHorizontal: 0.5,
  centerVertical: 0.5,
};

export function summarizeGazeThresholds(thresholds = DEFAULT_GAZE_THRESHOLDS) {
  const normalized = normalizeThresholds(thresholds);
  return {
    Center: {
      horizontalMin: normalized.left,
      horizontalMax: normalized.right,
      verticalMin: normalized.up,
      verticalMax: normalized.down,
      horizontalMedian: normalized.centerHorizontal,
      verticalMedian: normalized.centerVertical,
    },
    Left: {
      horizontalMaxExclusive: normalized.left,
      offsetTrigger: normalized.leftOffset,
    },
    Right: {
      horizontalMinExclusive: normalized.right,
      offsetTrigger: normalized.rightOffset,
    },
    Up: {
      verticalMaxExclusive: normalized.up,
      offsetTrigger: normalized.upOffset,
    },
    Down: {
      verticalMinExclusive: normalized.down,
      offsetTrigger: normalized.downOffset,
    },
  };
}

export function classifyGazeDirection(
  { horizontalRatio, verticalRatio },
  thresholds = DEFAULT_GAZE_THRESHOLDS
) {
  return analyzeGazeDirection({ horizontalRatio, verticalRatio }, thresholds).direction;
}

export function analyzeGazeDirection(
  { horizontalRatio, verticalRatio },
  thresholds = DEFAULT_GAZE_THRESHOLDS
) {
  const normalized = normalizeThresholds(thresholds);
  const horizontalOffset = horizontalRatio - normalized.centerHorizontal;
  const verticalOffset = verticalRatio - normalized.centerVertical;
  const distanceFromCenter = Math.hypot(horizontalOffset, verticalOffset);

  const horizontalScore = axisExcursionScore(
    horizontalOffset,
    normalized.leftOffset,
    normalized.rightOffset
  );
  const verticalScore = axisExcursionScore(
    verticalOffset,
    normalized.upOffset,
    normalized.downOffset
  );
  const isCentered = horizontalScore <= 1 && verticalScore <= 1;

  if (isCentered) {
    return {
      direction: 'Center',
      horizontalOffset,
      verticalOffset,
      distanceFromCenter,
      centerHorizontal: normalized.centerHorizontal,
      centerVertical: normalized.centerVertical,
      horizontalScore,
      verticalScore,
      reason:
        `Inside calibrated center window: H ${signed(horizontalOffset)} in ` +
        `[${signed(normalized.leftOffset)}, ${signed(normalized.rightOffset)}], ` +
        `V ${signed(verticalOffset)} in ` +
        `[${signed(normalized.upOffset)}, ${signed(normalized.downOffset)}].`,
    };
  }

  if (horizontalScore >= verticalScore) {
    const direction = horizontalOffset < 0 ? 'Left' : 'Right';
    const boundary = horizontalOffset < 0 ? normalized.leftOffset : normalized.rightOffset;
    return {
      direction,
      horizontalOffset,
      verticalOffset,
      distanceFromCenter,
      centerHorizontal: normalized.centerHorizontal,
      centerVertical: normalized.centerVertical,
      horizontalScore,
      verticalScore,
      reason:
        `${direction} because horizontal offset ${signed(horizontalOffset)} crossed ` +
        `the calibrated boundary ${signed(boundary)} and exceeds vertical excursion ` +
        `(${horizontalScore.toFixed(2)}x vs ${verticalScore.toFixed(2)}x).`,
    };
  }

  const direction = verticalOffset < 0 ? 'Up' : 'Down';
  const boundary = verticalOffset < 0 ? normalized.upOffset : normalized.downOffset;
  return {
    direction,
    horizontalOffset,
    verticalOffset,
    distanceFromCenter,
    centerHorizontal: normalized.centerHorizontal,
    centerVertical: normalized.centerVertical,
    horizontalScore,
    verticalScore,
    reason:
      `${direction} because vertical offset ${signed(verticalOffset)} crossed ` +
      `the calibrated boundary ${signed(boundary)} and exceeds horizontal excursion ` +
      `(${verticalScore.toFixed(2)}x vs ${horizontalScore.toFixed(2)}x).`,
  };
}

function normalizeThresholds(thresholds = DEFAULT_GAZE_THRESHOLDS) {
  const centerHorizontal = finiteOr(thresholds.centerHorizontal, 0.5);
  const centerVertical = finiteOr(thresholds.centerVertical, 0.5);
  const left = finiteOr(thresholds.left, DEFAULT_GAZE_THRESHOLDS.left);
  const right = finiteOr(thresholds.right, DEFAULT_GAZE_THRESHOLDS.right);
  const up = finiteOr(thresholds.up, DEFAULT_GAZE_THRESHOLDS.up);
  const down = finiteOr(thresholds.down, DEFAULT_GAZE_THRESHOLDS.down);

  return {
    left,
    right,
    up,
    down,
    centerHorizontal,
    centerVertical,
    leftOffset: Math.min(left - centerHorizontal, -0.001),
    rightOffset: Math.max(right - centerHorizontal, 0.001),
    upOffset: Math.min(up - centerVertical, -0.001),
    downOffset: Math.max(down - centerVertical, 0.001),
  };
}

function axisExcursionScore(offset, negativeBoundary, positiveBoundary) {
  if (!Number.isFinite(offset)) return 0;
  if (offset < 0) {
    return Math.abs(offset) / Math.abs(negativeBoundary || -0.001);
  }
  return Math.abs(offset) / Math.abs(positiveBoundary || 0.001);
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function signed(value) {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(3)}`;
}
