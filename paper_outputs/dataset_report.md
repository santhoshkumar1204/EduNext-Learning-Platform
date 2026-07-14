# Dataset Report

## Dataset Discovery Audit

- Project root searched recursively: `C:\Users\santh\Downloads\blink-detection-main`
- Excluded folders: `node_modules`, `dist`, `paper_outputs`, `paper_analytics`, `.git`
- Folders containing scanned candidate files: `.`, `datasets`
- Accepted filename patterns: `attention_session_*.csv`, `attention_session_*.json`
- Accepted file types: `.csv`, `.json`
- Ignored file types for loading: `.xlsx` and non-matching `.csv` / `.json` basenames
- Candidate dataset-like files scanned: 6
- Accepted session exports: 2
- Rejected files: 4
- Loaded session sample rows: 41
- Loaded JSON session summaries: 1
- Loaded JSON metadata rows: 1

### Accepted Files

- `attention_session_20260616_233539.csv` in `datasets`: Accepted as session CSV export.
- `attention_session_20260616_233542.json` in `datasets`: Accepted as session JSON export.

### Rejected Files

- `Arulmozhi.csv` in `datasets`: Rejected: CSV filename does not start with attention_session_.
- `blinkrate_data1.csv.xlsx` in `datasets`: Rejected: XLSX is not loaded by the analytics package.
- `package-lock.json` in `blink-detection-main`: Rejected: JSON filename does not start with attention_session_.
- `package.json` in `blink-detection-main`: Rejected: JSON filename does not start with attention_session_.

## Session Schema Audit

- Sample columns loaded: timestamp, attentionScore, attentionState, blinkScore, blinkConfidence, fatigueScore, fatigueConfidence, attentionDriftScore, attentionDriftTrend, bpm, ibiMean, ibiStd, blinkVariability, headScore, headConfidence, pitch, yaw, roll, headDirection, gazeScore, gazeConfidence, gazeDirection, finalAttentionScore, fusionConfidence, source_file, dataset_id, participant_id, sample_index, elapsed_seconds, blinkWeight_recomputed, headWeight_recomputed, gazeWeight_recomputed, blinkContribution_recomputed, headContribution_recomputed, gazeContribution_recomputed, rawAttentionScore_recomputed, conflictPenalty_recomputed, finalAttentionScore_recomputed
- Usable variables: timestamp, attentionScore, attentionState, blinkScore, blinkConfidence, fatigueScore, fatigueConfidence, attentionDriftScore, attentionDriftTrend, bpm, ibiMean, ibiStd, blinkVariability, headScore, headConfidence, pitch, yaw, roll, headDirection, gazeScore, gazeConfidence, gazeDirection, finalAttentionScore, fusionConfidence
- Unusable or internal derived loader fields: source_file, dataset_id, participant_id, sample_index, elapsed_seconds, blinkWeight_recomputed, headWeight_recomputed, gazeWeight_recomputed, blinkContribution_recomputed, headContribution_recomputed, gazeContribution_recomputed, rawAttentionScore_recomputed, conflictPenalty_recomputed, finalAttentionScore_recomputed

### Dataset Rows and Columns

- `attention_session_20260616_233539.csv`: 41 rows, 24 columns
- `attention_session_20260616_233542.json`: 41 rows, 24 columns

### Schema Mismatches

- No structural column mismatch in the `attention_session` CSV/JSON exports; all expected analytics fields are present.
- Content mismatch for inferential state comparisons: `attentionState` contains `High, Medium` but no `Low`, so High-vs-Low tests and 3-group ANOVA/Kruskal outputs are not produced.
- Content mismatch for multi-participant analyses: only one participant/session is available, so between-participant publication comparisons are descriptive only.
- Content mismatch for correlations: `fatigueConfidence` is constant in this dataset, so correlations involving it are undefined and skipped.
- Content mismatch for correlations: `headConfidence` is constant in this dataset, so correlations involving it are undefined and skipped.

### Full Schema Audit Artifacts

- `paper_outputs/tables/schema_audit.csv` contains per-column dtype, missing, min, and max values.
- `paper_outputs/tables/dataset_discovery_audit.csv` contains per-file discovery acceptance/rejection details.

## Figure Feasibility Audit

- `Attention Timeline`: `possible`. Required columns are present.
- `Blink Timeline`: `possible`. Required columns are present.
- `Fatigue Timeline`: `possible`. Required columns are present.
- `Attention Drift Timeline`: `possible`. Required columns are present.
- `Head Score Timeline`: `possible`. Required columns are present.
- `Gaze Score Timeline`: `possible`. Required columns are present.
- `Fusion Confidence Timeline`: `possible`. Required columns are present.
- `BPM Timeline`: `possible`. Required columns are present.
- `IBI Timeline`: `possible`. Required columns are present.
- `Attention State Distribution`: `possible`. Required columns are present.
- `Gaze Direction Distribution`: `possible`. Required columns are present.
- `Head Direction Distribution`: `possible`. Required columns are present.
- `Head Pose Angle Histograms`: `possible`. Required columns are present.
- `Numeric Histograms Grid`: `possible`. Required columns are present.
- `Attention State Boxplots`: `possible`. Required columns are present.
- `Attention State Violin Plots`: `possible`. Required columns are present.
- `Attention vs Blink Scatter`: `possible`. Required columns are present.
- `Attention vs Head Scatter`: `possible`. Required columns are present.
- `Attention vs Gaze Scatter`: `possible`. Required columns are present.
- `Fatigue vs Attention Scatter`: `possible`. Required columns are present.
- `Correlation Heatmap`: `possible`. Required columns are present.
- `Fusion Contribution Timeline`: `possible`. Required columns are present.
- `Calibration Quality Proxy Plot`: `possible`. Required columns are present.
- `Participant Mean Comparison`: `possible`. Required columns are present.
- `Participant State Comparison`: `possible`. Required columns are present.
- `Direction Crosstab Heatmap`: `possible`. Required columns are present.
- `Summary-Level Attention Comparison`: `possible`. Required columns are present.
- `Session Summary Metrics`: `possible`. Required columns are present.

## Generated Outputs

- Figures generated: 32
- Tables generated: 16
- Statistics artifacts generated: 10

### Generated Figures

- `paper_outputs\figures\bpm_timeline.png`
- `paper_outputs\figures\figure_01_attention_timeline.png`
- `paper_outputs\figures\figure_02_module_score_timeline.png`
- `paper_outputs\figures\figure_03_blink_timeline.png`
- `paper_outputs\figures\figure_04_fatigue_progression.png`
- `paper_outputs\figures\figure_05_attention_drift_timeline.png`
- `paper_outputs\figures\figure_06_gaze_direction_distribution.png`
- `paper_outputs\figures\figure_07_head_direction_distribution.png`
- `paper_outputs\figures\figure_08_attention_state_distribution.png`
- `paper_outputs\figures\figure_09_head_pose_angle_histograms.png`
- `paper_outputs\figures\figure_10_gaze_score_histogram.png`
- `paper_outputs\figures\figure_11_fusion_contribution_timeline.png`
- `paper_outputs\figures\figure_12_confidence_timeline.png`
- `paper_outputs\figures\figure_13_correlation_heatmap.png`
- `paper_outputs\figures\figure_14_attention_vs_blink_scatter.png`
- `paper_outputs\figures\figure_15_attention_vs_head_scatter.png`
- `paper_outputs\figures\figure_16_attention_vs_gaze_scatter.png`
- `paper_outputs\figures\figure_17_fatigue_vs_attention_scatter.png`
- `paper_outputs\figures\figure_18_attention_state_boxplots.png`
- `paper_outputs\figures\figure_19_attention_state_violins.png`
- `paper_outputs\figures\figure_20_numeric_histograms_grid.png`
- `paper_outputs\figures\figure_21_trend_curve_grid.png`
- `paper_outputs\figures\figure_22_calibration_quality_proxy_plot.png`
- `paper_outputs\figures\figure_23_participant_mean_comparison.png`
- `paper_outputs\figures\figure_24_participant_state_comparison.png`
- `paper_outputs\figures\figure_25_direction_crosstab_heatmap.png`
- `paper_outputs\figures\fusion_confidence_timeline.png`
- `paper_outputs\figures\gaze_score_timeline.png`
- `paper_outputs\figures\head_score_timeline.png`
- `paper_outputs\figures\ibi_timeline.png`
- `paper_outputs\figures\session_summary_metrics.png`
- `paper_outputs\figures\summary_level_attention_comparison.png`

### Generated Tables

- `paper_outputs\tables\attention_state_group_means.csv`
- `paper_outputs\tables\categorical_distributions.csv`
- `paper_outputs\tables\confidence_intervals_table.csv`
- `paper_outputs\tables\dataset_discovery_audit.csv`
- `paper_outputs\tables\dataset_inventory.csv`
- `paper_outputs\tables\export_schema_table.csv`
- `paper_outputs\tables\figure_feasibility_audit.csv`
- `paper_outputs\tables\fusion_recomputed_fields_summary.csv`
- `paper_outputs\tables\gaze_direction_group_means.csv`
- `paper_outputs\tables\head_direction_group_means.csv`
- `paper_outputs\tables\json_metadata_export.csv`
- `paper_outputs\tables\json_session_summary_export.csv`
- `paper_outputs\tables\missingness_report.csv`
- `paper_outputs\tables\participant_summary.csv`
- `paper_outputs\tables\schema_audit.csv`
- `paper_outputs\tables\session_descriptive_statistics.csv`

### Generated Statistics

- `paper_outputs\statistics\analysis_summary.txt`
- `paper_outputs\statistics\anova_tests.csv`
- `paper_outputs\statistics\chi_square_tests.csv`
- `paper_outputs\statistics\cohens_d_effect_sizes.csv`
- `paper_outputs\statistics\confidence_intervals.csv`
- `paper_outputs\statistics\kruskal_wallis_tests.csv`
- `paper_outputs\statistics\mann_whitney_tests.csv`
- `paper_outputs\statistics\t_tests.csv`
- `paper_outputs\correlations\pearson_correlations.csv`
- `paper_outputs\correlations\spearman_correlations.csv`

## Output Notes

- All PNG figures are written to `paper_outputs/figures` for this run.
- Correlation matrices remain in `paper_outputs/correlations` as CSV artifacts.
- Statistical test outputs remain in `paper_outputs/statistics` as CSV/text artifacts.
