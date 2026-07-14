from __future__ import annotations

import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from common import (
    OUTPUT_DIRS,
    ensure_output_dirs,
    load_exports,
    numeric_columns_present,
)


def run(root: Path | None = None) -> None:
    ensure_output_dirs()
    _clear_stale_figure_outputs()
    samples, summaries, _metadata = load_exports(root)
    if samples.empty:
        _save_placeholder("no_data_available.png", "No exported session CSV/JSON files were found.")
        return

    placeholder = OUTPUT_DIRS["figures"] / "no_data_available.png"
    if placeholder.exists():
        placeholder.unlink()

    _plot_attention_timeline(samples)
    _plot_module_scores_timeline(samples)
    _plot_blink_timeline(samples)
    _plot_fatigue_progression(samples)
    _plot_attention_drift(samples)
    _plot_gaze_distribution(samples)
    _plot_head_direction_distribution(samples)
    _plot_attention_state_distribution(samples)
    _plot_head_pose_histograms(samples)
    _plot_gaze_score_histogram(samples)
    _plot_fusion_contributions(samples)
    _plot_confidence_timeline(samples)
    _plot_correlation_heatmap(samples)
    _plot_attention_scatters(samples)
    _plot_attention_state_boxplots(samples)
    _plot_attention_state_violins(samples)
    _plot_numeric_histograms(samples)
    _plot_trend_curves(samples)
    _plot_calibration_proxies(samples)
    _plot_participant_mean_comparison(samples)
    _plot_participant_state_comparison(samples)
    _plot_direction_crosstab(samples)
    _plot_head_score_timeline(samples)
    _plot_gaze_score_timeline(samples)
    _plot_bpm_timeline(samples)
    _plot_ibi_timeline(samples)
    _plot_fusion_confidence_timeline(samples)
    if not summaries.empty:
        _plot_summary_attention_bars(summaries)
        _plot_session_summary_bars(summaries)


def _plot_attention_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    for dataset_id, group in df.groupby("dataset_id"):
        ax.plot(group["elapsed_seconds"], group["finalAttentionScore"], marker="o", linewidth=1.5, label=dataset_id)
    ax.set_title("Figure 1. Attention Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Final Attention Score")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_01_attention_timeline.png")


def _plot_module_scores_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 5))
    grouped = df.groupby("elapsed_seconds")[["blinkScore", "headScore", "gazeScore"]].mean(numeric_only=True)
    for column in ["blinkScore", "headScore", "gazeScore"]:
        if column in grouped.columns:
            ax.plot(grouped.index, grouped[column], linewidth=2, label=column)
    ax.set_title("Figure 2. Module Score Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Module Score")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_02_module_score_timeline.png")


def _plot_blink_timeline(df: pd.DataFrame) -> None:
    fig, ax1 = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")[["bpm", "blinkScore"]].mean(numeric_only=True)
    ax1.plot(grouped.index, grouped["bpm"], color="tab:blue", label="bpm")
    ax1.set_xlabel("Elapsed Seconds")
    ax1.set_ylabel("BPM", color="tab:blue")
    ax1.tick_params(axis="y", labelcolor="tab:blue")
    ax2 = ax1.twinx()
    ax2.plot(grouped.index, grouped["blinkScore"], color="tab:orange", label="blinkScore")
    ax2.set_ylabel("Blink Score", color="tab:orange")
    ax2.tick_params(axis="y", labelcolor="tab:orange")
    ax1.set_title("Figure 3. Blink Timeline")
    ax1.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_03_blink_timeline.png")


def _plot_fatigue_progression(df: pd.DataFrame) -> None:
    fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
    grouped = df.groupby("elapsed_seconds")[["fatigueScore", "ibiMean", "blinkVariability"]].mean(numeric_only=True)
    grouped["fatigueScore"].plot(ax=axes[0], color="tab:red", title="Figure 4. Fatigue Progression")
    axes[0].set_ylabel("Fatigue Score")
    grouped["ibiMean"].plot(ax=axes[1], color="tab:green")
    axes[1].set_ylabel("IBI Mean")
    grouped["blinkVariability"].plot(ax=axes[2], color="tab:purple")
    axes[2].set_ylabel("Blink Variability")
    axes[2].set_xlabel("Elapsed Seconds")
    for axis in axes:
        axis.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_04_fatigue_progression.png")


def _plot_attention_drift(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")["attentionDriftScore"].mean()
    ax.plot(grouped.index, grouped.values, color="tab:brown", linewidth=2)
    ax.set_title("Figure 5. Attention Drift Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Attention Drift Score")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_05_attention_drift_timeline.png")


def _plot_gaze_distribution(df: pd.DataFrame) -> None:
    counts = df["gazeDirection"].replace("", "Missing").value_counts().sort_index()
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(counts.index, counts.values, color="tab:cyan")
    ax.set_title("Figure 6. Gaze Direction Distribution")
    ax.set_xlabel("Gaze Direction")
    ax.set_ylabel("Count")
    ax.grid(True, axis="y", alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_06_gaze_direction_distribution.png")


def _plot_head_direction_distribution(df: pd.DataFrame) -> None:
    counts = df["headDirection"].replace("", "Missing").value_counts().sort_index()
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(counts.index, counts.values, color="tab:olive")
    ax.set_title("Figure 7. Head Direction Distribution")
    ax.set_xlabel("Head Direction")
    ax.set_ylabel("Count")
    ax.grid(True, axis="y", alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_07_head_direction_distribution.png")


def _plot_attention_state_distribution(df: pd.DataFrame) -> None:
    counts = df["attentionState"].replace("", "Missing").value_counts().sort_index()
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(counts.index, counts.values, color="tab:green")
    ax.set_title("Figure 8. Attention State Distribution")
    ax.set_xlabel("Attention State")
    ax.set_ylabel("Count")
    ax.grid(True, axis="y", alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_08_attention_state_distribution.png")


def _plot_head_pose_histograms(df: pd.DataFrame) -> None:
    fig, axes = plt.subplots(1, 3, figsize=(14, 4))
    for axis, column in zip(axes, ["pitch", "yaw", "roll"]):
        axis.hist(df[column].dropna(), bins=20, color="tab:blue", alpha=0.8)
        axis.set_title(column)
        axis.set_xlabel("Degrees")
        axis.set_ylabel("Count")
        axis.grid(True, alpha=0.3)
    fig.suptitle("Figure 9. Head Pose Angle Histograms")
    _save(fig, OUTPUT_DIRS["figures"] / "figure_09_head_pose_angle_histograms.png")


def _plot_gaze_score_histogram(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.hist(df["gazeScore"].dropna(), bins=20, color="tab:orange", alpha=0.8)
    ax.set_title("Figure 10. Gaze Score Histogram")
    ax.set_xlabel("Gaze Score")
    ax.set_ylabel("Count")
    ax.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_10_gaze_score_histogram.png")


def _plot_fusion_contributions(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 5))
    grouped = df.groupby("elapsed_seconds")[
        [
            "blinkContribution_recomputed",
            "headContribution_recomputed",
            "gazeContribution_recomputed",
        ]
    ].mean(numeric_only=True)
    ax.stackplot(
        grouped.index,
        grouped["blinkContribution_recomputed"],
        grouped["headContribution_recomputed"],
        grouped["gazeContribution_recomputed"],
        labels=["blink", "head", "gaze"],
        alpha=0.8,
    )
    ax.set_title("Figure 11. Fusion Contribution Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Weighted Contribution")
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_11_fusion_contribution_timeline.png")


def _plot_confidence_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 5))
    grouped = df.groupby("elapsed_seconds")[
        ["blinkConfidence", "headConfidence", "gazeConfidence", "fusionConfidence"]
    ].mean(numeric_only=True)
    for column in grouped.columns:
        ax.plot(grouped.index, grouped[column], linewidth=2, label=column)
    ax.set_title("Figure 12. Confidence Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Confidence")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_12_confidence_timeline.png")


def _plot_correlation_heatmap(df: pd.DataFrame) -> None:
    numeric = numeric_columns_present(df)
    corr = df[numeric].corr(numeric_only=True)
    fig, ax = plt.subplots(figsize=(12, 10))
    image = ax.imshow(corr.values, cmap="coolwarm", vmin=-1, vmax=1)
    ax.set_xticks(range(len(corr.columns)))
    ax.set_xticklabels(corr.columns, rotation=90)
    ax.set_yticks(range(len(corr.index)))
    ax.set_yticklabels(corr.index)
    ax.set_title("Figure 13. Correlation Heatmap")
    fig.colorbar(image, ax=ax, fraction=0.046, pad=0.04)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_13_correlation_heatmap.png")


def _plot_attention_scatters(df: pd.DataFrame) -> None:
    pairs = [
        ("blinkScore", "finalAttentionScore", "figure_14_attention_vs_blink_scatter.png", "Figure 14. Attention vs Blink Score"),
        ("headScore", "finalAttentionScore", "figure_15_attention_vs_head_scatter.png", "Figure 15. Attention vs Head Score"),
        ("gazeScore", "finalAttentionScore", "figure_16_attention_vs_gaze_scatter.png", "Figure 16. Attention vs Gaze Score"),
        ("fatigueScore", "finalAttentionScore", "figure_17_fatigue_vs_attention_scatter.png", "Figure 17. Fatigue vs Attention Score"),
    ]
    for x_col, y_col, filename, title in pairs:
        fig, ax = plt.subplots(figsize=(6, 5))
        ax.scatter(df[x_col], df[y_col], alpha=0.7, s=25)
        ax.set_title(title)
        ax.set_xlabel(x_col)
        ax.set_ylabel(y_col)
        ax.grid(True, alpha=0.3)
        _save(fig, OUTPUT_DIRS["figures"] / filename)


def _plot_attention_state_boxplots(df: pd.DataFrame) -> None:
    columns = ["bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "finalAttentionScore"]
    states = [state for state in ["Low", "Medium", "High"] if state in set(df["attentionState"])]
    fig, axes = plt.subplots(2, 3, figsize=(14, 8))
    for axis, column in zip(axes.ravel(), columns):
        groups = [df.loc[df["attentionState"] == state, column].dropna().values for state in states]
        groups = [group for group in groups if len(group) > 0]
        labels = [state for state in states if not df.loc[df["attentionState"] == state, column].dropna().empty]
        if groups:
            axis.boxplot(groups, labels=labels)
        axis.set_title(column)
        axis.grid(True, axis="y", alpha=0.3)
    fig.suptitle("Figure 18. Attention State Boxplots")
    _save(fig, OUTPUT_DIRS["figures"] / "figure_18_attention_state_boxplots.png")


def _plot_attention_state_violins(df: pd.DataFrame) -> None:
    columns = ["bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "finalAttentionScore"]
    states = [state for state in ["Low", "Medium", "High"] if state in set(df["attentionState"])]
    fig, axes = plt.subplots(2, 3, figsize=(14, 8))
    for axis, column in zip(axes.ravel(), columns):
        groups = [df.loc[df["attentionState"] == state, column].dropna().values for state in states]
        labels = [state for state in states if not df.loc[df["attentionState"] == state, column].dropna().empty]
        groups = [group for group in groups if len(group) > 0]
        if groups:
            axis.violinplot(groups, showmeans=True, showmedians=True)
            axis.set_xticks(range(1, len(labels) + 1))
            axis.set_xticklabels(labels)
        axis.set_title(column)
        axis.grid(True, axis="y", alpha=0.3)
    fig.suptitle("Figure 19. Attention State Violin Plots")
    _save(fig, OUTPUT_DIRS["figures"] / "figure_19_attention_state_violins.png")


def _plot_numeric_histograms(df: pd.DataFrame) -> None:
    columns = numeric_columns_present(df)
    n_cols = 3
    n_rows = math.ceil(len(columns) / n_cols)
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 4 * n_rows))
    axes = np.atleast_1d(axes).ravel()
    for axis, column in zip(axes, columns):
        axis.hist(df[column].dropna(), bins=20, alpha=0.8)
        axis.set_title(column)
        axis.grid(True, alpha=0.3)
    for axis in axes[len(columns):]:
        axis.axis("off")
    fig.suptitle("Figure 20. Numeric Histograms Grid")
    _save(fig, OUTPUT_DIRS["figures"] / "figure_20_numeric_histograms_grid.png")


def _plot_trend_curves(df: pd.DataFrame) -> None:
    columns = ["finalAttentionScore", "bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore"]
    fig, axes = plt.subplots(3, 2, figsize=(14, 10), sharex=True)
    ordered = df.sort_values(["dataset_id", "elapsed_seconds"]).copy()
    ordered["global_index"] = np.arange(len(ordered))
    for axis, column in zip(axes.ravel(), columns):
        trend = ordered[column].rolling(window=5, min_periods=1).mean()
        axis.plot(ordered["global_index"], trend, linewidth=2)
        axis.set_title(column)
        axis.grid(True, alpha=0.3)
    fig.suptitle("Figure 21. Trend Curve Grid")
    _save(fig, OUTPUT_DIRS["figures"] / "figure_21_trend_curve_grid.png")


def _plot_calibration_proxies(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")[["gazeConfidence", "headConfidence", "fusionConfidence"]].mean(numeric_only=True)
    for column in grouped.columns:
        ax.plot(grouped.index, grouped[column], linewidth=2, label=column)
    ax.set_title("Figure 22. Calibration Quality Proxy Plot")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Confidence Proxy")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_22_calibration_quality_proxy_plot.png")


def _plot_participant_mean_comparison(df: pd.DataFrame) -> None:
    summary = df.groupby("participant_id")[["finalAttentionScore", "blinkScore", "headScore", "gazeScore"]].mean(numeric_only=True)
    fig, ax = plt.subplots(figsize=(12, 5))
    width = 0.2
    x = np.arange(len(summary.index))
    for offset, column in zip([-1.5, -0.5, 0.5, 1.5], summary.columns):
        ax.bar(x + offset * width, summary[column], width=width, label=column)
    ax.set_xticks(x)
    ax.set_xticklabels(summary.index, rotation=45, ha="right")
    ax.set_title("Figure 23. Participant Mean Comparison")
    ax.set_ylabel("Mean Score")
    ax.grid(True, axis="y", alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_23_participant_mean_comparison.png")


def _plot_participant_state_comparison(df: pd.DataFrame) -> None:
    crosstab = pd.crosstab(df["participant_id"], df["attentionState"], normalize="index") * 100
    fig, ax = plt.subplots(figsize=(12, 5))
    bottom = np.zeros(len(crosstab))
    x = np.arange(len(crosstab.index))
    for column in crosstab.columns:
        ax.bar(x, crosstab[column], bottom=bottom, label=column)
        bottom += crosstab[column].values
    ax.set_title("Figure 24. Participant State Comparison")
    ax.set_ylabel("Percentage")
    ax.set_xticks(x)
    ax.set_xticklabels(crosstab.index, rotation=45, ha="right")
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_24_participant_state_comparison.png")


def _plot_direction_crosstab(df: pd.DataFrame) -> None:
    table = pd.crosstab(df["headDirection"].replace("", "Missing"), df["gazeDirection"].replace("", "Missing"))
    fig, ax = plt.subplots(figsize=(8, 6))
    image = ax.imshow(table.values, cmap="Blues")
    ax.set_xticks(range(len(table.columns)))
    ax.set_xticklabels(table.columns, rotation=45, ha="right")
    ax.set_yticks(range(len(table.index)))
    ax.set_yticklabels(table.index)
    ax.set_title("Figure 25. Head Direction x Gaze Direction Crosstab")
    for i in range(table.shape[0]):
        for j in range(table.shape[1]):
            ax.text(j, i, int(table.iloc[i, j]), ha="center", va="center", color="black")
    fig.colorbar(image, ax=ax, fraction=0.046, pad=0.04)
    _save(fig, OUTPUT_DIRS["figures"] / "figure_25_direction_crosstab_heatmap.png")


def _plot_summary_attention_bars(summaries: pd.DataFrame) -> None:
    required = {"dataset_id", "averageAttentionScore", "averageBlinkScore", "averageHeadScore", "averageGazeScore"}
    if not required.issubset(set(summaries.columns)):
        return
    fig, ax = plt.subplots(figsize=(12, 5))
    summary = summaries.set_index("dataset_id")[["averageAttentionScore", "averageBlinkScore", "averageHeadScore", "averageGazeScore"]]
    x = np.arange(len(summary.index))
    width = 0.2
    for offset, column in zip([-1.5, -0.5, 0.5, 1.5], summary.columns):
        ax.bar(x + offset * width, summary[column], width=width, label=column)
    ax.set_xticks(x)
    ax.set_xticklabels(summary.index, rotation=45, ha="right")
    ax.set_title("Summary-Level Attention Comparison")
    ax.set_ylabel("Score")
    ax.grid(True, axis="y", alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "summary_level_attention_comparison.png")


def _plot_head_score_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")["headScore"].mean()
    ax.plot(grouped.index, grouped.values, linewidth=2, color="tab:blue")
    ax.set_title("Head Score Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Head Score")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "head_score_timeline.png")


def _plot_gaze_score_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")["gazeScore"].mean()
    ax.plot(grouped.index, grouped.values, linewidth=2, color="tab:orange")
    ax.set_title("Gaze Score Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Gaze Score")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "gaze_score_timeline.png")


def _plot_bpm_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")["bpm"].mean()
    ax.plot(grouped.index, grouped.values, linewidth=2, color="tab:green")
    ax.set_title("BPM Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("BPM")
    ax.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "bpm_timeline.png")


def _plot_ibi_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")[["ibiMean", "ibiStd"]].mean(numeric_only=True)
    ax.plot(grouped.index, grouped["ibiMean"], linewidth=2, color="tab:red", label="ibiMean")
    ax.plot(grouped.index, grouped["ibiStd"], linewidth=2, color="tab:purple", label="ibiStd")
    ax.set_title("IBI Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Milliseconds")
    ax.grid(True, alpha=0.3)
    _legend(ax)
    _save(fig, OUTPUT_DIRS["figures"] / "ibi_timeline.png")


def _plot_fusion_confidence_timeline(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 4))
    grouped = df.groupby("elapsed_seconds")["fusionConfidence"].mean()
    ax.plot(grouped.index, grouped.values, linewidth=2, color="tab:brown")
    ax.set_title("Fusion Confidence Timeline")
    ax.set_xlabel("Elapsed Seconds")
    ax.set_ylabel("Fusion Confidence")
    ax.set_ylim(0, 100)
    ax.grid(True, alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "fusion_confidence_timeline.png")


def _plot_session_summary_bars(summaries: pd.DataFrame) -> None:
    required = {"dataset_id", "averageAttentionScore", "averageBlinkScore", "averageHeadScore", "averageGazeScore", "averageFatigueScore", "averageBPM"}
    if not required.issubset(set(summaries.columns)):
        return
    fig, ax = plt.subplots(figsize=(12, 5))
    summary = summaries.set_index("dataset_id")[
        ["averageAttentionScore", "averageBlinkScore", "averageHeadScore", "averageGazeScore", "averageFatigueScore", "averageBPM"]
    ]
    x = np.arange(len(summary.columns))
    values = summary.iloc[0].values if len(summary.index) == 1 else summary.mean(axis=0).values
    ax.bar(x, values, color="tab:cyan")
    ax.set_xticks(x)
    ax.set_xticklabels(summary.columns, rotation=45, ha="right")
    ax.set_title("Session Summary Metrics")
    ax.set_ylabel("Value")
    ax.grid(True, axis="y", alpha=0.3)
    _save(fig, OUTPUT_DIRS["figures"] / "session_summary_metrics.png")


def _clear_stale_figure_outputs() -> None:
    # Keep each run self-contained by removing previously generated PNG outputs.
    for key in ["figures", "participants", "correlations"]:
        for path in OUTPUT_DIRS[key].glob("*.png"):
            path.unlink()


def _save(fig: plt.Figure, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(path, dpi=200, bbox_inches="tight")
    plt.close(fig)


def _save_placeholder(filename: str, message: str) -> None:
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.text(0.5, 0.5, message, ha="center", va="center")
    ax.axis("off")
    _save(fig, OUTPUT_DIRS["figures"] / filename)


def _legend(ax: plt.Axes) -> None:
    handles, labels = ax.get_legend_handles_labels()
    if labels:
        ax.legend()


if __name__ == "__main__":
    run()
