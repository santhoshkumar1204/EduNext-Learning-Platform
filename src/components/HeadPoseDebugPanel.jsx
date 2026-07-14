import { memo } from 'react';

function fmtAngle(value) {
  if (!Number.isFinite(value)) return '0.0 deg';
  return `${value.toFixed(1)} deg`;
}

function fmtPct(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(1)}%`;
}

function fmtDuration(ms) {
  const seconds = Math.round((ms || 0) / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes <= 0) return `${rest}s`;
  return `${minutes}m ${rest}s`;
}

function DebugValue({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-100">{value}</span>
    </div>
  );
}

function HeadPoseDebugPanel({ headPose }) {
  if (!headPose) return null;

  return (
    <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-4 text-xs">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-200">
          Temporary Head Pose Debug
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-cyan-100/70">
          Remove before production
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section>
          <div className="mb-1 font-semibold text-slate-300">Angles</div>
          <DebugValue label="Pitch" value={fmtAngle(headPose.pitchAngle)} />
          <DebugValue label="Yaw" value={fmtAngle(headPose.yawAngle)} />
          <DebugValue label="Roll" value={fmtAngle(headPose.rollAngle)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Direction</div>
          <DebugValue label="Current" value={headPose.headDirection} />
          <DebugValue label="Pitch State" value={headPose.headLabels.pitch} />
          <DebugValue label="Yaw State" value={headPose.headLabels.yaw} />
          <DebugValue label="Roll State" value={headPose.headLabels.roll} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Head Score</div>
          <DebugValue label="Current" value={fmtPct(headPose.currentHeadScore)} />
          <DebugValue label="Rolling" value={fmtPct(headPose.rollingHeadScore)} />
          <DebugValue label="Session" value={fmtPct(headPose.sessionHeadScore)} />
          <DebugValue label="Calibration" value={fmtPct(headPose.calibrationConfidence * 100)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Distribution</div>
          {Object.entries(headPose.directionDistribution).map(([direction, value]) => (
            <DebugValue key={direction} label={direction} value={fmtPct(value)} />
          ))}
          <DebugValue label="Forward Time" value={fmtDuration(headPose.timeLookingForwardMs)} />
          <DebugValue label="Away Time" value={fmtDuration(headPose.timeLookingAwayMs)} />
        </section>
      </div>
    </div>
  );
}

export default memo(HeadPoseDebugPanel);
