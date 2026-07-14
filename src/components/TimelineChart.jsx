import { memo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { ATTENTION_ZONES } from '../hooks/useBlinkStats';
import { ChartCard, Empty } from './BpmChart';

const COLOR_BY_KEY = Object.fromEntries(ATTENTION_ZONES.map((z) => [z.key, z]));

/** A ribbon of colored bars — one per 5s sample — showing state over the session. */
function TimelineChart({ data }) {
  return (
    <ChartCard title="Attention State Timeline">
      <div className="h-28 w-full">
        {data.length === 0 ? (
          <Empty text="Your attention states will stream in here" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }} barCategoryGap={1}>
              <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={32} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                formatter={(_v, _n, p) => [
                  `${COLOR_BY_KEY[p.payload.zone].label}`,
                  `${p.payload.bpm} bpm`,
                ]}
                labelFormatter={(l) => `t+${l}`}
              />
              <Bar dataKey="value" isAnimationActive={false} radius={[2, 2, 0, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={COLOR_BY_KEY[d.zone].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
        {ATTENTION_ZONES.map((z) => (
          <span key={z.key} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: z.color }} />
            {z.label}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

export default memo(TimelineChart);
