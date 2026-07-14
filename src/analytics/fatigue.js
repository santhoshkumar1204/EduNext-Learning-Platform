import { clamp, linearSlope, mean, pruneByTime, robustZScore } from './statistics.js';

const FATIGUE_WINDOW_MS = 5 * 60_000;
const FATIGUE_HISTORY_MS = 20 * 60_000;

export function createFatigueStore() {
  return {
    blinkSamples: [],
    tickSamples: [],
    fatigueHistory: [],
  };
}

export function recordFatigueBlink(store, event, now = event.t) {
  store.blinkSamples.push({
    t: event.t,
    duration: event.duration,
    ibi: event.ibi,
  });
  store.blinkSamples = pruneByTime(store.blinkSamples, now, FATIGUE_WINDOW_MS);
}

export function recordFatigueTick(store, bpm, profile, now) {
  store.tickSamples.push({ t: now, bpm });
  store.tickSamples = pruneByTime(store.tickSamples, now, FATIGUE_WINDOW_MS);

  const durationValues = store.blinkSamples.map((sample) => sample.duration);
  const ibiValues = store.blinkSamples
    .map((sample) => sample.ibi)
    .filter((value) => value > 0);
  const durationAvg = mean(durationValues);
  const ibiAvg = mean(ibiValues);
  const bpmAvg = mean(store.tickSamples.map((sample) => sample.bpm));

  // Personalized fatigue is estimated from robust z-scores against the user's
  // own baseline. Positive duration and BPM deviations are interpreted as
  // fatigue pressure; negative IBI deviations capture more frequent blinking.
  const bpmZ = robustZScore(bpmAvg, profile.bpm, profile.bpmScale);
  const ibiZ = robustZScore(ibiAvg, profile.ibi, profile.ibiScale);
  const blinkDurationZ = robustZScore(
    durationAvg,
    profile.blinkDuration,
    profile.blinkDurationScale
  );
  const fatigueEvidence = mean([
    Math.max(0, bpmZ),
    Math.max(0, -ibiZ),
    Math.max(0, blinkDurationZ),
  ]);
  const confidence = profile.confidence ?? 0;
  const fatigueScore = confidence * zEvidenceToScore(fatigueEvidence);
  const durationSlope = linearSlope(
    store.blinkSamples,
    (sample) => sample.t,
    (sample) => sample.duration
  );
  const bpmSlope = linearSlope(
    store.tickSamples,
    (sample) => sample.t,
    (sample) => sample.bpm
  );

  const value = {
    fatigueIndex: fatigueScore,
    fatigueScore,
    fatigueConfidence: confidence,
    bpmZ,
    ibiZ,
    blinkDurationZ,
    fatigueEvidence,
    durationTrend: durationSlope * 60_000,
    blinkFrequencyTrend: bpmSlope * 60_000,
    ibiTrend: linearSlope(
      store.blinkSamples.filter((sample) => sample.ibi > 0),
      (sample) => sample.t,
      (sample) => sample.ibi
    ) * 60_000,
    rollingAvgDuration: durationAvg,
    rollingAvgBpm: bpmAvg,
    rollingAvgIbi: ibiAvg,
  };

  store.fatigueHistory.push({ t: now, ...value });
  store.fatigueHistory = pruneByTime(store.fatigueHistory, now, FATIGUE_HISTORY_MS);
  return {
    ...value,
    history: store.fatigueHistory,
  };
}

function zEvidenceToScore(evidence) {
  if (!Number.isFinite(evidence) || evidence <= 0) return 0;
  return clamp((1 - Math.exp(-evidence / 2)) * 100, 0, 100);
}
