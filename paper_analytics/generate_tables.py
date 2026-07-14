from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from common import (
    OUTPUT_DIRS,
    SCHEMA_ROWS,
    categorical_columns_present,
    confidence_interval,
    ensure_output_dirs,
    load_exports,
    numeric_columns_present,
    save_csv,
)


def run(root: Path | None = None) -> None:
    ensure_output_dirs()
    samples, summaries, metadata = load_exports(root)

    save_csv(pd.DataFrame(SCHEMA_ROWS), OUTPUT_DIRS["tables"] / "export_schema_table.csv")

    if samples.empty:
        save_csv(pd.DataFrame(columns=["message"]), OUTPUT_DIRS["tables"] / "dataset_inventory.csv")
        return

    save_csv(_dataset_inventory(samples), OUTPUT_DIRS["tables"] / "dataset_inventory.csv")
    save_csv(_descriptive_statistics(samples), OUTPUT_DIRS["tables"] / "session_descriptive_statistics.csv")
    save_csv(_categorical_distributions(samples), OUTPUT_DIRS["tables"] / "categorical_distributions.csv")
    save_csv(_participant_summary(samples), OUTPUT_DIRS["tables"] / "participant_summary.csv")
    save_csv(_group_means(samples, "attentionState"), OUTPUT_DIRS["tables"] / "attention_state_group_means.csv")
    save_csv(_group_means(samples, "gazeDirection"), OUTPUT_DIRS["tables"] / "gaze_direction_group_means.csv")
    save_csv(_group_means(samples, "headDirection"), OUTPUT_DIRS["tables"] / "head_direction_group_means.csv")
    save_csv(_missingness_report(samples), OUTPUT_DIRS["tables"] / "missingness_report.csv")
    save_csv(_confidence_intervals(samples), OUTPUT_DIRS["tables"] / "confidence_intervals_table.csv")
    save_csv(_recomputed_fusion_summary(samples), OUTPUT_DIRS["tables"] / "fusion_recomputed_fields_summary.csv")

    if not summaries.empty:
        save_csv(summaries, OUTPUT_DIRS["tables"] / "json_session_summary_export.csv")
    if not metadata.empty:
        save_csv(metadata, OUTPUT_DIRS["tables"] / "json_metadata_export.csv")


def _dataset_inventory(samples: pd.DataFrame) -> pd.DataFrame:
    grouped = (
        samples.groupby(["participant_id", "dataset_id", "source_file"], dropna=False)
        .agg(
            row_count=("dataset_id", "size"),
            session_start=("timestamp", "min"),
            session_end=("timestamp", "max"),
        )
        .reset_index()
    )
    grouped["duration_seconds"] = (grouped["session_end"] - grouped["session_start"]).dt.total_seconds()
    return grouped


def _descriptive_statistics(samples: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for column in numeric_columns_present(samples):
        series = samples[column].dropna()
        if series.empty:
            continue
        rows.append(
            {
                "variable": column,
                "count": int(series.shape[0]),
                "mean": float(series.mean()),
                "std": float(series.std(ddof=0)),
                "min": float(series.min()),
                "q1": float(series.quantile(0.25)),
                "median": float(series.median()),
                "q3": float(series.quantile(0.75)),
                "max": float(series.max()),
            }
        )
    return pd.DataFrame(rows)


def _categorical_distributions(samples: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for column in categorical_columns_present(samples):
        counts = samples[column].replace("", "Missing").value_counts(dropna=False)
        total = counts.sum()
        for category, count in counts.items():
            rows.append(
                {
                    "variable": column,
                    "category": category,
                    "count": int(count),
                    "percentage": float((count / total) * 100 if total else 0),
                }
            )
    return pd.DataFrame(rows)


def _participant_summary(samples: pd.DataFrame) -> pd.DataFrame:
    numeric = [
        "finalAttentionScore",
        "blinkScore",
        "headScore",
        "gazeScore",
        "fatigueScore",
        "fusionConfidence",
        "bpm",
    ]
    summary = (
        samples.groupby("participant_id")[numeric]
        .mean(numeric_only=True)
        .rename(columns=lambda name: f"mean_{name}")
    )
    counts = samples.groupby("participant_id").size().rename("sample_count")
    starts = samples.groupby("participant_id")["timestamp"].min().rename("session_start")
    ends = samples.groupby("participant_id")["timestamp"].max().rename("session_end")
    out = pd.concat([counts, starts, ends, summary], axis=1).reset_index()
    out["duration_seconds"] = (out["session_end"] - out["session_start"]).dt.total_seconds()
    return out


def _group_means(samples: pd.DataFrame, grouping: str) -> pd.DataFrame:
    if grouping not in samples.columns:
        return pd.DataFrame()
    numeric = numeric_columns_present(samples)
    grouped = samples.groupby(grouping)[numeric].agg(["count", "mean", "std"])
    grouped.columns = [f"{column}_{stat}" for column, stat in grouped.columns]
    return grouped.reset_index()


def _missingness_report(samples: pd.DataFrame) -> pd.DataFrame:
    rows = []
    total = len(samples)
    for column in samples.columns:
        missing = int(samples[column].isna().sum())
        rows.append(
            {
                "variable": column,
                "missing_count": missing,
                "missing_percentage": float((missing / total) * 100 if total else 0),
            }
        )
    return pd.DataFrame(rows)


def _confidence_intervals(samples: pd.DataFrame) -> pd.DataFrame:
    rows = []
    metrics = ["finalAttentionScore", "blinkScore", "headScore", "gazeScore", "fatigueScore", "bpm", "fusionConfidence"]
    for participant_id, group in samples.groupby("participant_id"):
        for metric in metrics:
            if metric not in group.columns:
                continue
            values = group[metric].dropna()
            if values.empty:
                continue
            ci_low, ci_high = confidence_interval(values)
            rows.append(
                {
                    "grouping": "participant_id",
                    "group": participant_id,
                    "metric": metric,
                    "n": int(values.shape[0]),
                    "mean": float(values.mean()),
                    "ci_low": ci_low,
                    "ci_high": ci_high,
                }
            )
    return pd.DataFrame(rows)


def _recomputed_fusion_summary(samples: pd.DataFrame) -> pd.DataFrame:
    columns = [
        "blinkWeight_recomputed",
        "headWeight_recomputed",
        "gazeWeight_recomputed",
        "blinkContribution_recomputed",
        "headContribution_recomputed",
        "gazeContribution_recomputed",
        "rawAttentionScore_recomputed",
        "conflictPenalty_recomputed",
        "finalAttentionScore_recomputed",
    ]
    rows = []
    for column in columns:
        if column not in samples.columns:
            continue
        values = samples[column].dropna()
        rows.append(
            {
                "variable": column,
                "count": int(values.shape[0]),
                "mean": float(values.mean()) if not values.empty else np.nan,
                "std": float(values.std(ddof=0)) if not values.empty else np.nan,
                "min": float(values.min()) if not values.empty else np.nan,
                "max": float(values.max()) if not values.empty else np.nan,
            }
        )
    return pd.DataFrame(rows)


if __name__ == "__main__":
    run()
