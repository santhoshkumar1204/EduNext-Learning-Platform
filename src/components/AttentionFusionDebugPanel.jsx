import { memo } from 'react';
import { useSessionRecorder } from '../sessionRecorder.js';

function fmtPct(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(1)}%`;
}

function DebugValue({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-100">{value}</span>
    </div>
  );
}

function RecorderButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold text-slate-100 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function AttentionFusionDebugPanel({ fusion, fusionStore, recordingMetrics }) {
  const recorder = useSessionRecorder(recordingMetrics);

  if (!fusion) return null;

  const history = fusionStore?.history || [];
  const confidenceHistory = fusionStore?.confidenceHistory || [];
  const contributionHistory = fusionStore?.contributionHistory || [];
  const lastConfidence = confidenceHistory[confidenceHistory.length - 1] || {};
  const lastContribution = contributionHistory[contributionHistory.length - 1] || {};

  return (
    <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-4 text-xs">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
          Temporary Attention Fusion Debug
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-400">
          Remove before production
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section>
          <div className="mb-1 font-semibold text-slate-300">Module Scores</div>
          <DebugValue label="Blink Score" value={fusion.blinkScore.toFixed(1)} />
          <DebugValue label="Head Score" value={fusion.headScore.toFixed(1)} />
          <DebugValue label="Gaze Score" value={fusion.gazeScore.toFixed(1)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Module Confidence</div>
          <DebugValue label="Blink Confidence" value={fmtPct(fusion.blinkConfidence)} />
          <DebugValue label="Head Confidence" value={fmtPct(fusion.headConfidence)} />
          <DebugValue label="Gaze Confidence" value={fmtPct(fusion.gazeConfidence)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Final Attention</div>
          <DebugValue label="Score" value={fusion.finalAttentionScore.toFixed(1)} />
          <DebugValue label="State" value={fusion.finalAttentionState} />
          <DebugValue label="History Size" value={history.length} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Contributions</div>
          <DebugValue label="Blink" value={fmtPct(fusion.contributions.blink)} />
          <DebugValue label="Head" value={fmtPct(fusion.contributions.head)} />
          <DebugValue label="Gaze" value={fmtPct(fusion.contributions.gaze)} />
          <DebugValue label="Blink Weight" value={fmtPct(fusion.weights.blink * 100)} />
          <DebugValue label="Head Weight" value={fmtPct(fusion.weights.head * 100)} />
          <DebugValue label="Gaze Weight" value={fmtPct(fusion.weights.gaze * 100)} />
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section>
          <div className="mb-1 font-semibold text-slate-300">Confidence History</div>
          <DebugValue label="Blink" value={fmtPct(lastConfidence.blinkConfidence ?? 0)} />
          <DebugValue label="Head" value={fmtPct(lastConfidence.headConfidence ?? 0)} />
          <DebugValue label="Gaze" value={fmtPct(lastConfidence.gazeConfidence ?? 0)} />
        </section>

        <section>
          <div className="mb-1 font-semibold text-slate-300">Attention History</div>
          <DebugValue label="Latest Score" value={fmtPct(lastContribution.t ? fusion.finalAttentionScore : 0)} />
          <DebugValue label="Stored Frames" value={history.length} />
        </section>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="font-semibold text-slate-300">Research Session Recording</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
            {recorder.isRecording ? 'Recording' : 'Idle'} · {recorder.sampleCount} samples
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <RecorderButton
            disabled={recorder.isRecording}
            onClick={recorder.startRecording}
          >
            Start Recording
          </RecorderButton>
          <RecorderButton
            disabled={!recorder.isRecording}
            onClick={recorder.stopRecording}
          >
            Stop Recording
          </RecorderButton>
          <RecorderButton onClick={recorder.resetSession}>Reset Session</RecorderButton>
          <RecorderButton
            disabled={recorder.sampleCount === 0}
            onClick={recorder.exportCsv}
          >
            Export CSV
          </RecorderButton>
          <RecorderButton
            disabled={recorder.sampleCount === 0}
            onClick={recorder.exportJson}
          >
            Export JSON
          </RecorderButton>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <section>
            <DebugValue
              label="Duration"
              value={`${recorder.sessionSummary.sessionDuration}s`}
            />
            <DebugValue
              label="Avg Attention"
              value={recorder.sessionSummary.averageAttentionScore.toFixed(1)}
            />
          </section>
          <section>
            <DebugValue
              label="Min Attention"
              value={recorder.sessionSummary.minimumAttentionScore.toFixed(1)}
            />
            <DebugValue
              label="Max Attention"
              value={recorder.sessionSummary.maximumAttentionScore.toFixed(1)}
            />
          </section>
          <section>
            <DebugValue label="Avg BPM" value={recorder.sessionSummary.averageBPM.toFixed(1)} />
            <DebugValue
              label="High / Med / Low"
              value={`${recorder.sessionSummary.highAttentionPercentage.toFixed(0)} / ${recorder.sessionSummary.mediumAttentionPercentage.toFixed(0)} / ${recorder.sessionSummary.lowAttentionPercentage.toFixed(0)}%`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default memo(AttentionFusionDebugPanel);
