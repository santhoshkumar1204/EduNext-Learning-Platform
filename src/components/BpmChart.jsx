import { memo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { categorize } from '../hooks/useBlinkStats';

function ChartCard({ title, children }) {
  return (
    <div className="glass flex flex-col gap-2 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** BPM over the last 2 minutes; area color follows the current attention zone. */
function BpmChart({ data, zone }) {
  return (
    <ChartCard title="BPM Over Time">
      <div className="h-44 w-full">
        {data.length === 0 ? (
          <Empty text="Collecting data… first point in ~5s" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="bpmFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={zone.color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={zone.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <Tooltip
                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                formatter={(v) => [`${v} bpm`, categorize(v).label]}
                labelFormatter={(l) => `t+${l}`}
              />
              <Area
                type="monotone"
                dataKey="bpm"
                stroke={zone.color}
                strokeWidth={2}
                fill="url(#bpmFill)"
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}

export function Empty({ text }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">
      {text}
    </div>
  );
}

export { ChartCard };
export default memo(BpmChart);
