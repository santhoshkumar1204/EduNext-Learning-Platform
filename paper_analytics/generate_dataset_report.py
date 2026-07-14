from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from common import (
    OUTPUT_DIRS,
    PROJECT_ROOT,
    SAMPLE_CATEGORICAL_COLUMNS,
    SAMPLE_NUMERIC_COLUMNS,
    audit_dataset_discovery,
    ensure_output_dirs,
    find_export_files,
    load_exports,
    save_csv,
    save_text,
)


FIGURE_SPECS = [
    ("Attention Timeline", ["timestamp", "finalAttentionScore"], "Single-session time series"),
    ("Blink Timeline", ["timestamp", "bpm", "blinkScore"], "Single-session time series"),
    ("Fatigue Timeline", ["timestamp", "fatigueScore"], "Single-session time series"),
    ("Attention Drift Timeline", ["timestamp", "attentionDriftScore"], "Single-session time series"),
    ("Head Score Timeline", ["timestamp", "headScore"], "Single-session time series"),
    ("Gaze Score Timeline", ["timestamp", "gazeScore"], "Single-session time series"),
    ("Fusion Confidence Timeline", ["timestamp", "fusionConfidence"], "Single-session time series"),
    ("BPM Timeline", ["timestamp", "bpm"], "Single-session time series"),
    ("IBI Timeline", ["timestamp", "ibiMean", "ibiStd"], "Single-session time series"),
    ("Attention State Distribution", ["attentionState"], "Categorical frequency plot"),
    ("Gaze Direction Distribution", ["gazeDirection"], "Categorical frequency plot"),
    ("Head Direction Distribution", ["headDirection"], "Categorical frequency plot"),
    ("Head Pose Angle Histograms", ["pitch", "yaw", "roll"], "Univariate histogram"),
    ("Numeric Histograms Grid", SAMPLE_NUMERIC_COLUMNS, "All numeric univariate distributions"),
    ("Attention State Boxplots", ["attentionState", "bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "finalAttentionScore"], "Requires at least two state groups"),
    ("Attention State Violin Plots", ["attentionState", "bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "finalAttentionScore"], "Requires at least two state groups"),
    ("Attention vs Blink Scatter", ["blinkScore", "finalAttentionScore"], "Bivariate scatter"),
    ("Attention vs Head Scatter", ["headScore", "finalAttentionScore"], "Bivariate scatter"),
    ("Attention vs Gaze Scatter", ["gazeScore", "finalAttentionScore"], "Bivariate scatter"),
    ("Fatigue vs Attention Scatter", ["fatigueScore", "finalAttentionScore"], "Bivariate scatter"),
    ("Correlation Heatmap", SAMPLE_NUMERIC_COLUMNS, "Requires at least two numeric columns"),
    ("Fusion Contribution Timeline", ["blinkScore", "headScore", "gazeScore", "blinkConfidence", "headConfidence", "gazeConfidence", "timestamp"], "Recomputed from exported columns"),
    ("Calibration Quality Proxy Plot", ["timestamp", "gazeConfidence", "headConfidence", "fusionConfidence"], "Uses confidence proxies only"),
    ("Participant Mean Comparison", ["participant_id", "finalAttentionScore", "blinkScore", "headScore", "gazeScore"], "Works with one or more sessions"),
    ("Participant State Comparison", ["participant_id", "attentionState"], "Works with one or more sessions"),
    ("Direction Crosstab Heatmap", ["headDirection", "gazeDirection"], "Requires two categorical columns"),
    ("Summary-Level Attention Comparison", ["averageAttentionScore", "averageBlinkScore", "averageHeadScore", "averageGazeScore"], "Requires JSON summary"),
    ("Session Summary Metrics", ["averageAttentionScore", "averageBlinkScore", "averageHeadScore", "averageGazeScore", "averageFatigueScore", "averageBPM"], "Requires JSON summary"),
]


def run(root: Path | None = None) -> None:
    ensure_output_dirs()
    root = root or Path(__file__).resolve().parents[1]
    discovery = audit_dataset_discovery(root)
    save_csv(discovery, OUTPUT_DIRS["tables"] / "dataset_discovery_audit.csv")

    csv_files, json_files = find_export_files(root)
    schema_rows = []

    for csv_path in csv_files:
        df = pd.read_csv(csv_path)
        schema_rows.extend(_schema_rows_for_frame(df, csv_path, "session_csv"))
    for json_path in json_files:
        payload = json.loads(json_path.read_text(encoding="utf-8"))
        df = pd.DataFrame(payload.get("samples", []))
        schema_rows.extend(_schema_rows_for_frame(df, json_path, "session_json_samples"))

    schema_audit = pd.DataFrame(schema_rows)
    if not schema_audit.empty:
        save_csv(schema_audit, OUTPUT_DIRS["tables"] / "schema_audit.csv")

    samples, summaries, metadata = load_exports(root)
    feasibility = _figure_feasibility(samples, summaries)
    save_csv(feasibility, OUTPUT_DIRS["tables"] / "figure_feasibility_audit.csv")

    generated_figures = sorted(str(path.relative_to(root)) for path in OUTPUT_DIRS["figures"].glob("*.png"))
    generated_tables = sorted(str(path.relative_to(root)) for path in OUTPUT_DIRS["tables"].glob("*.csv"))
    generated_statistics = sorted(str(path.relative_to(root)) for path in OUTPUT_DIRS["statistics"].glob("*"))
    generated_statistics += sorted(str(path.relative_to(root)) for path in OUTPUT_DIRS["correlations"].glob("*.csv"))

    report = _build_markdown_report(
        discovery=discovery,
        schema_audit=schema_audit,
        samples=samples,
        summaries=summaries,
        metadata=metadata,
        feasibility=feasibility,
        generated_figures=generated_figures,
        generated_tables=generated_tables,
        generated_statistics=generated_statistics,
    )
    save_text(report, root / "paper_outputs" / "dataset_report.md")


def _schema_rows_for_frame(df: pd.DataFrame, path: Path, kind: str) -> list[dict]:
    rows = []
    if df.empty:
        return rows
    numeric = df.select_dtypes(include="number")
    mins = numeric.min(numeric_only=True).to_dict()
    maxs = numeric.max(numeric_only=True).to_dict()
    for column in df.columns:
        rows.append(
            {
                "source_file": str(path),
                "kind": kind,
                "row_count": int(len(df)),
                "column": column,
                "dtype": str(df[column].dtype),
                "missing_values": int(df[column].isna().sum()),
                "min_value": mins.get(column, ""),
                "max_value": maxs.get(column, ""),
            }
        )
    return rows


def _figure_feasibility(samples: pd.DataFrame, summaries: pd.DataFrame) -> pd.DataFrame:
    sample_columns = set(samples.columns)
    summary_columns = set(summaries.columns)
    rows = []
    state_count = samples["attentionState"].replace("", pd.NA).dropna().nunique() if not samples.empty and "attentionState" in samples.columns else 0
    participant_count = samples["participant_id"].replace("", pd.NA).dropna().nunique() if not samples.empty and "participant_id" in samples.columns else 0
    for title, required_columns, note in FIGURE_SPECS:
        column_source = summary_columns if title in {"Summary-Level Attention Comparison", "Session Summary Metrics"} else sample_columns
        missing = [column for column in required_columns if column not in column_source]
        possible = len(missing) == 0
        reason = "Required columns are present."
        if missing:
            possible = False
            reason = f"Missing columns: {', '.join(missing)}."
        elif title in {"Attention State Boxplots", "Attention State Violin Plots"} and state_count < 2:
            possible = False
            reason = "At least two attentionState groups are required."
        elif title in {"Participant Mean Comparison", "Participant State Comparison"} and participant_count < 1:
            possible = False
            reason = "No participant/session identifier available."
        rows.append(
            {
                "title": title,
                "required_columns": ", ".join(required_columns),
                "status": "possible" if possible else "impossible",
                "reason": reason,
                "note": note,
            }
        )
    return pd.DataFrame(rows)


def _build_markdown_report(
    *,
    discovery: pd.DataFrame,
    schema_audit: pd.DataFrame,
    samples: pd.DataFrame,
    summaries: pd.DataFrame,
    metadata: pd.DataFrame,
    feasibility: pd.DataFrame,
    generated_figures: list[str],
    generated_tables: list[str],
    generated_statistics: list[str],
) -> str:
    accepted = discovery.loc[discovery["accepted"]]
    rejected = discovery.loc[~discovery["accepted"]]
    sample_columns = list(samples.columns) if not samples.empty else []
    internal_fields = {
        "source_file",
        "dataset_id",
        "participant_id",
        "sample_index",
        "elapsed_seconds",
        "blinkWeight_recomputed",
        "headWeight_recomputed",
        "gazeWeight_recomputed",
        "blinkContribution_recomputed",
        "headContribution_recomputed",
        "gazeContribution_recomputed",
        "rawAttentionScore_recomputed",
        "conflictPenalty_recomputed",
        "finalAttentionScore_recomputed",
    }
    usable_variables = [column for column in sample_columns if column not in internal_fields]
    unusable_variables = [column for column in sample_columns if column in internal_fields]
    scanned_folders = sorted(
        {
            str(Path(folder).relative_to(PROJECT_ROOT)) if str(folder).startswith(str(PROJECT_ROOT)) else str(folder)
            for folder in discovery["folder"].dropna().unique()
        }
    )
    schema_mismatches = _schema_mismatch_lines(samples, summaries, metadata)

    lines = [
        "# Dataset Report",
        "",
        "## Dataset Discovery Audit",
        "",
        f"- Project root searched recursively: `{PROJECT_ROOT}`",
        "- Excluded folders: `node_modules`, `dist`, `paper_outputs`, `paper_analytics`, `.git`",
        f"- Folders containing scanned candidate files: {', '.join(f'`{folder}`' for folder in scanned_folders)}",
        "- Accepted filename patterns: `attention_session_*.csv`, `attention_session_*.json`",
        "- Accepted file types: `.csv`, `.json`",
        "- Ignored file types for loading: `.xlsx` and non-matching `.csv` / `.json` basenames",
        f"- Candidate dataset-like files scanned: {len(discovery)}",
        f"- Accepted session exports: {len(accepted)}",
        f"- Rejected files: {len(rejected)}",
        f"- Loaded session sample rows: {len(samples)}",
        f"- Loaded JSON session summaries: {len(summaries)}",
        f"- Loaded JSON metadata rows: {len(metadata)}",
        "",
        "### Accepted Files",
        "",
    ]
    for _, row in accepted.iterrows():
        lines.append(f"- `{row['filename']}` in `{Path(row['folder']).name}`: {row['reason']}")
    lines.extend(["", "### Rejected Files", ""])
    for _, row in rejected.iterrows():
        lines.append(f"- `{row['filename']}` in `{Path(row['folder']).name}`: {row['reason']}")

    lines.extend(
        [
            "",
            "## Session Schema Audit",
            "",
            f"- Sample columns loaded: {', '.join(sample_columns)}",
            f"- Usable variables: {', '.join(usable_variables)}",
            f"- Unusable or internal derived loader fields: {', '.join(unusable_variables) if unusable_variables else 'None'}",
            "",
            "### Dataset Rows and Columns",
            "",
        ]
    )
    if not schema_audit.empty:
        for source_file, group in schema_audit.groupby("source_file", dropna=False):
            lines.append(f"- `{Path(source_file).name}`: {int(group['row_count'].max())} rows, {group['column'].nunique()} columns")
    else:
        lines.append("- No accepted session exports were available for schema auditing.")

    lines.extend(["", "### Schema Mismatches", ""])
    for item in schema_mismatches:
        lines.append(f"- {item}")

    lines.extend(
        [
            "",
            "### Full Schema Audit Artifacts",
            "",
            "- `paper_outputs/tables/schema_audit.csv` contains per-column dtype, missing, min, and max values.",
            "- `paper_outputs/tables/dataset_discovery_audit.csv` contains per-file discovery acceptance/rejection details.",
            "",
            "## Figure Feasibility Audit",
            "",
        ]
    )
    for _, row in feasibility.iterrows():
        lines.append(f"- `{row['title']}`: `{row['status']}`. {row['reason']}")

    lines.extend(
        [
            "",
            "## Generated Outputs",
            "",
            f"- Figures generated: {len(generated_figures)}",
            f"- Tables generated: {len(generated_tables)}",
            f"- Statistics artifacts generated: {len(generated_statistics)}",
            "",
            "### Generated Figures",
            "",
        ]
    )
    for item in generated_figures:
        lines.append(f"- `{item}`")

    lines.extend(["", "### Generated Tables", ""])
    for item in generated_tables:
        lines.append(f"- `{item}`")

    lines.extend(["", "### Generated Statistics", ""])
    for item in generated_statistics:
        lines.append(f"- `{item}`")

    lines.extend(["", "## Output Notes", ""])
    lines.append("- All PNG figures are written to `paper_outputs/figures` for this run.")
    lines.append("- Correlation matrices remain in `paper_outputs/correlations` as CSV artifacts.")
    lines.append("- Statistical test outputs remain in `paper_outputs/statistics` as CSV/text artifacts.")
    lines.append("")
    return "\n".join(lines)


def _schema_mismatch_lines(samples: pd.DataFrame, summaries: pd.DataFrame, metadata: pd.DataFrame) -> list[str]:
    internal_fields = {
        "source_file",
        "dataset_id",
        "participant_id",
        "sample_index",
        "elapsed_seconds",
        "blinkWeight_recomputed",
        "headWeight_recomputed",
        "gazeWeight_recomputed",
        "blinkContribution_recomputed",
        "headContribution_recomputed",
        "gazeContribution_recomputed",
        "rawAttentionScore_recomputed",
        "conflictPenalty_recomputed",
        "finalAttentionScore_recomputed",
    }
    expected_sample_fields = {"timestamp", *SAMPLE_NUMERIC_COLUMNS, *SAMPLE_CATEGORICAL_COLUMNS}
    actual_sample_fields = set(samples.columns) - internal_fields
    missing_fields = sorted(expected_sample_fields - actual_sample_fields)
    extra_fields = sorted(actual_sample_fields - expected_sample_fields)
    lines = []
    if missing_fields:
        lines.append(f"Structural mismatch: missing expected exported fields `{', '.join(missing_fields)}`.")
    else:
        lines.append("No structural column mismatch in the `attention_session` CSV/JSON exports; all expected analytics fields are present.")
    if extra_fields:
        lines.append(f"Additional exported fields not required by the core audit: `{', '.join(extra_fields)}`.")
    if "attentionState" in samples.columns:
        states = sorted(value for value in samples["attentionState"].replace("", pd.NA).dropna().unique())
        if "Low" not in states:
            lines.append(
                f"Content mismatch for inferential state comparisons: `attentionState` contains `{', '.join(states)}` but no `Low`, so High-vs-Low tests and 3-group ANOVA/Kruskal outputs are not produced."
            )
    participant_count = samples["participant_id"].replace("", pd.NA).dropna().nunique() if "participant_id" in samples.columns else 0
    if participant_count < 2:
        lines.append("Content mismatch for multi-participant analyses: only one participant/session is available, so between-participant publication comparisons are descriptive only.")
    for column in ["fatigueConfidence", "headConfidence"]:
        if column in samples.columns and samples[column].nunique(dropna=True) <= 1:
            lines.append(f"Content mismatch for correlations: `{column}` is constant in this dataset, so correlations involving it are undefined and skipped.")
    if summaries.empty:
        lines.append("JSON summary mismatch: no `sessionSummary` rows were loaded, so summary-only plots would be impossible.")
    if metadata.empty:
        lines.append("JSON metadata mismatch: no metadata rows were loaded.")
    return lines


if __name__ == "__main__":
    run()
