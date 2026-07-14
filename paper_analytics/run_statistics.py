from __future__ import annotations

import math
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats
from statsmodels.formula.api import ols
from statsmodels.stats.anova import anova_lm

from common import (
    OUTPUT_DIRS,
    confidence_interval,
    ensure_output_dirs,
    load_exports,
    numeric_columns_present,
    save_csv,
    save_text,
)


def run(root: Path | None = None) -> None:
    ensure_output_dirs()
    samples, _summaries, _metadata = load_exports(root)
    if samples.empty:
        save_text("No exported session data found.\n", OUTPUT_DIRS["statistics"] / "analysis_summary.txt")
        return

    numeric = numeric_columns_present(samples)
    pearson_df, spearman_df = _correlations(samples, numeric)
    save_csv(pearson_df, OUTPUT_DIRS["correlations"] / "pearson_correlations.csv")
    save_csv(spearman_df, OUTPUT_DIRS["correlations"] / "spearman_correlations.csv")

    t_test_df = _t_tests(samples)
    anova_df = _anova_tests(samples)
    mann_whitney_df = _mann_whitney_tests(samples)
    kruskal_df = _kruskal_tests(samples)
    chi_square_df = _chi_square_tests(samples)
    effect_size_df = _effect_sizes(samples)
    ci_df = _confidence_intervals(samples)

    save_csv(t_test_df, OUTPUT_DIRS["statistics"] / "t_tests.csv")
    save_csv(anova_df, OUTPUT_DIRS["statistics"] / "anova_tests.csv")
    save_csv(mann_whitney_df, OUTPUT_DIRS["statistics"] / "mann_whitney_tests.csv")
    save_csv(kruskal_df, OUTPUT_DIRS["statistics"] / "kruskal_wallis_tests.csv")
    save_csv(chi_square_df, OUTPUT_DIRS["statistics"] / "chi_square_tests.csv")
    save_csv(effect_size_df, OUTPUT_DIRS["statistics"] / "cohens_d_effect_sizes.csv")
    save_csv(ci_df, OUTPUT_DIRS["statistics"] / "confidence_intervals.csv")

    summary = [
        "Statistical Analysis Package",
        f"Rows analyzed: {len(samples)}",
        f"Numeric columns analyzed: {', '.join(numeric)}",
        f"Pearson tests: {len(pearson_df)}",
        f"Spearman tests: {len(spearman_df)}",
        f"t-tests: {len(t_test_df)}",
        f"ANOVA tests: {len(anova_df)}",
        f"Mann-Whitney tests: {len(mann_whitney_df)}",
        f"Kruskal-Wallis tests: {len(kruskal_df)}",
        f"Chi-square tests: {len(chi_square_df)}",
        f"Effect size rows: {len(effect_size_df)}",
        f"Confidence interval rows: {len(ci_df)}",
    ]
    save_text("\n".join(summary) + "\n", OUTPUT_DIRS["statistics"] / "analysis_summary.txt")


def _correlations(samples: pd.DataFrame, numeric: list[str]) -> tuple[pd.DataFrame, pd.DataFrame]:
    pearson_rows = []
    spearman_rows = []
    for i, left in enumerate(numeric):
        for right in numeric[i + 1:]:
            pair = samples[[left, right]].dropna()
            if len(pair) < 3:
                continue
            if pair[left].nunique() < 2 or pair[right].nunique() < 2:
                continue
            pearson_stat, pearson_p = stats.pearsonr(pair[left], pair[right])
            spearman_stat, spearman_p = stats.spearmanr(pair[left], pair[right])
            pearson_rows.append(
                {
                    "test": "Pearson",
                    "x": left,
                    "y": right,
                    "n": int(len(pair)),
                    "statistic": float(pearson_stat),
                    "p_value": float(pearson_p),
                    "null_hypothesis": "H0: Pearson r = 0",
                    "alternative_hypothesis": "H1: Pearson r != 0",
                    "interpretation": _p_interpretation(pearson_p),
                }
            )
            spearman_rows.append(
                {
                    "test": "Spearman",
                    "x": left,
                    "y": right,
                    "n": int(len(pair)),
                    "statistic": float(spearman_stat),
                    "p_value": float(spearman_p),
                    "null_hypothesis": "H0: Spearman rho = 0",
                    "alternative_hypothesis": "H1: Spearman rho != 0",
                    "interpretation": _p_interpretation(spearman_p),
                }
            )
    return pd.DataFrame(pearson_rows), pd.DataFrame(spearman_rows)


def _t_tests(samples: pd.DataFrame) -> pd.DataFrame:
    variables = ["bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "fusionConfidence"]
    rows = []
    high = samples.loc[samples["attentionState"] == "High"]
    low = samples.loc[samples["attentionState"] == "Low"]
    for variable in variables:
        pair = pd.concat([high[[variable]], low[[variable]]], axis=1)
        high_values = high[variable].dropna()
        low_values = low[variable].dropna()
        if len(high_values) < 2 or len(low_values) < 2:
            continue
        statistic, p_value = stats.ttest_ind(high_values, low_values, equal_var=False, nan_policy="omit")
        rows.append(
            {
                "test": "Welch t-test",
                "group_a": "High",
                "group_b": "Low",
                "variable": variable,
                "n_a": int(len(high_values)),
                "n_b": int(len(low_values)),
                "statistic": float(statistic),
                "p_value": float(p_value),
                "null_hypothesis": f"H0: mean({variable}|High) = mean({variable}|Low)",
                "alternative_hypothesis": f"H1: mean({variable}|High) != mean({variable}|Low)",
                "interpretation": _p_interpretation(p_value),
            }
        )
    return pd.DataFrame(rows)


def _anova_tests(samples: pd.DataFrame) -> pd.DataFrame:
    variables = ["bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "fusionConfidence"]
    rows = []
    valid_states = samples["attentionState"].isin(["High", "Medium", "Low"])
    data = samples.loc[valid_states].copy()
    for variable in variables:
        subset = data[["attentionState", variable]].dropna()
        if subset["attentionState"].nunique() < 3:
            continue
        model = ols(f"{variable} ~ C(attentionState)", data=subset).fit()
        table = anova_lm(model, typ=2)
        if "C(attentionState)" not in table.index:
            continue
        row = table.loc["C(attentionState)"]
        p_value = float(row["PR(>F)"])
        rows.append(
            {
                "test": "One-way ANOVA",
                "grouping": "attentionState",
                "variable": variable,
                "df": float(row["df"]),
                "f_statistic": float(row["F"]),
                "p_value": p_value,
                "null_hypothesis": f"H0: mean({variable}) equal across attentionState groups",
                "alternative_hypothesis": f"H1: at least one attentionState mean for {variable} differs",
                "interpretation": _p_interpretation(p_value),
            }
        )
    return pd.DataFrame(rows)


def _mann_whitney_tests(samples: pd.DataFrame) -> pd.DataFrame:
    variables = ["bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore"]
    rows = []
    high = samples.loc[samples["attentionState"] == "High"]
    low = samples.loc[samples["attentionState"] == "Low"]
    for variable in variables:
        high_values = high[variable].dropna()
        low_values = low[variable].dropna()
        if len(high_values) < 2 or len(low_values) < 2:
            continue
        statistic, p_value = stats.mannwhitneyu(high_values, low_values, alternative="two-sided")
        rows.append(
            {
                "test": "Mann-Whitney U",
                "group_a": "High",
                "group_b": "Low",
                "variable": variable,
                "statistic": float(statistic),
                "p_value": float(p_value),
                "null_hypothesis": f"H0: distribution({variable}|High) = distribution({variable}|Low)",
                "alternative_hypothesis": f"H1: distributions for {variable} differ",
                "interpretation": _p_interpretation(p_value),
            }
        )
    return pd.DataFrame(rows)


def _kruskal_tests(samples: pd.DataFrame) -> pd.DataFrame:
    variables = ["bpm", "fatigueScore", "blinkScore", "headScore", "gazeScore", "fusionConfidence"]
    rows = []
    for variable in variables:
        groups = []
        labels = []
        for state in ["Low", "Medium", "High"]:
            values = samples.loc[samples["attentionState"] == state, variable].dropna()
            if len(values) >= 2:
                groups.append(values)
                labels.append(state)
        if len(groups) < 3:
            continue
        statistic, p_value = stats.kruskal(*groups)
        rows.append(
            {
                "test": "Kruskal-Wallis",
                "grouping": "attentionState",
                "groups": ",".join(labels),
                "variable": variable,
                "statistic": float(statistic),
                "p_value": float(p_value),
                "null_hypothesis": f"H0: all attentionState distributions for {variable} are equal",
                "alternative_hypothesis": f"H1: at least one attentionState distribution for {variable} differs",
                "interpretation": _p_interpretation(p_value),
            }
        )
    return pd.DataFrame(rows)


def _chi_square_tests(samples: pd.DataFrame) -> pd.DataFrame:
    pairs = [
        ("attentionState", "gazeDirection"),
        ("attentionState", "headDirection"),
        ("headDirection", "gazeDirection"),
        ("attentionDriftTrend", "attentionState"),
    ]
    rows = []
    for left, right in pairs:
        table = pd.crosstab(samples[left].replace("", "Missing"), samples[right].replace("", "Missing"))
        if table.empty or table.shape[0] < 2 or table.shape[1] < 2:
            continue
        statistic, p_value, dof, _expected = stats.chi2_contingency(table)
        rows.append(
            {
                "test": "Chi-square",
                "x": left,
                "y": right,
                "statistic": float(statistic),
                "degrees_of_freedom": int(dof),
                "p_value": float(p_value),
                "null_hypothesis": f"H0: {left} and {right} are independent",
                "alternative_hypothesis": f"H1: {left} and {right} are associated",
                "interpretation": _p_interpretation(p_value),
            }
        )
    return pd.DataFrame(rows)


def _effect_sizes(samples: pd.DataFrame) -> pd.DataFrame:
    variables = ["fatigueScore", "blinkScore", "headScore", "gazeScore", "bpm"]
    rows = []
    high = samples.loc[samples["attentionState"] == "High"]
    low = samples.loc[samples["attentionState"] == "Low"]
    for variable in variables:
        high_values = high[variable].dropna()
        low_values = low[variable].dropna()
        if len(high_values) < 2 or len(low_values) < 2:
            continue
        effect = _cohens_d(high_values.to_numpy(), low_values.to_numpy())
        rows.append(
            {
                "effect_size": "Cohen's d",
                "group_a": "High",
                "group_b": "Low",
                "variable": variable,
                "value": effect,
                "interpretation": _cohens_d_label(effect),
            }
        )
    return pd.DataFrame(rows)


def _confidence_intervals(samples: pd.DataFrame) -> pd.DataFrame:
    rows = []
    metrics = ["finalAttentionScore", "blinkScore", "headScore", "gazeScore", "fatigueScore", "bpm", "fusionConfidence"]
    for metric in metrics:
        values = samples[metric].dropna()
        if values.empty:
            continue
        ci_low, ci_high = confidence_interval(values)
        rows.append(
            {
                "grouping": "overall",
                "group": "all_samples",
                "metric": metric,
                "n": int(len(values)),
                "mean": float(values.mean()),
                "ci_low": ci_low,
                "ci_high": ci_high,
            }
        )
    return pd.DataFrame(rows)


def _cohens_d(group_a: np.ndarray, group_b: np.ndarray) -> float:
    mean_a = float(np.mean(group_a))
    mean_b = float(np.mean(group_b))
    sd_a = float(np.std(group_a, ddof=1))
    sd_b = float(np.std(group_b, ddof=1))
    n_a = len(group_a)
    n_b = len(group_b)
    pooled_sd = math.sqrt((((n_a - 1) * sd_a**2) + ((n_b - 1) * sd_b**2)) / (n_a + n_b - 2))
    if pooled_sd == 0:
        return 0.0
    return (mean_a - mean_b) / pooled_sd


def _cohens_d_label(value: float) -> str:
    absolute = abs(value)
    if absolute < 0.2:
        return "negligible"
    if absolute < 0.5:
        return "small"
    if absolute < 0.8:
        return "medium"
    return "large"


def _p_interpretation(p_value: float) -> str:
    return "reject H0 at alpha=0.05" if p_value < 0.05 else "fail to reject H0 at alpha=0.05"


if __name__ == "__main__":
    run()
