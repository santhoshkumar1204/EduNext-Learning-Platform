import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard, Empty } from './BpmChart';

const BAR_COLORS = ['#22c55e', '#eab308', '#f97316'];

/** Distribution of blink durations (short / medium / long). */
function DurationChart({ data }) {
  const hasData = data.some((d) => d.count > 0);
  return (
    <ChartCard title="Blink Duration Histogram">
      <div className="h-40 w-full">
        {!hasData ? (
          <Empty text="No blinks recorded yet" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                formatter={(v) => [`${v} blinks`, 'count']}
                labelFormatter={(l, p) => `${l} (${p?.[0]?.payload?.sub ?? ''})`}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {data.map((_d, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}

export default memo(DurationChart);
