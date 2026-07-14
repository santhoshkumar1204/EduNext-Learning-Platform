import { clamp, mean } from './statistics.js';

const HISTORY_LIMIT = 120;
const PROFILE_READY_CONFIDENCE = 0.75;
const PROFILE_READY_SAMPLES = 15;
const CONFLICT_CONFIDENCE_FLOOR = 45;
const STRONG_CONFLICT_GAP = 45;
const BLINK_ZONES = [
  { key: 'hyperfocused', min: 0, max: 8 },
  { key: 'attentive', min: 8, max: 15 },
  { key: 'neutral', min: 15, max: 21 },
  { key: 'fatigued', min: 21, max: 31 },
  { key: 'sleepy', min: 31, max: Infinity },
];

export function createAttentionFusionStore() {
  return {
    history: [],
    confidenceHistory: [],
    contributionHistory: [],
  };
}

export function computeAttentionFusion({ blink, head, gaze, now = Date.now(), store }) {
  const blinkScore = blinkAttentionScore(blink);
  const headScore = headAttentionScore(head);
  const gazeScore = gazeAttentionScore(gaze);

  const blinkConfidence = blinkAttentionConfidence(blink);
  const headConfidence = headAttentionConfidence(head);
  const gazeConfidence = gazeAttentionConfidence(gaze);

  const confidenceSum = blinkConfidence + headConfidence + gazeConfidence;
  const safeSum = confidenceSum > 0 ? confidenceSum : 1;

  const blinkWeight = blinkConfidence / safeSum;
  const headWeight = headConfidence / safeSum;
  const gazeWeight = gazeConfidence / safeSum;

  const rawAttentionScore = clamp(
    blinkWeight * blinkScore + headWeight * headScore + gazeWeight * gazeScore,
    0,
    100
  );
  const conflictPenalty = computeConflictPenalty([
    { key: 'blink', score: blinkScore, confidence: blinkConfidence },
    { key: 'head', score: headScore, confidence: headConfidence },
    { key: 'gaze', score: gazeScore, confidence: gazeConfidence },
  ]);
  const finalAttentionScore = clamp(
    rawAttentionScore - conflictPenalty,
    0,
    100
  );
  const finalAttentionState = classifyAttentionState(finalAttentionScore);

  const contributions = {
    blink: blinkWeight * blinkScore,
    head: headWeight * headScore,
    gaze: gazeWeight * gazeScore,
  };

  const snapshot = {
    t: now,
    finalAttentionScore,
    finalAttentionState,
    rawAttentionScore,
    conflictPenalty,
    blinkScore,
    headScore,
    gazeScore,
    blinkConfidence,
    headConfidence,
    gazeConfidence,
    contributions,
    weights: {
      blink: blinkWeight,
      head: headWeight,
      gaze: gazeWeight,
    },
  };

  if (store) {
    store.history.push({
      t: now,
      finalAttentionScore,
      finalAttentionState,
      rawAttentionScore,
      conflictPenalty,
      blinkScore,
      headScore,
      gazeScore,
    });
    store.confidenceHistory.push({
      t: now,
      blinkConfidence,
      headConfidence,
      gazeConfidence,
    });
    store.contributionHistory.push({ t: now, ...contributions });
    store.history = pruneHistory(store.history);
    store.confidenceHistory = pruneHistory(store.confidenceHistory);
    store.contributionHistory = pruneHistory(store.contributionHistory);
  }

  return snapshot;
}

function blinkAttentionScore(blink) {
  const analytics = blink?.blinkAnalytics;
  const profile = analytics?.profile;
  if (!profileReady(profile)) {
    return bpmZoneAttentionScore(blink);
  }

  const fatigue = analytics?.fatigue;
  const drift = analytics?.attentionDrift;
  const attentionDriftScore = clamp(drift?.attentionDriftScore ?? 100, 0, 100);
  const fatigueScore = clamp(fatigue?.fatigueScore ?? 0, 0, 100);
  const inverseFatigueScore = 100 - fatigueScore;
  const baselineNormalityScore = baselineNormalityFromZScores([
    fatigue?.bpmZ,
    fatigue?.ibiZ,
    fatigue?.blinkDurationZ,
  ]);

  return clamp(
    attentionDriftScore * 0.4 +
      inverseFatigueScore * 0.35 +
      baselineNormalityScore * 0.25,
    0,
    100
  );
}

function bpmZoneAttentionScore(blink) {
  const bpm = blink?.currentBpm ?? 0;
  const zone = blink?.currentZone?.key ?? zoneForBpm(bpm);

  if (zone === 'attentive') return 100;
  if (zone === 'neutral') return clamp(88 - Math.abs(bpm - 18) * 2, 55, 88);
  if (zone === 'hyperfocused') return clamp(72 + (8 - bpm) * 2.5, 45, 76);
  if (zone === 'fatigued') return clamp(60 - (bpm - 21) * 2, 28, 60);
  return clamp(40 - (bpm - 31) * 1.5, 0, 40);
}

function zoneForBpm(bpm) {
  const match = BLINK_ZONES.find((zone) => bpm >= zone.min && bpm < zone.max);
  return match?.key ?? 'attentive';
}

function headAttentionScore(head) {
  const session = clamp(head?.sessionHeadScore ?? 0, 0, 100);
  const rolling = clamp(head?.rollingHeadScore ?? session, 0, 100);
  return clamp(rolling * 0.6 + session * 0.4, 0, 100);
}

function gazeAttentionScore(gaze) {
  const session = clamp(gaze?.sessionGazeScore ?? 0, 0, 100);
  const rolling = clamp(gaze?.rollingGazeScore ?? session, 0, 100);
  return clamp(rolling * 0.65 + session * 0.35, 0, 100);
}

function blinkAttentionConfidence(blink) {
  const analytics = blink?.blinkAnalytics;
  const profileConfidence = clamp(analytics?.profile?.confidence ?? 0, 0, 1) * 100;
  const fatigueConfidence = clamp(analytics?.fatigue?.fatigueConfidence ?? 0, 0, 1) * 100;
  const driftConfidence = clamp(
    analytics?.attentionDrift?.attentionTrendConfidence ??
      analytics?.attentionDrift?.trendConfidence ??
      0,
    0,
    1
  ) * 100;
  const faceAvailability = blink?.faceDetected ? 100 : 0;
  return clamp(
    profileConfidence * 0.35 +
      fatigueConfidence * 0.25 +
      driftConfidence * 0.2 +
      faceAvailability * 0.2,
    0,
    100
  );
}

function headAttentionConfidence(head) {
  const calibration = clamp((head?.calibrationConfidence ?? 0) * 100, 0, 100);
  const poseStability = stabilityScore([
    head?.rollingHeadScore ?? 0,
    head?.sessionHeadScore ?? 0,
  ]);
  const trackingContinuity = clamp((head?.totalFrames ?? 0) / 30, 0, 1) * 100;
  return clamp(calibration * 0.45 + poseStability * 0.3 + trackingContinuity * 0.25, 0, 100);
}

function gazeAttentionConfidence(gaze) {
  const moduleConfidence = clamp(gaze?.gazeConfidence ?? 0, 0, 100);
  const calibrationConfidence = clamp(gaze?.calibration?.validationReport?.confidence ?? 0, 0, 100);
  const frameQuality = clamp(gaze?.frameQuality?.qualityScore ?? 0, 0, 100);
  const reliability = reliabilityScoreToPercent(
    gaze?.calibration?.validationReport?.reliabilityScore
  );
  return clamp(
    moduleConfidence * 0.35 +
      calibrationConfidence * 0.25 +
      frameQuality * 0.25 +
      reliability * 0.15,
    0,
    100
  );
}

function computeConflictPenalty(modalities) {
  let penalty = 0;
  for (let i = 0; i < modalities.length; i += 1) {
    for (let j = i + 1; j < modalities.length; j += 1) {
      const a = modalities[i];
      const b = modalities[j];
      const confidence = Math.min(a.confidence, b.confidence);
      if (confidence < CONFLICT_CONFIDENCE_FLOOR) continue;

      const gap = Math.abs(a.score - b.score);
      if (gap < STRONG_CONFLICT_GAP) continue;

      const confidenceScale = (confidence - CONFLICT_CONFIDENCE_FLOOR) /
        (100 - CONFLICT_CONFIDENCE_FLOOR);
      const gapScale = (gap - STRONG_CONFLICT_GAP) / (100 - STRONG_CONFLICT_GAP);
      penalty += 12 * confidenceScale * gapScale;
    }
  }
  return clamp(penalty, 0, 20);
}

function classifyAttentionState(score) {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function stabilityScore(values) {
  const clean = values.filter((value) => Number.isFinite(value) && value > 0);
  if (!clean.length) return 0;
  const avg = mean(clean);
  const spread = mean(clean.map((value) => Math.abs(value - avg)));
  return clamp(100 - spread * 200, 0, 100);
}

function profileReady(profile) {
  return (
    (profile?.confidence ?? 0) >= PROFILE_READY_CONFIDENCE &&
    (profile?.sampleCount ?? 0) >= PROFILE_READY_SAMPLES
  );
}

function baselineNormalityFromZScores(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 50;
  const meanAbsoluteZ = mean(clean.map((value) => Math.abs(value)));
  return clamp(100 - meanAbsoluteZ * 25, 0, 100);
}

function reliabilityScoreToPercent(label) {
  if (label === 'Excellent') return 100;
  if (label === 'Good') return 80;
  if (label === 'Fair') return 55;
  if (label === 'Poor') return 25;
  return 0;
}

function pruneHistory(history) {
  return history.slice(-HISTORY_LIMIT);
}
