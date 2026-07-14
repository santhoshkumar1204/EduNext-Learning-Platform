from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Iterable

import numpy as np
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = PROJECT_ROOT / "paper_outputs"
OUTPUT_DIRS = {
    "figures": OUTPUT_ROOT / "figures",
    "tables": OUTPUT_ROOT / "tables",
    "statistics": OUTPUT_ROOT / "statistics",
    "correlations": OUTPUT_ROOT / "correlations",
    "participants": OUTPUT_ROOT / "participants",
}

SAMPLE_NUMERIC_COLUMNS = [
    "attentionScore",
    "blinkScore",
    "blinkConfidence",
    "fatigueScore",
    "fatigueConfidence",
    "attentionDriftScore",
    "bpm",
    "ibiMean",
    "ibiStd",
    "blinkVariability",
    "headScore",
    "headConfidence",
    "pitch",
    "yaw",
    "roll",
    "gazeScore",
    "gazeConfidence",
    "finalAttentionScore",
    "fusionConfidence",
]

SAMPLE_CATEGORICAL_COLUMNS = [
    "attentionState",
    "attentionDriftTrend",
    "headDirection",
    "gazeDirection",
]

SCHEMA_ROWS = [
    {
        "field": "timestamp",
        "datatype": "string",
        "source_module": "Session Recorder",
        "formula_source": "new Date(now).toISOString()",
        "description": "Sample timestamp",
    },
    {
        "field": "attentionScore",
        "datatype": "number",
        "source_module": "Attention Fusion",
        "formula_source": "fusion.finalAttentionScore",
        "description": "Duplicate export of final attention score",
    },
    {
        "field": "attentionState",
        "datatype": "string",
        "source_module": "Attention Fusion",
        "formula_source": "fusion.finalAttentionState",
        "description": "Final attention label",
    },
    {
        "field": "blinkScore",
        "datatype": "number",
        "source_module": "Attention Fusion / Blink",
        "formula_source": "fusion.blinkScore",
        "description": "Blink module score before weighting",
    },
    {
        "field": "blinkConfidence",
        "datatype": "number",
        "source_module": "Attention Fusion / Blink",
        "formula_source": "fusion.blinkConfidence",
        "description": "Blink module confidence",
    },
    {
        "field": "fatigueScore",
        "datatype": "number",
        "source_module": "Fatigue",
        "formula_source": "blinkAnalytics.fatigue.fatigueScore",
        "description": "Fatigue score",
    },
    {
        "field": "fatigueConfidence",
        "datatype": "number",
        "source_module": "Fatigue",
        "formula_source": "blinkAnalytics.fatigue.fatigueConfidence",
        "description": "Fatigue confidence",
    },
    {
        "field": "attentionDriftScore",
        "datatype": "number",
        "source_module": "Attention Drift",
        "formula_source": "blinkAnalytics.attentionDrift.attentionDriftScore",
        "description": "Drift-adjusted attention score",
    },
    {
        "field": "attentionDriftTrend",
        "datatype": "string",
        "source_module": "Attention Drift",
        "formula_source": "blinkAnalytics.attentionDrift.trendLabel",
        "description": "Trend label",
    },
    {
        "field": "bpm",
        "datatype": "number",
        "source_module": "Blink Analytics",
        "formula_source": "metrics.currentBpm",
        "description": "Rolling blinks per minute",
    },
    {
        "field": "ibiMean",
        "datatype": "number",
        "source_module": "Blink Events",
        "formula_source": "blinkAnalytics.ibi.avgIbi",
        "description": "Mean inter-blink interval",
    },
    {
        "field": "ibiStd",
        "datatype": "number",
        "source_module": "Blink Events",
        "formula_source": "blinkAnalytics.ibi.ibiStdDev",
        "description": "Standard deviation of IBI",
    },
    {
        "field": "blinkVariability",
        "datatype": "number",
        "source_module": "Blink Events",
        "formula_source": "blinkAnalytics.ibi.variabilityIndex",
        "description": "Coefficient of variation of IBI",
    },
    {
        "field": "headScore",
        "datatype": "number",
        "source_module": "Attention Fusion / Head",
        "formula_source": "fusion.headScore",
        "description": "Head module score before weighting",
    },
    {
        "field": "headConfidence",
        "datatype": "number",
        "source_module": "Attention Fusion / Head",
        "formula_source": "fusion.headConfidence",
        "description": "Head module confidence",
    },
    {
        "field": "pitch",
        "datatype": "number",
        "source_module": "Head Pose",
        "formula_source": "headPose.pitchAngle",
        "description": "Calibrated pitch angle",
    },
    {
        "field": "yaw",
        "datatype": "number",
        "source_module": "Head Pose",
        "formula_source": "headPose.yawAngle",
        "description": "Calibrated yaw angle",
    },
    {
        "field": "roll",
        "datatype": "number",
        "source_module": "Head Pose",
        "formula_source": "headPose.rollAngle",
        "description": "Calibrated roll angle",
    },
    {
        "field": "headDirection",
        "datatype": "string",
        "source_module": "Head Pose",
        "formula_source": "headPose.headDirection",
        "description": "Head direction label",
    },
    {
        "field": "gazeScore",
        "datatype": "number",
        "source_module": "Attention Fusion / Gaze",
        "formula_source": "fusion.gazeScore",
        "description": "Gaze module score before weighting",
    },
    {
        "field": "gazeConfidence",
        "datatype": "number",
        "source_module": "Attention Fusion / Gaze",
        "formula_source": "fusion.gazeConfidence",
        "description": "Gaze module confidence",
    },
    {
        "field": "gazeDirection",
        "datatype": "string",
        "source_module": "Gaze Tracking",
        "formula_source": "gaze.gazeDirection",
        "description": "Gaze direction label",
    },
    {
        "field": "finalAttentionScore",
        "datatype": "number",
        "source_module": "Attention Fusion",
        "formula_source": "fusion.finalAttentionScore",
        "description": "Final fused attention score",
    },
    {
        "field": "fusionConfidence",
        "datatype": "number",
        "source_module": "Session Recorder",
        "formula_source": "averageFinite([fusion.blinkConfidence, fusion.headConfidence, fusion.gazeConfidence])",
        "description": "Mean module confidence",
    },
]


def ensure_output_dirs() -> None:
    for directory in OUTPUT_DIRS.values():
        directory.mkdir(parents=True, exist_ok=True)


def list_dataset_candidates(root: Path | None = None) -> list[Path]:
    root = root or PROJECT_ROOT
    candidates = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in {"node_modules", "dist", "paper_outputs", "paper_analytics", ".git"} for part in path.parts):
            continue
        if path.suffix.lower() in {".csv", ".json", ".xlsx"}:
            candidates.append(path)
    return sorted(candidates)


def find_export_files(root: Path | None = None) -> tuple[list[Path], list[Path]]:
    root = root or PROJECT_ROOT
    csv_files = []
    json_files = []
    for path in list_dataset_candidates(root):
        if path.suffix.lower() == ".csv" and path.name.startswith("attention_session_"):
            csv_files.append(path)
        if path.suffix.lower() == ".json" and path.name.startswith("attention_session_"):
            json_files.append(path)
    return sorted(csv_files), sorted(json_files)


def infer_dataset_id(path: Path) -> str:
    return path.stem


def infer_participant_id(path: Path) -> str:
    if path.parent == PROJECT_ROOT:
        return path.stem
    return f"{path.parent.name}_{path.stem}"


def audit_dataset_discovery(root: Path | None = None) -> pd.DataFrame:
    root = root or PROJECT_ROOT
    rows = []
    for path in list_dataset_candidates(root):
        suffix = path.suffix.lower()
        accepted = False
        reason = ""
        kind = "ignored"
        if suffix == ".csv" and path.name.startswith("attention_session_"):
            accepted = True
            reason = "Accepted as session CSV export."
            kind = "session_csv"
        elif suffix == ".json" and path.name.startswith("attention_session_"):
            accepted = True
            reason = "Accepted as session JSON export."
            kind = "session_json"
        elif suffix == ".xlsx":
            reason = "Rejected: XLSX is not loaded by the analytics package."
            kind = "ignored"
        elif suffix == ".csv":
            reason = "Rejected: CSV filename does not start with attention_session_."
            kind = "ignored"
        elif suffix == ".json":
            reason = "Rejected: JSON filename does not start with attention_session_."
            kind = "ignored"
        else:
            reason = "Rejected: unsupported file type."
        rows.append(
            {
                "path": str(path),
                "folder": str(path.parent),
                "filename": path.name,
                "suffix": suffix,
                "accepted": accepted,
                "kind": kind,
                "reason": reason,
            }
        )
    return pd.DataFrame(rows)


def load_exports(root: Path | None = None) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    root = root or PROJECT_ROOT
    csv_files, json_files = find_export_files(root)

    sample_frames: list[pd.DataFrame] = []
    summary_rows: list[dict] = []
    metadata_rows: list[dict] = []
    csv_signatures: dict[tuple, dict[str, str]] = {}

    for csv_path in csv_files:
        df = pd.read_csv(csv_path)
        dataset_id = infer_dataset_id(csv_path)
        participant_id = infer_participant_id(csv_path)
        signature = sample_signature(df)
        if signature is not None:
            csv_signatures[signature] = {
                "dataset_id": dataset_id,
                "participant_id": participant_id,
                "source_file": str(csv_path),
            }
        df["source_file"] = str(csv_path)
        df["dataset_id"] = dataset_id
        df["participant_id"] = participant_id
        sample_frames.append(df)

    for json_path in json_files:
        payload = json.loads(json_path.read_text(encoding="utf-8"))
        dataset_id = infer_dataset_id(json_path)
        participant_id = infer_participant_id(json_path)
        samples = payload.get("samples", [])
        sample_df = pd.DataFrame(samples) if samples else pd.DataFrame()
        matched_csv = csv_signatures.get(sample_signature(sample_df)) if not sample_df.empty else None

        if matched_csv:
            dataset_id = matched_csv["dataset_id"]
            participant_id = matched_csv["participant_id"]

        metadata = dict(payload.get("metadata", {}))
        metadata["source_file"] = str(json_path)
        metadata["dataset_id"] = dataset_id
        metadata["participant_id"] = participant_id
        metadata["matched_sample_source_file"] = matched_csv["source_file"] if matched_csv else ""
        metadata_rows.append(metadata)

        session_summary = dict(payload.get("sessionSummary", {}))
        session_summary["source_file"] = str(json_path)
        session_summary["dataset_id"] = dataset_id
        session_summary["participant_id"] = participant_id
        session_summary["matched_sample_source_file"] = matched_csv["source_file"] if matched_csv else ""
        summary_rows.append(session_summary)

        if not matched_csv and not sample_df.empty:
            sample_df["source_file"] = str(json_path)
            sample_df["dataset_id"] = dataset_id
            sample_df["participant_id"] = participant_id
            sample_frames.append(sample_df)

    samples = pd.concat(sample_frames, ignore_index=True) if sample_frames else pd.DataFrame()
    summaries = pd.DataFrame(summary_rows)
    metadata = pd.DataFrame(metadata_rows)

    if not samples.empty:
        if "timestamp" in samples.columns:
            samples["timestamp"] = pd.to_datetime(samples["timestamp"], errors="coerce")
        for column in SAMPLE_NUMERIC_COLUMNS:
            if column in samples.columns:
                samples[column] = pd.to_numeric(samples[column], errors="coerce")
        for column in SAMPLE_CATEGORICAL_COLUMNS:
            if column in samples.columns:
                samples[column] = samples[column].fillna("").astype(str)

        samples = samples.sort_values(["dataset_id", "timestamp"], kind="stable").reset_index(drop=True)
        samples["sample_index"] = samples.groupby("dataset_id").cumcount()
        samples["elapsed_seconds"] = samples.groupby("dataset_id")["timestamp"].transform(_elapsed_seconds)
        samples = append_recomputed_fusion_fields(samples)

    if not summaries.empty:
        for column in summaries.columns:
            if column not in {"source_file", "dataset_id", "participant_id"}:
                try:
                    summaries[column] = pd.to_numeric(summaries[column])
                except (ValueError, TypeError):
                    pass

    return samples, summaries, metadata


def append_recomputed_fusion_fields(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    needed = {
        "blinkScore",
        "headScore",
        "gazeScore",
        "blinkConfidence",
        "headConfidence",
        "gazeConfidence",
    }
    if not needed.issubset(df.columns):
        return df

    confidence_sum = (
        df["blinkConfidence"].fillna(0)
        + df["headConfidence"].fillna(0)
        + df["gazeConfidence"].fillna(0)
    )
    safe_sum = confidence_sum.where(confidence_sum > 0, 1.0)

    df["blinkWeight_recomputed"] = df["blinkConfidence"].fillna(0) / safe_sum
    df["headWeight_recomputed"] = df["headConfidence"].fillna(0) / safe_sum
    df["gazeWeight_recomputed"] = df["gazeConfidence"].fillna(0) / safe_sum

    df["blinkContribution_recomputed"] = df["blinkWeight_recomputed"] * df["blinkScore"].fillna(0)
    df["headContribution_recomputed"] = df["headWeight_recomputed"] * df["headScore"].fillna(0)
    df["gazeContribution_recomputed"] = df["gazeWeight_recomputed"] * df["gazeScore"].fillna(0)

    df["rawAttentionScore_recomputed"] = np.clip(
        df["blinkContribution_recomputed"]
        + df["headContribution_recomputed"]
        + df["gazeContribution_recomputed"],
        0,
        100,
    )
    df["conflictPenalty_recomputed"] = df.apply(_row_conflict_penalty, axis=1)
    df["finalAttentionScore_recomputed"] = np.clip(
        df["rawAttentionScore_recomputed"] - df["conflictPenalty_recomputed"],
        0,
        100,
    )
    return df


def _row_conflict_penalty(row: pd.Series) -> float:
    modalities = [
        ("blink", float(row.get("blinkScore", 0) or 0), float(row.get("blinkConfidence", 0) or 0)),
        ("head", float(row.get("headScore", 0) or 0), float(row.get("headConfidence", 0) or 0)),
        ("gaze", float(row.get("gazeScore", 0) or 0), float(row.get("gazeConfidence", 0) or 0)),
    ]
    penalty = 0.0
    for idx in range(len(modalities)):
        for jdx in range(idx + 1, len(modalities)):
            _, score_a, confidence_a = modalities[idx]
            _, score_b, confidence_b = modalities[jdx]
            confidence = min(confidence_a, confidence_b)
            if confidence < 45:
                continue
            gap = abs(score_a - score_b)
            if gap < 45:
                continue
            confidence_scale = (confidence - 45) / (100 - 45)
            gap_scale = (gap - 45) / (100 - 45)
            penalty += 12 * confidence_scale * gap_scale
    return float(np.clip(penalty, 0, 20))


def numeric_columns_present(df: pd.DataFrame) -> list[str]:
    return [column for column in SAMPLE_NUMERIC_COLUMNS if column in df.columns]


def categorical_columns_present(df: pd.DataFrame) -> list[str]:
    return [column for column in SAMPLE_CATEGORICAL_COLUMNS if column in df.columns]


def confidence_interval(series: Iterable[float], confidence: float = 0.95) -> tuple[float, float]:
    from scipy import stats

    clean = pd.Series(series, dtype="float64").dropna()
    if clean.empty:
        return (np.nan, np.nan)
    if len(clean) == 1:
        value = float(clean.iloc[0])
        return (value, value)
    mean = float(clean.mean())
    sem = float(stats.sem(clean, nan_policy="omit"))
    interval = stats.t.interval(confidence, len(clean) - 1, loc=mean, scale=sem)
    return float(interval[0]), float(interval[1])


def save_csv(df: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)


def save_text(text: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def sample_signature(df: pd.DataFrame) -> tuple | None:
    if df.empty or "timestamp" not in df.columns:
        return None
    timestamps = df["timestamp"].astype(str)
    columns = tuple(df.columns)
    return (
        columns,
        int(len(df)),
        timestamps.iloc[0],
        timestamps.iloc[-1],
    )


def _elapsed_seconds(series: pd.Series) -> pd.Series:
    if series.isna().all():
        return pd.Series(np.zeros(len(series)), index=series.index)
    first = series.dropna().iloc[0]
    return (series - first).dt.total_seconds().fillna(0)
