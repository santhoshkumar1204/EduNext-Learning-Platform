export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function standardDeviation(values) {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

// Median absolute deviation is a robust dispersion estimator:
// MAD = median(|x_i - median(x)|). Multiplying by 1.4826 makes it comparable
// to standard deviation when the underlying observations are approximately
// normal, while still resisting isolated blink-detection spikes.
export function medianAbsoluteDeviation(values) {
  if (values.length < 2) return 0;
  const center = median(values);
  return median(values.map((value) => Math.abs(value - center)));
}

export function robustScale(values) {
  return medianAbsoluteDeviation(values) * 1.4826;
}

export function robustSummary(values) {
  return {
    median: median(values),
    mad: medianAbsoluteDeviation(values),
    scale: robustScale(values),
    sampleCount: values.length,
  };
}

export function robustZScore(value, center, scale) {
  if (!Number.isFinite(value) || !Number.isFinite(center) || !scale) return 0;
  return (value - center) / scale;
}

export function minMax(values) {
  if (!values.length) return { min: 0, max: 0 };
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function coefficientOfVariation(values) {
  const avg = mean(values);
  if (!avg) return 0;
  return standardDeviation(values) / avg;
}

export function pruneByTime(items, now, windowMs, getTime = (item) => item.t) {
  return items.filter((item) => now - getTime(item) <= windowMs);
}

export function linearSlope(points, getX, getY) {
  if (points.length < 2) return 0;
  const avgX = mean(points.map(getX));
  const avgY = mean(points.map(getY));
  let numerator = 0;
  let denominator = 0;
  for (const point of points) {
    const dx = getX(point) - avgX;
    numerator += dx * (getY(point) - avgY);
    denominator += dx * dx;
  }
  return denominator ? numerator / denominator : 0;
}
