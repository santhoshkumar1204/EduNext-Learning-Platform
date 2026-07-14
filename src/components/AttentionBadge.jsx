/**
 * Large "current state" badge. Background/glow are driven by the active zone's
 * color and transition smoothly when the state changes.
 */
export default function AttentionBadge({ zone, bpm }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border px-5 py-3 transition-all duration-700 ease-out"
      style={{
        backgroundColor: `${zone.color}22`,
        borderColor: `${zone.color}66`,
        boxShadow: `0 0 32px -8px ${zone.color}aa`,
      }}
    >
      <span
        className="h-4 w-4 rounded-full transition-colors duration-700"
        style={{ backgroundColor: zone.color, boxShadow: `0 0 12px 2px ${zone.color}` }}
      />
      <div className="leading-tight">
        <div
          className="text-xl font-bold transition-colors duration-700"
          style={{ color: zone.color }}
        >
          {zone.label}
        </div>
        {zone.note && (
          <div className="text-xs text-slate-400">{zone.note}</div>
        )}
      </div>
      <div className="ml-2 border-l border-white/10 pl-4 text-right">
        <div className="text-2xl font-bold tabular-nums text-slate-100">
          {bpm}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-slate-400">
          blinks / min
        </div>
      </div>
    </div>
  );
}
