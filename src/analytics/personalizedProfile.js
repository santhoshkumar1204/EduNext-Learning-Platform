import { clamp, pruneByTime, robustSummary } from './statistics.js';

const PROFILE_BOOTSTRAP_MS = 60_000;
const PROFILE_ROLLING_WINDOW_MS = 5 * 60_000;

const PROFILE_REQUIREMENTS = {
  ear: 90,
  bpm: 8,
  ibi: 5,
  blinkDuration: 5,
};

const MIN_RELATIVE_SCALE = {
  ear: 0.02,
  bpm: 0.1,
  ibi: 0.1,
  blinkDuration: 0.1,
};

export function createPersonalizedProfileStore(startedAt = Date.now()) {
  return {
    startedAt,
    earSamples: [],
    bpmSamples: [],
    ibiSamples: [],
    durationSamples: [],
    baseline: {
      ear: 0,
      earMad: 0,
      earScale: 0,
      bpm: 0,
      bpmMad: 0,
      bpmScale: 0,
      ibi: 0,
      ibiMad: 0,
      ibiScale: 0,
      blinkDuration: 0,
      blinkDurationMad: 0,
      blinkDurationScale: 0,
      ready: false,
      sampleCount: 0,
      confidence: 0,
      confidenceByMetric: {
        ear: 0,
        bpm: 0,
        ibi: 0,
        blinkDuration: 0,
      },
    },
  };
}

export function recordEyeSample(store, sample, now = sample.t) {
  if (!Number.isFinite(sample.ear) || sample.ear <= 0) return;
  store.earSamples.push({ t: sample.t, value: sample.ear });
  store.earSamples = pruneByTime(store.earSamples, now, PROFILE_ROLLING_WINDOW_MS);
}

export function recordProfileBlink(store, event, now = event.t) {
  if (event.duration > 0) {
    store.durationSamples.push({ t: event.t, value: event.duration });
  }
  if (event.ibi > 0) {
    store.ibiSamples.push({ t: event.t, value: event.ibi });
  }
  store.durationSamples = pruneByTime(store.durationSamples, now, PROFILE_ROLLING_WINDOW_MS);
  store.ibiSamples = pruneByTime(store.ibiSamples, now, PROFILE_ROLLING_WINDOW_MS);
}

export function recordProfileTick(store, bpm, now) {
  store.bpmSamples.push({ t: now, value: bpm });
  store.bpmSamples = pruneByTime(store.bpmSamples, now, PROFILE_ROLLING_WINDOW_MS);
  updateBaseline(store, now);
  return store.baseline;
}

function updateBaseline(store, now) {
  const summaries = {
    ear: robustSummary(store.earSamples.map((sample) => sample.value)),
    bpm: robustSummary(store.bpmSamples.map((sample) => sample.value)),
    ibi: robustSummary(store.ibiSamples.map((sample) => sample.value)),
    blinkDuration: robustSummary(store.durationSamples.map((sample) => sample.value)),
  };

  const sampleCount =
    store.earSamples.length +
    store.bpmSamples.length +
    store.ibiSamples.length +
    store.durationSamples.length;
  const confidenceByMetric = {};
  for (const [key, summary] of Object.entries(summaries)) {
    store.baseline[key] = summary.median;
    store.baseline[`${key}Mad`] = summary.mad;
    store.baseline[`${key}Scale`] = scaleWithFloor(key, summary);
    confidenceByMetric[key] = confidenceForMetric(key, summary.sampleCount);
  }

  store.baseline.sampleCount = sampleCount;
  store.baseline.confidenceByMetric = confidenceByMetric;
  store.baseline.confidence = profileConfidence(confidenceByMetric, now - store.startedAt);
  store.baseline.ready = store.baseline.confidence >= 0.75;
}

function confidenceForMetric(key, count) {
  return clamp(count / PROFILE_REQUIREMENTS[key], 0, 1);
}

function profileConfidence(confidenceByMetric, elapsedMs) {
  const elapsedConfidence = clamp(elapsedMs / PROFILE_BOOTSTRAP_MS, 0, 1);
  const physiologicalConfidence =
    confidenceByMetric.ear * 0.25 +
    confidenceByMetric.bpm * 0.25 +
    confidenceByMetric.ibi * 0.25 +
    confidenceByMetric.blinkDuration * 0.25;
  return clamp(elapsedConfidence * physiologicalConfidence, 0, 1);
}

function scaleWithFloor(key, summary) {
  if (!summary.median) return 0;
  const floor = Math.abs(summary.median) * MIN_RELATIVE_SCALE[key];
  return Math.max(summary.scale, floor);
}
