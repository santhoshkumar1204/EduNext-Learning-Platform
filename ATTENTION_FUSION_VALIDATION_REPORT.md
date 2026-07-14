# Confidence-Aware Attention Fusion Validation Report

Date: 2026-06-16

## Objective

Combine blink, head, and gaze attention into a single final attention score using confidence-weighted fusion, without removing the existing standalone modules.

## Fusion Mathematics

For each modality:

- `blink_score` in `0-100`
- `head_score` in `0-100`
- `gaze_score` in `0-100`
- `blink_confidence` in `0-100`
- `head_confidence` in `0-100`
- `gaze_confidence` in `0-100`

Weights are normalized from confidence values:

`weight_i = confidence_i / (confidence_blink + confidence_head + confidence_gaze)`

Final attention score:

`final_score = Σ(weight_i × modality_score_i)`

Final attention state:

- High: `>= 70`
- Medium: `40-69.9`
- Low: `< 40`

The implementation stores:

- Blink contribution
- Head contribution
- Gaze contribution
- Confidence history
- Attention history

## Confidence Calculation

Blink confidence combines:

- baseline maturity from the personalized blink profile
- number of blink samples
- EAR stability
- landmark availability

Head confidence combines:

- landmark visibility proxy from calibration readiness
- pose stability
- tracking continuity

Gaze confidence combines:

- iris visibility proxy from the available ratio signals
- calibration completion
- ratio stability
- landmark quality proxy from calibration progress

All confidence values are clamped to `0-100`.

## Edge Cases

If all confidences are zero:

- the engine falls back to equal weights to avoid division by zero
- the score still resolves to a bounded `0-100` value

If a modality is missing:

- its score and confidence fall back to `0`
- its weight becomes `0` when the other modalities have confidence

If a modality is present but unstable:

- its confidence drops, reducing its influence

If the user has not completed gaze calibration:

- gaze confidence stays low
- gaze still contributes, but weakly

## Failure Modes

- A noisy camera feed can suppress all three confidences at once.
- Head pose and gaze remain heuristic, not geometrically solved or externally calibrated.
- Blink scoring still depends on blink-rate heuristics, not a learned attention model.
- Confidence proxies are useful for robustness, but they are not true probabilistic uncertainty estimates.
- The fusion model cannot recover when the upstream module itself is wrong in a consistent way.

## Validation Notes

This engine is suitable as a deterministic, explainable fusion layer for the current browser-only stack. It is not a learned attention model and does not use CNNs. The main validation work now needed is user testing across lighting, camera placement, glasses, and head motion to confirm that confidence reduction behaves sensibly in real sessions.
