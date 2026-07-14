import { clamp, pruneByTime } from './statistics.js';

export const GAZE_DIRECTIONS = ['Center', 'Left', 'Right', 'Up', 'Down'];

const ROLLING_WINDOW_MS = 60_000;

export function createGazeMetricsStore() {
  return {
    lastFrameAt: 0,
    totalFrames: 0,
    centerFrames: 0,
    centerMs: 0,
    directionCounts: emptyDistribution(),
    directionMs: emptyDistribution(),
    rollingFrames: [],
  };
}

export function updateGazeMetrics(store, frame) {
  const direction = GAZE_DIRECTIONS.includes(frame.gazeDirection)
    ? frame.gazeDirection
    : 'Center';
  const isCenter = direction === 'Center';
  const dt = frameDelta(store, frame.t);

  store.lastFrameAt = frame.t;
  store.totalFrames += 1;
  store.directionCounts[direction] += 1;
  store.directionMs[direction] += dt;
  if (isCenter) {
    store.centerFrames += 1;
    store.centerMs += dt;
  }

  store.rollingFrames.push({ t: frame.t, gazeDirection: direction, isCenter });
  store.rollingFrames = pruneByTime(store.rollingFrames, frame.t, ROLLING_WINDOW_MS);

  const rollingCenterFrames = store.rollingFrames.filter((item) => item.isCenter).length;
  const rollingGazeScore = percentage(rollingCenterFrames, store.rollingFrames.length);
  const sessionGazeScore = percentage(store.centerFrames, store.totalFrames);

  return {
    currentGazeScore: isCenter ? 100 : 0,
    rollingGazeScore,
    sessionGazeScore,
    gazeScore: rollingGazeScore,
    totalFrames: store.totalFrames,
    centerFrames: store.centerFrames,
    timeLookingCenterMs: store.centerMs,
    timeByDirectionMs: { ...store.directionMs },
    directionDistribution: distributionPercent(store.directionCounts, store.totalFrames),
    directionFrameCounts: { ...store.directionCounts },
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
  return Object.fromEntries(GAZE_DIRECTIONS.map((direction) => [direction, 0]));
}

function distributionPercent(counts, total) {
  return Object.fromEntries(
    GAZE_DIRECTIONS.map((direction) => [direction, percentage(counts[direction], total)])
  );
}
