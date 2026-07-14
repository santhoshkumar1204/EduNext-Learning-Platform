import { coefficientOfVariation, mean, minMax, pruneByTime, standardDeviation } from './statistics.js';

const IBI_ROLLING_WINDOW_MS = 5 * 60_000;
const BURST_WINDOW_MS = 2_500;
const BURST_MIN_BLINKS = 3;

export function createBlinkEventStore() {
  return {
    events: [],
    intervals: [],
    bursts: [],
    activeBurstKey: null,
  };
}

export function recordBlinkEvent(store, blink, now = blink.t) {
  const previous = store.events[store.events.length - 1];
  const ibi = previous ? blink.t - previous.t : 0;
  const event = { ...blink, ibi };

  store.events.push(event);
  if (ibi > 0) {
    store.intervals.push({ t: blink.t, value: ibi });
  }

  store.events = pruneByTime(store.events, now, IBI_ROLLING_WINDOW_MS);
  store.intervals = pruneByTime(store.intervals, now, IBI_ROLLING_WINDOW_MS);

  detectBurst(store, now);
  return event;
}

function detectBurst(store, now) {
  const cluster = store.events.filter((event) => now - event.t <= BURST_WINDOW_MS);
  if (cluster.length < BURST_MIN_BLINKS) {
    store.activeBurstKey = null;
    return;
  }

  const first = cluster[0];
  const last = cluster[cluster.length - 1];
  const burstKey = `${first.t}:${last.t}:${cluster.length}`;
  if (store.activeBurstKey === burstKey) return;

  store.activeBurstKey = burstKey;
  store.bursts.push({
    t: last.t,
    start: first.t,
    end: last.t,
    blinkCount: cluster.length,
    duration: last.t - first.t,
  });
  store.bursts = pruneByTime(store.bursts, now, IBI_ROLLING_WINDOW_MS);
}

export function summarizeBlinkEvents(store, now) {
  const intervals = store.intervals.map((item) => item.value);
  const { min, max } = minMax(intervals);
  const avgIbi = mean(intervals);
  const ibiStdDev = standardDeviation(intervals);
  const variabilityIndex = coefficientOfVariation(intervals);
  const sessionMinutes = Math.max(
    1 / 60,
    (now - (store.events[0]?.t ?? now)) / 60_000
  );

  return {
    currentIbi: intervals[intervals.length - 1] ?? 0,
    avgIbi,
    minIbi: min,
    maxIbi: max,
    ibiStdDev,
    variabilityIndex,
    burstCount: store.bursts.length,
    burstFrequency: store.bursts.length / sessionMinutes,
    burstTimestamps: store.bursts.map((burst) => burst.t),
    recentBursts: store.bursts.slice(-10),
    intervalCount: intervals.length,
  };
}
