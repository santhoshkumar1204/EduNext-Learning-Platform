import { memo } from 'react';

function fmtRatio(value) {
  if (!Number.isFinite(value)) return '0.500';
  return value.toFixed(3);
}

function fmtSignedRatio(value) {
  if (!Number.isFinite(value)) return '0.000';
  return `${value >= 0 ? '+' : ''}${value.toFixed(3)}`;
}

function fmtPct(value) {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

function fmtNumber(value, digits = 3) {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(digits);
}

function fmtProgress(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${Math.round(value * 100)}%`;
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

function RangeValue({ range }) {
  if (!range) return <span className="font-mono text-slate-100">0.000-0.000</span>;
  return (
    <span className="font-mono text-slate-100">
      {fmtRatio(range.min)}-{fmtRatio(range.max)}
    </span>
  );
}

function ThresholdRange({ min, max }) {
  return (
    <span className="font-mono text-slate-100">
      {fmtRatio(min)}-{fmtRatio(max)}
    </span>
  );
}

function GazeDebugPanel({ gaze, onStartCalibration }) {
  if (!gaze) return null;
  const calibration = gaze.calibration || {};
  const thresholdSummary = gaze.thresholdSummary || {};
  const centerThresholds = thresholdSummary.Center || {};
  const validationReport = calibration.validationReport || {};
  const classification = gaze.classification || {};

  return (
    <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4 text-xs">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
          Temporary Gaze Tracking Debug
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-emerald-100/70">
          Remove before production
        </span>
        <button
          type="button"
          onClick={onStartCalibration}
          className="rounded-lg border border-emerald-300/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-100 transition hover:bg-emerald-300/10"
        >
          Start Calibration
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section>
          <div className="mb-1 font-semibold text-slate-300">Current Gaze</div>
          <DebugValue label="Direction" value={gaze.gazeDirection} />
          <DebugValue label="Horizontal Ratio" value={fmtRatio(gaze.horizontalRatio)} />
          <DebugValue label="Vertical Ratio" value={fmtRatio(gaze.verticalRatio)} />
          <DebugValue label="Confidence" value={fmtPct(gaze.gazeConfidence)} />
          <DebugValue label="Frame Quality" value={fmtPct(gaze.frameQuality?.qualityScore)} />
          <DebugValue label="Valid Frame" value={gaze.frameQuality?.valid ? 'Yes' : 'No'} />
          <DebugValue label="Left H" value={fmtRatio(gaze.rawRatios.leftHorizontalRatio)} />
          <DebugValue label="Right H" value={fmtRatio(gaze.rawRatios.rightHorizontalRatio)} />
          <DebugValue label="Average H" value={fmtRatio(gaze.rawRatios.averagedHorizontalRatio)} />
          <DebugValue label="Left V" value={fmtRatio(gaze.rawRatios.leftVerticalRatio)} />
          <DebugValue label="Right V" value={fmtRatio(gaze.rawRatios.rightVerticalRatio)} />
          <DebugValue label="Average V" value={fmtRatio(gaze.rawRatios.averagedVerticalRatio)} />
          <DebugValue label="Center H Median" value={fmtRatio(classification.centerHorizontalMedian)} />
          <DebugValue label="Center V Median" value={fmtRatio(classification.centerVerticalMedian)} />
          <DebugValue label="H Offset" value={fmtSignedRatio(classification.horizontalOffset)} />
          <DebugValue label="V Offset" value={fmtSignedRatio(classification.verticalOffset)} />
          <DebugValue label="Center Distance" value={fmtNumber(classification.distanceFromCenter, 4)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Gaze Score</div>
          <DebugValue label="Current" value={fmtPct(gaze.currentGazeScore)} />
          <DebugValue label="Rolling" value={fmtPct(gaze.rollingGazeScore)} />
          <DebugValue label="Session" value={fmtPct(gaze.sessionGazeScore)} />
          <DebugValue
            label="Center H Range"
            value={
              <ThresholdRange
                min={centerThresholds.horizontalMin}
                max={centerThresholds.horizontalMax}
              />
            }
          />
          <DebugValue
            label="Center V Range"
            value={
              <ThresholdRange
                min={centerThresholds.verticalMin}
                max={centerThresholds.verticalMax}
              />
            }
          />
          <DebugValue label="Left Threshold" value={fmtRatio(gaze.thresholds.left)} />
          <DebugValue label="Right Threshold" value={fmtRatio(gaze.thresholds.right)} />
          <DebugValue label="Up Threshold" value={fmtRatio(gaze.thresholds.up)} />
          <DebugValue label="Down Threshold" value={fmtRatio(gaze.thresholds.down)} />
          <DebugValue label="H Excursion" value={fmtNumber(classification.horizontalScore, 3)} />
          <DebugValue label="V Excursion" value={fmtNumber(classification.verticalScore, 3)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Distribution</div>
          {Object.entries(gaze.directionDistribution).map(([direction, value]) => (
            <DebugValue key={direction} label={`${direction} %`} value={fmtPct(value)} />
          ))}
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Time By Direction</div>
          {Object.entries(gaze.timeByDirectionMs).map(([direction, value]) => (
            <DebugValue key={direction} label={direction} value={fmtDuration(value)} />
          ))}
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section>
          <div className="mb-1 font-semibold text-slate-300">Guided Calibration</div>
          <DebugValue
            label="Status"
            value={
              calibration.active
                ? `Look ${calibration.currentTarget}`
                : calibration.completed
                  ? 'Completed'
                  : 'Idle'
            }
          />
          <DebugValue label="Stage Progress" value={fmtProgress(calibration.stageProgress)} />
          <DebugValue label="Overall Progress" value={fmtProgress(calibration.overallProgress)} />
          <DebugValue label="Successful" value={calibration.successful ? 'Yes' : 'No'} />
          <DebugValue label="Reliability" value={validationReport.reliabilityScore || 'Poor'} />
          <DebugValue label="Separability" value={fmtPct(validationReport.directionSeparability || 0)} />
          <DebugValue label="Calibration Confidence" value={fmtPct(validationReport.confidence || 0)} />
          <DebugValue label="Recommendation" value={validationReport.recommendation || 'Run calibration'} />
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
            {Object.entries(calibration.sampleCounters || {}).map(([direction, counters]) => (
              <span key={direction}>
                {direction}: {counters.validFrames}/{counters.collectedFrames} valid, {counters.rejectedFrames} rejected
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Classification Reason</div>
          <div className="rounded-lg border border-white/10 bg-slate-950/20 p-3 text-[11px] leading-relaxed text-slate-200">
            {classification.reason || 'Awaiting valid gaze frame.'}
          </div>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <section>
          <div className="mb-1 font-semibold text-slate-300">Accuracy Report</div>
          {Object.entries(calibration.report || {}).map(([direction, report]) => (
            <div key={direction} className="border-b border-white/10 py-1.5 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">{direction}</span>
                <span className="font-mono text-slate-100">
                  {report.detectedFrames}/{report.totalFrames} ({fmtPct(report.percentage)})
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                {Object.entries(report.confusionCases).map(([label, count]) => (
                  <span key={label}>
                    {label}: {count}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                <span>Collected: {report.sampleCounters?.collectedFrames || 0}</span>
                <span>Valid: {report.sampleCounters?.validFrames || 0}</span>
                <span>Rejected: {report.sampleCounters?.rejectedFrames || 0}</span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-500">
                <span>H range: <RangeValue range={report.observedRanges.horizontal} /></span>
                <span>V range: <RangeValue range={report.observedRanges.vertical} /></span>
                <span>H mean: {fmtNumber(report.qualityMetrics?.horizontal?.mean)}</span>
                <span>V mean: {fmtNumber(report.qualityMetrics?.vertical?.mean)}</span>
                <span>H median: {fmtNumber(report.qualityMetrics?.horizontal?.median)}</span>
                <span>V median: {fmtNumber(report.qualityMetrics?.vertical?.median)}</span>
                <span>H MAD: {fmtNumber(report.qualityMetrics?.horizontal?.mad, 4)}</span>
                <span>V MAD: {fmtNumber(report.qualityMetrics?.vertical?.mad, 4)}</span>
                <span>H SD: {fmtNumber(report.qualityMetrics?.horizontal?.standardDeviation, 4)}</span>
                <span>V SD: {fmtNumber(report.qualityMetrics?.vertical?.standardDeviation, 4)}</span>
                <span>Left H: <RangeValue range={report.observedRanges.leftHorizontal} /></span>
                <span>Right H: <RangeValue range={report.observedRanges.rightHorizontal} /></span>
                <span>Left V: <RangeValue range={report.observedRanges.leftVertical} /></span>
                <span>Right V: <RangeValue range={report.observedRanges.rightVertical} /></span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default memo(GazeDebugPanel);
