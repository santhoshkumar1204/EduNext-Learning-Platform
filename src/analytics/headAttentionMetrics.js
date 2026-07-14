import { clamp, pruneByTime } from './statistics.js';

export const HEAD_DIRECTIONS = ['Forward', 'Left', 'Right', 'Up', 'Down'];

const ROLLING_WINDOW_MS = 60_000;

export function createHeadAttentionStore(startedAt = Date.now()) {
  return {
    startedAt,
    lastFrameAt: 0,
    totalFrames: 0,
    forwardFrames: 0,
    totalMs: 0,
    forwardMs: 0,
    awayMs: 0,
    rollingFrames: [],
    directionCounts: emptyDistribution(),
    directionMs: emptyDistribution(),
  };
}

export function updateHeadAttentionMetrics(store, frame) {
  const dt = frameDelta(store, frame.t);
  store.lastFrameAt = frame.t;
  store.totalFrames += 1;
  store.totalMs += dt;

  const direction = HEAD_DIRECTIONS.includes(frame.headDirection)
    ? frame.headDirection
    : 'Forward';
  store.directionCounts[direction] += 1;
  store.directionMs[direction] += dt;

  if (frame.isForward) {
    store.forwardFrames += 1;
    store.forwardMs += dt;
  } else {
    store.awayMs += dt;
  }

  store.rollingFrames.push({
    t: frame.t,
    isForward: frame.isForward,
    headDirection: direction,
  });
  store.rollingFrames = pruneByTime(store.rollingFrames, frame.t, ROLLING_WINDOW_MS);

  const rollingForwardFrames = store.rollingFrames.filter((item) => item.isForward).length;
  const rollingHeadScore = percentage(rollingForwardFrames, store.rollingFrames.length);
  const sessionHeadScore = percentage(store.forwardFrames, store.totalFrames);

  return {
    currentHeadScore: frame.isForward ? 100 : 0,
    rollingHeadScore,
    sessionHeadScore,
    headScore: rollingHeadScore,
    totalFrames: store.totalFrames,
    forwardFrames: store.forwardFrames,
    timeLookingForwardMs: store.forwardMs,
    timeLookingAwayMs: store.awayMs,
    directionDistribution: distributionPercent(store.directionCounts, store.totalFrames),
    directionFrameCounts: { ...store.directionCounts },
    directionDurationsMs: { ...store.directionMs },
  };
}

function frameDelta(store, t) {
  if (!store.lastFrameAt) return 0;
  return clamp(t - store.lastFrameAt, 0, 250);
}

function percentage(part, total) {
  if (!total) return 0;
  return (part / total) * 100;
}

function emptyDistribution() {
  return Object.fromEntries(HEAD_DIRECTIONS.map((direction) => [direction, 0]));
}

function distributionPercent(counts, total) {
  return Object.fromEntries(
    HEAD_DIRECTIONS.map((direction) => [direction, percentage(counts[direction], total)])
  );
}
