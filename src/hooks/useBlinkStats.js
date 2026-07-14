import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createBlinkEventStore,
  recordBlinkEvent,
  summarizeBlinkEvents,
} from '../analytics/blinkEvents';
import {
  createPersonalizedProfileStore,
  recordEyeSample,
  recordProfileBlink,
  recordProfileTick,
} from '../analytics/personalizedProfile';
import {
  createFatigueStore,
  recordFatigueBlink,
  recordFatigueTick,
} from '../analytics/fatigue';
import {
  createAttentionDriftStore,
  recordAttentionDrift,
} from '../analytics/attentionDrift';

// Attention zones, keyed by rolling blink rate (blinks per minute).
// Colors mirror tailwind.config.js `zone.*`.
export const ATTENTION_ZONES = [
  { key: 'hyperfocused', label: 'Hyperfocused', color: '#3b82f6', note: 'eye strain risk' },
  { key: 'attentive', label: 'Attentive', color: '#22c55e', note: '' },
  { key: 'neutral', label: 'Neutral', color: '#eab308', note: '' },
  { key: 'fatigued', label: 'Fatigued', color: '#f97316', note: '' },
  { key: 'sleepy', label: 'Sleepy', color: '#ef4444', note: '' },
];

const ZONE_BY_KEY = Object.fromEntries(ATTENTION_ZONES.map((z) => [z.key, z]));

/** Map a blink rate (BPM) to its attention zone. */
export function categorize(bpm) {
  if (bpm < 8) return ZONE_BY_KEY.hyperfocused;
  if (bpm < 15) return ZONE_BY_KEY.attentive; // 8–14
  if (bpm < 21) return ZONE_BY_KEY.neutral; // 15–20
  if (bpm <= 30) return ZONE_BY_KEY.fatigued; // 21–30
  return ZONE_BY_KEY.sleepy; // > 30
}

// Blink-duration histogram buckets (ms).
export const DURATION_BUCKETS = [
  { key: 'short', label: 'Short', sub: '<150ms', test: (d) => d < 150 },
  { key: 'medium', label: 'Medium', sub: '150–300ms', test: (d) => d >= 150 && d <= 300 },
  { key: 'long', label: 'Long', sub: '>300ms', test: (d) => d > 300 },
];

const ROLLING_WINDOW_MS = 60_000; // BPM is computed over the last 60s
const TICK_MS = 5_000; // recompute + push to charts every 5s
const BPM_HISTORY_MS = 120_000; // keep last 2 minutes of BPM points
const MAX_TIMELINE = 240; // cap timeline samples (~20 min) for the chart

const EMPTY_BLINK_ANALYTICS = {
  ibi: {
    currentIbi: 0,
    avgIbi: 0,
    minIbi: 0,
    maxIbi: 0,
    ibiStdDev: 0,
    variabilityIndex: 0,
    intervalCount: 0,
  },
  bursts: {
    burstCount: 0,
    burstFrequency: 0,
    burstTimestamps: [],
    recentBursts: [],
  },
  profile: {
    baselineEAR: 0,
    baselineEARMad: 0,
    baselineBpm: 0,
    baselineBpmMad: 0,
    baselineIbi: 0,
    baselineIbiMad: 0,
    baselineBlinkDuration: 0,
    baselineBlinkDurationMad: 0,
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
  fatigue: {
    fatigueIndex: 0,
    fatigueScore: 0,
    fatigueConfidence: 0,
    bpmZ: 0,
    ibiZ: 0,
    blinkDurationZ: 0,
    fatigueEvidence: 0,
    durationTrend: 0,
    blinkFrequencyTrend: 0,
    ibiTrend: 0,
    rollingAvgDuration: 0,
    rollingAvgBpm: 0,
    rollingAvgIbi: 0,
    history: [],
  },
  attentionDrift: {
    attentionDriftScore: 100,
    attentionTrend: 0,
    attentionTrendConfidence: 0,
    trendConfidence: 0,
    windows: {
      short: { slope: 0, sampleCount: 0, confidence: 0 },
      medium: { slope: 0, sampleCount: 0, confidence: 0 },
      long: { slope: 0, sampleCount: 0, confidence: 0 },
    },
    increasingFatigue: false,
    stableAttention: true,
    decliningAttention: false,
    trendLabel: 'Stable',
    history: [],
  },
};

function fmtElapsed(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * useBlinkStats owns the blink store and derives all chart/stat values on a 5s
 * cadence. Raw blinks live in refs; only the aggregated, render-worthy data is
 * promoted to state.
 *
 * @param {object} opts
 * @param {React.RefObject<boolean>} opts.activeRef - false while no face is
 *   detected, which pauses BPM sampling. A ref (not a prop) avoids a circular
 *   dependency with useFaceMesh, which consumes this hook's recordBlink.
 */
export function useBlinkStats({ activeRef }) {
  // Timestamps of blinks within the rolling window (pruned each tick).
  const recentRef = useRef([]);
  // Session-long aggregates that must not grow unbounded.
  const aggregateRef = useRef({
    total: 0,
    durations: { short: 0, medium: 0, long: 0 },
  });
  const sessionStartRef = useRef(Date.now());
  const ticksRef = useRef([]); // every zone key sampled, whole session
  // Running aggregates for average BPM across the whole session.
  const runningSumRef = useRef(0);
  const runningCountRef = useRef(0);
  const blinkEventsRef = useRef(createBlinkEventStore());
  const profileRef = useRef(createPersonalizedProfileStore(sessionStartRef.current));
  const fatigueRef = useRef(createFatigueStore());
  const driftRef = useRef(createAttentionDriftStore());

  const [bpmData, setBpmData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [currentBpm, setCurrentBpm] = useState(0);
  const [currentZone, setCurrentZone] = useState(ZONE_BY_KEY.attentive);
  const [blinkAnalytics, setBlinkAnalytics] = useState(EMPTY_BLINK_ANALYTICS);
  const [stats, setStats] = useState({
    totalBlinks: 0,
    avgBpm: 0,
    longestFocusStreakMs: 0,
    mostFrequentZone: null,
    blinkAnalytics: EMPTY_BLINK_ANALYTICS,
  });

  // Stable callback handed to useFaceMesh — records one detected blink.
  const recordBlink = useCallback(({ t, duration }) => {
    recentRef.current.push(t);
    const agg = aggregateRef.current;
    agg.total += 1;
    const bucket = DURATION_BUCKETS.find((b) => b.test(duration));
    if (bucket) agg.durations[bucket.key] += 1;

    const event = recordBlinkEvent(blinkEventsRef.current, { t, duration }, t);
    recordProfileBlink(profileRef.current, event, t);
    recordFatigueBlink(fatigueRef.current, event, t);
  }, []);

  const recordEye = useCallback(({ t, ear }) => {
    recordEyeSample(profileRef.current, { t, ear }, t);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      // Prune the rolling window so it only holds the last 60s of blinks.
      recentRef.current = recentRef.current.filter(
        (t) => now - t <= ROLLING_WINDOW_MS
      );

      // Pause BPM while no face is present; charts simply don't advance.
      if (!activeRef.current) return;

      // Window is exactly 60s, so count == blinks per minute.
      const bpm = recentRef.current.length;
      const zone = categorize(bpm);
      setCurrentBpm(bpm);
      setCurrentZone(zone);

      const label = fmtElapsed(now - sessionStartRef.current);

      setBpmData((prev) => {
        const next = [...prev, { time: label, bpm, t: now, zone: zone.key }];
        return next.filter((d) => now - d.t <= BPM_HISTORY_MS);
      });

      ticksRef.current.push(zone.key);
      setTimelineData((prev) => {
        const next = [...prev, { time: label, value: 1, zone: zone.key, bpm }];
        return next.slice(-MAX_TIMELINE);
      });

      // --- Session stats -------------------------------------------------
      const ticks = ticksRef.current;
      const agg = aggregateRef.current;

      // Average BPM across all samples this session (running sum / count).
      runningSumRef.current += bpm;
      runningCountRef.current += 1;
      const avgBpm = runningSumRef.current / runningCountRef.current;
      const baseline = recordProfileTick(profileRef.current, bpm, now);
      const ibiSummary = summarizeBlinkEvents(blinkEventsRef.current, now);
      const fatigue = recordFatigueTick(fatigueRef.current, bpm, baseline, now);
      const attentionDrift = recordAttentionDrift(
        driftRef.current,
        {
          fatigueIndex: fatigue.fatigueIndex,
          bpm,
          confidence: baseline.confidence,
        },
        now
      );
      const analytics = {
        ibi: {
          currentIbi: ibiSummary.currentIbi,
          avgIbi: ibiSummary.avgIbi,
          minIbi: ibiSummary.minIbi,
          maxIbi: ibiSummary.maxIbi,
          ibiStdDev: ibiSummary.ibiStdDev,
          variabilityIndex: ibiSummary.variabilityIndex,
          intervalCount: ibiSummary.intervalCount,
        },
        bursts: {
          burstCount: ibiSummary.burstCount,
          burstFrequency: ibiSummary.burstFrequency,
          burstTimestamps: ibiSummary.burstTimestamps,
          recentBursts: ibiSummary.recentBursts,
        },
        profile: {
          baselineEAR: baseline.ear,
          baselineEARMad: baseline.earMad,
          baselineBpm: baseline.bpm,
          baselineBpmMad: baseline.bpmMad,
          baselineIbi: baseline.ibi,
          baselineIbiMad: baseline.ibiMad,
          baselineBlinkDuration: baseline.blinkDuration,
          baselineBlinkDurationMad: baseline.blinkDurationMad,
          ready: baseline.ready,
          sampleCount: baseline.sampleCount,
          confidence: baseline.confidence,
          confidenceByMetric: baseline.confidenceByMetric,
        },
        fatigue,
        attentionDrift,
      };

      // Longest "Attentive" streak (consecutive attentive ticks * 5s).
      let longest = 0;
      let run = 0;
      for (const k of ticks) {
        if (k === 'attentive') {
          run += 1;
          longest = Math.max(longest, run);
        } else {
          run = 0;
        }
      }

      // Most frequent zone across the session.
      const counts = {};
      for (const k of ticks) counts[k] = (counts[k] || 0) + 1;
      let mostFrequentZone = null;
      let best = -1;
      for (const [k, c] of Object.entries(counts)) {
        if (c > best) {
          best = c;
          mostFrequentZone = k;
        }
      }

      setBlinkAnalytics(analytics);
      setStats({
        totalBlinks: agg.total,
        avgBpm,
        longestFocusStreakMs: longest * TICK_MS,
        mostFrequentZone,
        blinkAnalytics: analytics,
      });
    };

    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Derive the duration histogram from current aggregates on each render.
  const durationData = DURATION_BUCKETS.map((b) => ({
    label: b.label,
    sub: b.sub,
    count: aggregateRef.current.durations[b.key],
  }));

  return {
    recordBlink,
    recordEye,
    bpmData,
    timelineData,
    durationData,
    currentBpm,
    currentZone,
    stats,
    blinkAnalytics,
    zoneByKey: ZONE_BY_KEY,
  };
}
