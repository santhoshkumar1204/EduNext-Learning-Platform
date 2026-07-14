# Personalized Blink Analytics Framework - Technical Report

## Previous Implementation

The earlier analytics layer extended blink counting with rolling means for baseline EAR, BPM, IBI, and blink duration. Fatigue was estimated with manually weighted ratios, and attention drift was computed as the inverse of fatigue. This proved that the data pipeline was live, but the mathematics were prototype quality because means are sensitive to outliers, fixed weights are not user-specific, and a direct `100 - fatigue` drift score cannot distinguish short-term noise from sustained attention change.

## New Implementation

The framework now builds a robust personalized blink profile from per-user observations. EAR, BPM, IBI, and blink duration baselines are represented by median and Median Absolute Deviation (MAD), then exposed with confidence scores. Fatigue is estimated from personalized robust z-scores instead of fixed component weights. Attention drift is derived from multi-window trend analysis over attention score history.

## Mathematical Formulas

For a metric sample set `X = {x1, x2, ..., xn}`:

```text
median(X) = 50th percentile of X
MAD(X) = median(|xi - median(X)|)
robust_scale(X) = 1.4826 * MAD(X)
robust_z(x) = (x - median(X)) / robust_scale(X)
```

The factor `1.4826` makes MAD comparable to standard deviation under approximately normal observations while preserving robustness to isolated detection errors.

Baseline confidence is calculated from sample sufficiency and elapsed calibration time:

```text
confidence_metric = min(sample_count_metric / required_count_metric, 1)
profile_confidence = elapsed_confidence * mean(metric_confidences)
```

Fatigue evidence is personalized:

```text
BPM_z = robust_z(rolling_BPM)
IBI_z = robust_z(rolling_IBI)
Duration_z = robust_z(rolling_blink_duration)

fatigue_evidence = mean(max(BPM_z, 0), max(-IBI_z, 0), max(Duration_z, 0))
fatigue_score = profile_confidence * (1 - exp(-fatigue_evidence / 2)) * 100
```

The IBI sign is inverted because shorter IBI indicates more frequent blinking.

Attention trend is estimated across short, medium, and long windows:

```text
attention_score = 100 - fatigue_score * profile_confidence
slope_window = linear_regression_slope(attention_score over window)
combined_slope = 0.5 * short + 0.3 * medium + 0.2 * long
```

Trend labels are emitted only when trend confidence is sufficient:

```text
combined_slope > threshold  -> Improving
combined_slope < -threshold -> Declining
otherwise                   -> Stable
```

## Research Justification

Blink behaviour varies substantially across individuals and across tasks. Median/MAD baselines are better suited than arithmetic means because blink streams can contain detection jitter, missed blinks, reflex blinks, and short clusters. Robust z-scores measure deviation from the learner's own behavioural profile, which is more defensible than comparing against population-wide blink thresholds.

Fatigue estimation now uses directionally meaningful deviations: increased BPM, shortened IBI, and longer blink duration. Attention drift uses multiple temporal windows so short-term volatility does not dominate session-level interpretation.

## Remaining Limitations

The module remains blink-only. It does not infer head pose, gaze, emotion, or multimodal attention. The current fatigue formula is personalized and robust, but still deterministic rather than learned from labeled fatigue outcomes. MAD can be small for highly consistent calibration data, so the implementation applies metric-specific scale floors to prevent unstable z-scores. Future validation should compare fatigue scores against ground-truth task performance, subjective fatigue ratings, and longer longitudinal sessions.

## Validation Expectations

Metrics require live data:

- IBI requires at least two blinks.
- Variability is meaningful after several IBI samples.
- Burst detection requires three or more blinks within the configured burst window.
- Baseline confidence grows with sample count and elapsed calibration time.
- Fatigue and drift confidence are intentionally low during early session startup.
