import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const DATASET_FIELDS = [
  'timestamp',
  'attentionScore',
  'attentionState',
  'blinkScore',
  'blinkConfidence',
  'fatigueScore',
  'fatigueConfidence',
  'attentionDriftScore',
  'attentionDriftTrend',
  'bpm',
  'ibiMean',
  'ibiStd',
  'blinkVariability',
  'headScore',
  'headConfidence',
  'pitch',
  'yaw',
  'roll',
  'headDirection',
  'gazeScore',
  'gazeConfidence',
  'gazeDirection',
  'finalAttentionScore',
  'fusionConfidence',
];

const NUMERIC_FIELDS = new Set([
  'attentionScore',
  'blinkScore',
  'blinkConfidence',
  'fatigueScore',
  'fatigueConfidence',
  'attentionDriftScore',
  'bpm',
  'ibiMean',
  'ibiStd',
  'blinkVariability',
  'headScore',
  'headConfidence',
  'pitch',
  'yaw',
  'roll',
  'gazeScore',
  'gazeConfidence',
  'finalAttentionScore',
  'fusionConfidence',
]);

const SAMPLE_INTERVAL_MS = 5_000;

export function useSessionRecorder(metrics, sampleIntervalMs = SAMPLE_INTERVAL_MS) {
  const latestMetricsRef = useRef(metrics);
  const samplesRef = useRef([]);
  const startedAtRef = useRef(null);
  const stoppedAtRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [samples, setSamples] = useState([]);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionStoppedAt, setSessionStoppedAt] = useState(null);

  useEffect(() => {
    latestMetricsRef.current = metrics;
  }, [metrics]);

  const recordSample = useCallback(() => {
    const sample = createSessionSample(latestMetricsRef.current, Date.now());
    samplesRef.current = [...samplesRef.current, sample];
    setSamples(samplesRef.current);
  }, []);

  useEffect(() => {
    if (!isRecording) return undefined;
    const id = setInterval(recordSample, sampleIntervalMs);
    return () => clearInterval(id);
  }, [isRecording, recordSample, sampleIntervalMs]);

  const startRecording = useCallback(() => {
    if (isRecording) return;
    const now = Date.now();
    startedAtRef.current = startedAtRef.current ?? now;
    stoppedAtRef.current = null;
    setSessionStartedAt(startedAtRef.current);
    setSessionStoppedAt(null);
    setIsRecording(true);
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    const now = Date.now();
    stoppedAtRef.current = now;
    setSessionStoppedAt(now);
    setIsRecording(false);
  }, [isRecording]);

  const resetSession = useCallback(() => {
    samplesRef.current = [];
    startedAtRef.current = null;
    stoppedAtRef.current = null;
    setSamples([]);
    setSessionStartedAt(null);
    setSessionStoppedAt(null);
    setIsRecording(false);
  }, []);

  const sessionSummary = useMemo(
    () =>
      createSessionSummary(samples, {
        startedAt: sessionStartedAt,
        stoppedAt: sessionStoppedAt,
        now: Date.now(),
      }),
    [samples, sessionStartedAt, sessionStoppedAt]
  );

  const exportCsv = useCallback(() => {
    const filename = `attention_session_${formatFileTimestamp(new Date())}.csv`;
    downloadText(filename, toCsv(samplesRef.current), 'text/csv;charset=utf-8');
  }, []);

  const exportJson = useCallback(() => {
    const filename = `attention_session_${formatFileTimestamp(new Date())}.json`;
    const payload = {
      metadata: createMetadata({
        startedAt: startedAtRef.current,
        stoppedAt: stoppedAtRef.current,
        sampleIntervalMs,
        sampleCount: samplesRef.current.length,
      }),
      sessionSummary: createSessionSummary(samplesRef.current, {
        startedAt: startedAtRef.current,
        stoppedAt: stoppedAtRef.current,
        now: Date.now(),
      }),
      samples: samplesRef.current,
    };
    downloadText(filename, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  }, [sampleIntervalMs]);

  return {
    isRecording,
    samples,
    sampleCount: samples.length,
    sessionSummary,
    startRecording,
    stopRecording,
    resetSession,
    exportCsv,
    exportJson,
  };
}

export function createSessionSample(metrics = {}, now = Date.now()) {
  const fusion = metrics.fusion || {};
  const blinkAnalytics = metrics.blinkAnalytics || {};
  const fatigue = blinkAnalytics.fatigue || {};
  const drift = blinkAnalytics.attentionDrift || {};
  const ibi = blinkAnalytics.ibi || {};
  const headPose = metrics.headPose || {};
  const gaze = metrics.gaze || {};
  const fusionConfidence = averageFinite([
    fusion.blinkConfidence,
    fusion.headConfidence,
    fusion.gazeConfidence,
  ]);

  return normalizeSample({
    timestamp: new Date(now).toISOString(),
    attentionScore: fusion.finalAttentionScore,
    attentionState: fusion.finalAttentionState,
    blinkScore: fusion.blinkScore,
    blinkConfidence: fusion.blinkConfidence,
    fatigueScore: fatigue.fatigueScore,
    fatigueConfidence: fatigue.fatigueConfidence,
    attentionDriftScore: drift.attentionDriftScore,
    attentionDriftTrend: drift.trendLabel,
    bpm: metrics.currentBpm,
    ibiMean: ibi.avgIbi,
    ibiStd: ibi.ibiStdDev,
    blinkVariability: ibi.variabilityIndex,
    headScore: fusion.headScore,
    headConfidence: fusion.headConfidence,
    pitch: headPose.pitchAngle,
    yaw: headPose.yawAngle,
    roll: headPose.rollAngle,
    headDirection: headPose.headDirection,
    gazeScore: fusion.gazeScore,
    gazeConfidence: fusion.gazeConfidence,
    gazeDirection: gaze.gazeDirection,
    finalAttentionScore: fusion.finalAttentionScore,
    fusionConfidence,
  });
}

export function createSessionSummary(samples, { startedAt, stoppedAt, now = Date.now() } = {}) {
  const durationEnd = stoppedAt ?? (startedAt ? now : null);
  const sessionDuration = startedAt && durationEnd
    ? Math.max(0, Math.round((durationEnd - startedAt) / 1000))
    : 0;
  const sampleCount = samples.length;
  const pct = (state) =>
    sampleCount
      ? (samples.filter((sample) => sample.attentionState === state).length / sampleCount) * 100
      : 0;

  return {
    sessionDuration,
    averageAttentionScore: averageField(samples, 'attentionScore'),
    minimumAttentionScore: minField(samples, 'attentionScore'),
    maximumAttentionScore: maxField(samples, 'attentionScore'),
    averageBlinkScore: averageField(samples, 'blinkScore'),
    averageHeadScore: averageField(samples, 'headScore'),
    averageGazeScore: averageField(samples, 'gazeScore'),
    averageFatigueScore: averageField(samples, 'fatigueScore'),
    highAttentionPercentage: pct('High'),
    mediumAttentionPercentage: pct('Medium'),
    lowAttentionPercentage: pct('Low'),
    averageBPM: averageField(samples, 'bpm'),
  };
}

export function toCsv(samples) {
  const rows = [DATASET_FIELDS.join(',')];
  for (const sample of samples) {
    rows.push(DATASET_FIELDS.map((field) => csvCell(sample[field])).join(','));
  }
  return rows.join('\n');
}

export function createMetadata({ startedAt, stoppedAt, sampleIntervalMs, sampleCount }) {
  return {
    exportedAt: new Date().toISOString(),
    sessionStartedAt: startedAt ? new Date(startedAt).toISOString() : null,
    sessionStoppedAt: stoppedAt ? new Date(stoppedAt).toISOString() : null,
    sampleIntervalSeconds: sampleIntervalMs / 1000,
    sampleCount,
    schemaVersion: 1,
    fields: DATASET_FIELDS,
  };
}

function normalizeSample(sample) {
  return DATASET_FIELDS.reduce((normalized, field) => {
    const value = sample[field];
    normalized[field] = NUMERIC_FIELDS.has(field) ? finiteOrZero(value) : value ?? '';
    return normalized;
  }, {});
}

function finiteOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function averageField(samples, field) {
  return averageFinite(samples.map((sample) => sample[field]));
}

function minField(samples, field) {
  const values = samples.map((sample) => sample[field]).filter(Number.isFinite);
  return values.length ? Math.min(...values) : 0;
}

function maxField(samples, field) {
  const values = samples.map((sample) => sample[field]).filter(Number.isFinite);
  return values.length ? Math.max(...values) : 0;
}

function averageFinite(values) {
  const clean = values.filter(Number.isFinite);
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function csvCell(value) {
  if (value == null) return '';
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function formatFileTimestamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '_',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
