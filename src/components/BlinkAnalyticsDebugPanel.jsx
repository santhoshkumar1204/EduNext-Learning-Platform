import { memo } from 'react';

function fmtMs(value) {
  if (!Number.isFinite(value) || value <= 0) return '0 ms';
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${value.toFixed(0)} ms`;
}

function fmtNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(digits);
}

function fmtPct(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${Math.round(value * 100)}%`;
}

function DebugValue({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-100">{value}</span>
    </div>
  );
}

function BlinkAnalyticsDebugPanel({ analytics }) {
  if (!analytics) return null;

  const { ibi, bursts, profile, fatigue, attentionDrift } = analytics;

  return (
    <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-xs">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-200">
          Temporary Blink Analytics Debug
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-amber-100/70">
          Remove before production
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section>
          <div className="mb-1 font-semibold text-slate-300">IBI</div>
          <DebugValue label="Current IBI" value={fmtMs(ibi.currentIbi)} />
          <DebugValue label="Average IBI" value={fmtMs(ibi.avgIbi)} />
          <DebugValue label="IBI Std Dev" value={fmtMs(ibi.ibiStdDev)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Bursts</div>
          <DebugValue label="Burst Count" value={bursts.burstCount} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Baseline</div>
          <DebugValue label="Baseline EAR" value={fmtNumber(profile.baselineEAR, 3)} />
          <DebugValue label="EAR MAD" value={fmtNumber(profile.baselineEARMad, 4)} />
          <DebugValue label="Baseline BPM" value={fmtNumber(profile.baselineBpm, 1)} />
          <DebugValue label="BPM MAD" value={fmtNumber(profile.baselineBpmMad, 2)} />
          <DebugValue label="Baseline IBI" value={fmtMs(profile.baselineIbi)} />
          <DebugValue label="IBI MAD" value={fmtMs(profile.baselineIbiMad)} />
          <DebugValue label="Blink Duration" value={fmtMs(profile.baselineBlinkDuration)} />
          <DebugValue label="Duration MAD" value={fmtMs(profile.baselineBlinkDurationMad)} />
          <DebugValue label="Confidence" value={fmtPct(profile.confidence)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Session Trend</div>
          <DebugValue label="Fatigue Score" value={fmtNumber(fatigue.fatigueScore, 1)} />
          <DebugValue label="BPM z" value={fmtNumber(fatigue.bpmZ, 2)} />
          <DebugValue label="IBI z" value={fmtNumber(fatigue.ibiZ, 2)} />
          <DebugValue label="Duration z" value={fmtNumber(fatigue.blinkDurationZ, 2)} />
          <DebugValue
            label="Drift Score"
            value={fmtNumber(attentionDrift.attentionDriftScore, 1)}
          />
          <DebugValue label="Trend" value={attentionDrift.trendLabel} />
          <DebugValue label="Trend Confidence" value={fmtPct(attentionDrift.trendConfidence)} />
        </section>
      </div>
    </div>
  );
}

export default memo(BlinkAnalyticsDebugPanel);
