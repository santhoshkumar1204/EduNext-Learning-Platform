import { clamp, linearSlope, pruneByTime } from './statistics.js';

const DRIFT_HISTORY_MS = 20 * 60_000;
const SHORT_WINDOW_MS = 60_000;
const MEDIUM_WINDOW_MS = 5 * 60_000;
const LONG_WINDOW_MS = 15 * 60_000;
const STABLE_SLOPE_PER_MIN = 2;

export function createAttentionDriftStore() {
  return {
    history: [],
  };
}

export function recordAttentionDrift(store, sample, now) {
  const score = attentionScoreFromPersonalizedState(sample);
  store.history.push({
    t: now,
    score,
    fatigueIndex: sample.fatigueIndex,
    bpm: sample.bpm,
    confidence: sample.confidence ?? 0,
  });
  store.history = pruneByTime(store.history, now, DRIFT_HISTORY_MS);

  const windows = {
    short: summarizeWindow(store.history, now, SHORT_WINDOW_MS),
    medium: summarizeWindow(store.history, now, MEDIUM_WINDOW_MS),
    long: summarizeWindow(store.history, now, LONG_WINDOW_MS),
  };
  const slope = windows.short.slope * 0.5 + windows.medium.slope * 0.3 + windows.long.slope * 0.2;
  const confidence = windowConfidence(windows);

  let trendLabel = 'Stable';
  if (confidence >= 0.35 && slope > STABLE_SLOPE_PER_MIN) trendLabel = 'Improving';
  if (confidence >= 0.35 && slope < -STABLE_SLOPE_PER_MIN) trendLabel = 'Declining';

  return {
    attentionDriftScore: score,
    attentionTrend: slope,
    attentionTrendConfidence: confidence,
    trendConfidence: confidence,
    windows,
    increasingFatigue: sample.fatigueIndex > 60 && slope < 0,
    stableAttention: trendLabel === 'Stable',
    decliningAttention: trendLabel === 'Declining',
    trendLabel,
    history: store.history,
  };
}

function attentionScoreFromPersonalizedState(sample) {
  const fatiguePenalty = clamp(sample.fatigueIndex, 0, 100);
  const confidence = sample.confidence ?? 0;
  return clamp(100 - fatiguePenalty * confidence, 0, 100);
}

function summarizeWindow(history, now, windowMs) {
  const points = history.filter((point) => now - point.t <= windowMs);
  const slope =
    linearSlope(
      points,
      (point) => point.t,
      (point) => point.score
    ) * 60_000;
  return {
    slope,
    sampleCount: points.length,
    confidence: clamp(points.length / Math.max(3, Math.floor(windowMs / 5_000)), 0, 1),
  };
}

function windowConfidence(windows) {
  return clamp(
    windows.short.confidence * 0.5 +
      windows.medium.confidence * 0.3 +
      windows.long.confidence * 0.2,
    0,
    1
  );
}
