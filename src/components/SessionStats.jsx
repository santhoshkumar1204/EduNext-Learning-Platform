import { memo } from 'react';
import { ATTENTION_ZONES } from '../hooks/useBlinkStats';

const ZONE_BY_KEY = Object.fromEntries(ATTENTION_ZONES.map((z) => [z.key, z]));

function fmtDuration(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div
        className="mt-1 text-xl font-bold tabular-nums"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

/** Session summary stat cards (not a chart). */
function SessionStats({ stats }) {
  const zone = stats.mostFrequentZone ? ZONE_BY_KEY[stats.mostFrequentZone] : null;
  return (
    <div className="glass flex flex-col gap-3 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
        Session Stats
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Blinks" value={stats.totalBlinks} />
        <StatCard label="Avg BPM" value={stats.avgBpm.toFixed(1)} />
        <StatCard label="Longest Focus Streak" value={fmtDuration(stats.longestFocusStreakMs)} />
        <StatCard
          label="Most Frequent State"
          value={zone ? zone.label : '—'}
          accent={zone?.color}
        />
      </div>
    </div>
  );
}

export default memo(SessionStats);
