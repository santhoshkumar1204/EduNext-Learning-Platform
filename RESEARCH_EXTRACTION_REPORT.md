# Complete Research Extraction Report

Source code audited from:
- [App.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/App.jsx)
- [main.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/main.jsx)
- [useFaceMesh.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useFaceMesh.js)
- [useBlinkStats.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useBlinkStats.js)
- [personalizedProfile.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/personalizedProfile.js)
- [blinkEvents.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/blinkEvents.js)
- [fatigue.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/fatigue.js)
- [attentionDrift.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/attentionDrift.js)
- [useHeadPose.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useHeadPose.js)
- [headPoseCalculation.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headPoseCalculation.js)
- [headDirection.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headDirection.js)
- [headAttentionMetrics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headAttentionMetrics.js)
- [useGazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useGazeTracking.js)
- [gazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeTracking.js)
- [gazeDirection.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeDirection.js)
- [gazeCalibration.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeCalibration.js)
- [gazeMetrics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeMetrics.js)
- [attentionFusion.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/attentionFusion.js)
- [useAttentionFusion.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useAttentionFusion.js)
- [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js)
- [statistics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/statistics.js)
- [validate_calibration.py](file:///c:/Users/santh/Downloads/blink-detection-main/validate_calibration.py)

Project title from [README.md](file:///c:/Users/santh/Downloads/blink-detection-main/README.md): `Blink Rate Attention Analyzer`

This report documents the current implementation only. It does not assume any unimplemented feature.

## Runtime Architecture

Runtime pipeline as implemented in [App.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/App.jsx):

1. `useFaceMesh()` acquires camera frames and MediaPipe FaceMesh landmarks.
2. `recordBlink()` receives blink events from `useFaceMesh()`.
3. `recordEye()` receives EAR samples from `useFaceMesh()`.
4. `recordFaceLandmarks()` forwards the same landmark frame to:
   - `recordHeadFrame()` from `useHeadPose()`
   - `recordGazeFrame()` from `useGazeTracking()`
5. `useBlinkStats()` computes blink analytics, personalized profile, fatigue, and attention drift.
6. `useHeadPose()` computes head pose and head attention metrics.
7. `useGazeTracking()` computes gaze ratios, quality, calibration, confidence, and gaze metrics.
8. `useAttentionFusion()` fuses blink, head, and gaze into a final attention score and state.
9. `useSessionRecorder()` inside [AttentionFusionDebugPanel.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/components/AttentionFusionDebugPanel.jsx) records session samples and exports CSV or JSON.

## Shared Statistical Primitives

Defined in [statistics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/statistics.js):

```text
clamp(value, min, max) = min(max, max(min, value))

mean(values) =
  if values.length == 0: 0
  else sum(values) / values.length

standardDeviation(values) =
  if values.length < 2: 0
  else sqrt(sum((value - mean(values))^2) / values.length)

median(values) =
  if values.length == 0: 0
  else sorted midpoint

medianAbsoluteDeviation(values) =
  if values.length < 2: 0
  else median(abs(value - median(values)))

robustScale(values) =
  medianAbsoluteDeviation(values) * 1.4826

robustSummary(values) = {
  median: median(values),
  mad: medianAbsoluteDeviation(values),
  scale: robustScale(values),
  sampleCount: values.length
}

robustZScore(value, center, scale) =
  if value, center, or scale invalid: 0
  else (value - center) / scale

coefficientOfVariation(values) =
  if mean(values) == 0: 0
  else standardDeviation(values) / mean(values)

linearSlope(points, getX, getY) =
  if points.length < 2: 0
  else sum((x - avgX) * (y - avgY)) / sum((x - avgX)^2)

pruneByTime(items, now, windowMs) =
  items where now - getTime(item) <= windowMs
```

## PART 1 - Formula Extraction

### 1. Blink Analytics

Files:
- [useFaceMesh.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useFaceMesh.js)
- [useBlinkStats.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useBlinkStats.js)
- [blinkEvents.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/blinkEvents.js)

Constants:

```text
DEFAULT_EAR_THRESHOLD = 0.21
SMOOTH_WINDOW = 3
NO_FACE_TIMEOUT = 3000 ms
MIN_BLINK_MS = 40 ms

ROLLING_WINDOW_MS = 60000 ms
TICK_MS = 5000 ms
BPM_HISTORY_MS = 120000 ms
MAX_TIMELINE = 240

IBI_ROLLING_WINDOW_MS = 300000 ms
BURST_WINDOW_MS = 2500 ms
BURST_MIN_BLINKS = 3
```

Exact formulas:

```text
dist(a, b) = sqrt((a.x - b.x)^2 + (a.y - b.y)^2)

eyeEAR(landmarks, idx, w, h) =
  vertical / (2 * horizontal)

where
  p = idx.map(i => { x: landmarks[i].x * w, y: landmarks[i].y * h })
  vertical = dist(p[1], p[5]) + dist(p[2], p[4])
  horizontal = dist(p[0], p[3])

rawEAR =
  (eyeEAR(leftEye) + eyeEAR(rightEye)) / 2

smoothEAR =
  sum(last <= 3 raw EAR samples) / sampleCount

dynamicThreshold =
  0.21
  if baselineHistory.length < 100

dynamicThreshold =
  median(baselineHistory) * 0.82
  if baselineHistory.length >= 100

baselineHistory update rule:
  append smoothEAR if smoothEAR >= 0.12
  keep last <= 300 samples

blink start rule:
  if smoothEAR < dynamicThreshold and state.closed == false:
    state.closed = true
    state.startedAt = now

blink end rule:
  if smoothEAR >= dynamicThreshold and state.closed == true:
    duration = now - state.startedAt
    count blink only if duration >= 40 ms

bpm =
  recent blink timestamps inside last 60000 ms

categorize(bpm):
  if bpm < 8: hyperfocused
  else if bpm < 15: attentive
  else if bpm < 21: neutral
  else if bpm <= 30: fatigued
  else: sleepy

duration buckets:
  short: d < 150
  medium: 150 <= d <= 300
  long: d > 300
```

Exact event formulas from [blinkEvents.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/blinkEvents.js):

```text
ibi =
  blink.t - previousBlink.t
  if previous blink exists
  else 0

burst detection cluster =
  blink events where now - event.t <= 2500 ms

burst created if cluster.length >= 3

burst = {
  t: last.t,
  start: first.t,
  end: last.t,
  blinkCount: cluster.length,
  duration: last.t - first.t
}

avgIbi = mean(intervals)
minIbi = min(intervals)
maxIbi = max(intervals)
ibiStdDev = standardDeviation(intervals)
variabilityIndex = coefficientOfVariation(intervals)

sessionMinutes =
  max(1/60, (now - firstEventTime) / 60000)

burstFrequency =
  burstCount / sessionMinutes
```

Exact session formulas from [useBlinkStats.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useBlinkStats.js):

```text
avgBpm =
  runningSumRef / runningCountRef

longestFocusStreakMs =
  longest consecutive attentive ticks * 5000

mostFrequentZone =
  argmax(count of zone keys in ticksRef)
```

State rules:

```text
hyperfocused: bpm < 8
attentive: 8 <= bpm < 15
neutral: 15 <= bpm < 21
fatigued: 21 <= bpm <= 30
sleepy: bpm > 30
```

### 2. Personalized Profile

Files:
- [personalizedProfile.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/personalizedProfile.js)

Constants:

```text
PROFILE_BOOTSTRAP_MS = 60000 ms
PROFILE_ROLLING_WINDOW_MS = 300000 ms

PROFILE_REQUIREMENTS = {
  ear: 90,
  bpm: 8,
  ibi: 5,
  blinkDuration: 5
}

MIN_RELATIVE_SCALE = {
  ear: 0.02,
  bpm: 0.1,
  ibi: 0.1,
  blinkDuration: 0.1
}
```

Exact formulas:

```text
recordEyeSample:
  keep sample if ear is finite and ear > 0
  retain <= 300000 ms window

recordProfileBlink:
  durationSamples append event.duration if event.duration > 0
  ibiSamples append event.ibi if event.ibi > 0

recordProfileTick:
  bpmSamples append bpm
  updateBaseline(store, now)

summaries = {
  ear: robustSummary(earSamples.values),
  bpm: robustSummary(bpmSamples.values),
  ibi: robustSummary(ibiSamples.values),
  blinkDuration: robustSummary(durationSamples.values)
}

for each key in summaries:
  baseline[key] = summary.median
  baseline[key + "Mad"] = summary.mad
  baseline[key + "Scale"] = scaleWithFloor(key, summary)

sampleCount =
  earSamples.length +
  bpmSamples.length +
  ibiSamples.length +
  durationSamples.length

confidenceForMetric(key, count) =
  clamp(count / PROFILE_REQUIREMENTS[key], 0, 1)

elapsedConfidence =
  clamp(elapsedMs / 60000, 0, 1)

physiologicalConfidence =
  confidenceByMetric.ear * 0.25 +
  confidenceByMetric.bpm * 0.25 +
  confidenceByMetric.ibi * 0.25 +
  confidenceByMetric.blinkDuration * 0.25

profileConfidence =
  clamp(elapsedConfidence * physiologicalConfidence, 0, 1)

ready =
  profileConfidence >= 0.75

scaleWithFloor(key, summary) =
  0
  if summary.median == 0

scaleWithFloor(key, summary) =
  max(summary.scale, abs(summary.median) * MIN_RELATIVE_SCALE[key])
  otherwise
```

### 3. Fatigue Model

Files:
- [fatigue.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/fatigue.js)

Constants:

```text
FATIGUE_WINDOW_MS = 300000 ms
FATIGUE_HISTORY_MS = 1200000 ms
```

Exact formulas:

```text
durationValues = blinkSamples.map(duration)
ibiValues = blinkSamples.map(ibi).filter(ibi > 0)
bpmAvg = mean(tickSamples.map(bpm))
durationAvg = mean(durationValues)
ibiAvg = mean(ibiValues)

bpmZ =
  robustZScore(bpmAvg, profile.bpm, profile.bpmScale)

ibiZ =
  robustZScore(ibiAvg, profile.ibi, profile.ibiScale)

blinkDurationZ =
  robustZScore(durationAvg, profile.blinkDuration, profile.blinkDurationScale)

fatigueEvidence =
  mean([
    max(0, bpmZ),
    max(0, -ibiZ),
    max(0, blinkDurationZ)
  ])

confidence =
  profile.confidence ?? 0

zEvidenceToScore(evidence) =
  0
  if evidence invalid or evidence <= 0

zEvidenceToScore(evidence) =
  clamp((1 - exp(-evidence / 2)) * 100, 0, 100)

fatigueScore =
  confidence * zEvidenceToScore(fatigueEvidence)

fatigueIndex =
  fatigueScore

fatigueConfidence =
  confidence

durationTrend =
  linearSlope(blinkSamples, t, duration) * 60000

blinkFrequencyTrend =
  linearSlope(tickSamples, t, bpm) * 60000

ibiTrend =
  linearSlope(blinkSamples where ibi > 0, t, ibi) * 60000
```

### 4. Attention Drift

Files:
- [attentionDrift.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/attentionDrift.js)

Constants:

```text
DRIFT_HISTORY_MS = 1200000 ms
SHORT_WINDOW_MS = 60000 ms
MEDIUM_WINDOW_MS = 300000 ms
LONG_WINDOW_MS = 900000 ms
STABLE_SLOPE_PER_MIN = 2
```

Exact formulas:

```text
attentionScoreFromPersonalizedState(sample) =
  clamp(100 - clamp(sample.fatigueIndex, 0, 100) * (sample.confidence ?? 0), 0, 100)

short.slope =
  linearSlope(points within last 60000 ms, t, score) * 60000

medium.slope =
  linearSlope(points within last 300000 ms, t, score) * 60000

long.slope =
  linearSlope(points within last 900000 ms, t, score) * 60000

window confidence =
  clamp(points.length / max(3, floor(windowMs / 5000)), 0, 1)

combined slope =
  short.slope * 0.5 +
  medium.slope * 0.3 +
  long.slope * 0.2

attentionTrendConfidence =
  clamp(
    short.confidence * 0.5 +
    medium.confidence * 0.3 +
    long.confidence * 0.2,
    0,
    1
  )

trendLabel =
  "Stable" by default

trendLabel = "Improving"
  if confidence >= 0.35 and slope > 2

trendLabel = "Declining"
  if confidence >= 0.35 and slope < -2

increasingFatigue =
  sample.fatigueIndex > 60 and slope < 0

stableAttention =
  trendLabel == "Stable"

decliningAttention =
  trendLabel == "Declining"
```

### 5. Head Pose

Files:
- [headPoseCalculation.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headPoseCalculation.js)
- [headDirection.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headDirection.js)

Constants:

```text
HEAD_POSE_LANDMARKS = {
  noseTip: 1,
  chin: 152,
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  leftMouthCorner: 61,
  rightMouthCorner: 291
}

RAD_TO_DEG = 180 / PI
YAW_SCALE = 42
PITCH_SCALE = 55

PITCH_THRESHOLD_DEG = 12
YAW_THRESHOLD_DEG = 14
ROLL_TILT_THRESHOLD_DEG = 15
```

Exact formulas:

```text
toPoint(landmarks, index, width, height) = {
  x: point.x * width,
  y: point.y * height,
  z: point.z * width
}

eyeMid =
  midpoint(leftEye, rightEye)

mouthMid =
  midpoint(leftMouth, rightMouth)

faceCenter =
  midpoint(eyeMid, mouthMid)

eyeDistance =
  distance(leftEye, rightEye) or 1

eyeMouthDistance =
  distance(eyeMid, mouthMid) or 1

raw.yawAngle =
  ((nose.x - faceCenter.x) / eyeDistance) * 42 +
  ((rightEye.z - leftEye.z) / eyeDistance) * (42 * 0.4)

raw.pitchAngle =
  ((nose.y - faceCenter.y) / eyeMouthDistance) * 55 +
  ((nose.z - chin.z) / eyeDistance) * (55 * 0.18)

raw.rollAngle =
  atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / PI)

stable =
  robustScale(pitchValues) < 12 and
  robustScale(yawValues) < 12 and
  robustScale(rollValues) < 8

neutral pose is set when:
  samples.length >= 30 and stable == true

neutral = {
  pitchAngle: median(pitchValues),
  yawAngle: median(yawValues),
  rollAngle: median(rollValues),
  ready: true,
  confidence: min(1, samples.length / 90)
}

fallback neutral if not ready = {
  pitchAngle: 0,
  yawAngle: 0,
  rollAngle: 0,
  ready: false,
  confidence: min(0.5, samples.length / 90)
}

calibrated pitchAngle =
  raw.pitchAngle - neutral.pitchAngle

calibrated yawAngle =
  raw.yawAngle - neutral.yawAngle

calibrated rollAngle =
  raw.rollAngle - neutral.rollAngle
```

Exact state classification:

```text
absPitch = abs(pitchAngle)
absYaw = abs(yawAngle)

headDirection = "Forward" by default

if absYaw >= 14 and absYaw >= absPitch:
  headDirection = "Right" if yawAngle > 0 else "Left"
else if absPitch >= 12:
  headDirection = "Down" if pitchAngle > 0 else "Up"

isForward =
  headDirection == "Forward"

isTilted =
  abs(rollAngle) >= 15

labels.pitch =
  "Looking Down" if pitchAngle > 12
  "Looking Up" if pitchAngle < -12
  "Level" otherwise

labels.yaw =
  "Looking Right" if yawAngle > 14
  "Looking Left" if yawAngle < -14
  "Centered" otherwise

labels.roll =
  "Head Tilt" if abs(rollAngle) >= 15
  "Level" otherwise
```

### 6. Head Attention Metrics

Files:
- [headAttentionMetrics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headAttentionMetrics.js)

Constants:

```text
HEAD_DIRECTIONS = ["Forward", "Left", "Right", "Up", "Down"]
ROLLING_WINDOW_MS = 60000 ms
frameDelta clamp max = 250 ms
```

Exact formulas:

```text
dt =
  clamp(t - lastFrameAt, 0, 250)
  if lastFrameAt exists
  else 0

currentHeadScore =
  100 if frame.isForward else 0

rollingForwardFrames =
  count(rollingFrames where isForward == true)

rollingHeadScore =
  (rollingForwardFrames / rollingFrames.length) * 100
  if rollingFrames.length > 0
  else 0

sessionHeadScore =
  (forwardFrames / totalFrames) * 100
  if totalFrames > 0
  else 0

headScore =
  rollingHeadScore

directionDistribution[direction] =
  (directionCounts[direction] / totalFrames) * 100
  if totalFrames > 0
  else 0
```

### 7. Gaze Tracking

Files:
- [gazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeTracking.js)
- [gazeDirection.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeDirection.js)
- [gazeMetrics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeMetrics.js)

Constants:

```text
GAZE_LANDMARKS = {
  leftEyeOuter: 33,
  leftEyeInner: 133,
  leftEyeTop: 159,
  leftEyeBottom: 145,
  rightEyeInner: 362,
  rightEyeOuter: 263,
  rightEyeTop: 386,
  rightEyeBottom: 374,
  leftIris: [468, 469, 470, 471],
  rightIris: [473, 474, 475, 476]
}

QUALITY_LIMITS = {
  minEyeOpenness: 0.16,
  minFaceSize: 0.08,
  maxIrisJump: 0.12,
  maxHeadMotion: 0.08
}

ROLLING_WINDOW_MS = 60000 ms
frameDelta clamp max = 250 ms

DEFAULT_GAZE_THRESHOLDS = {
  left: 0.42,
  right: 0.58,
  up: 0.38,
  down: 0.62,
  centerHorizontal: 0.5,
  centerVertical: 0.5
}
```

Exact geometric formulas:

```text
averagePoint(indices) = {
  x: mean(valid landmark x),
  y: mean(valid landmark y),
  z: mean(valid landmark z)
}

leftX = min(inner.x, outer.x)
rightX = max(inner.x, outer.x)
topY = min(top.y, bottom.y)
bottomY = max(top.y, bottom.y)

width = rightX - leftX
height = bottomY - topY

horizontalRatio =
  clamp((iris.x - leftX) / width, 0, 1)

verticalRatio =
  clamp((iris.y - topY) / height, 0, 1)

average horizontalRatio =
  (left.horizontalRatio + right.horizontalRatio) / 2

average verticalRatio =
  (left.verticalRatio + right.verticalRatio) / 2
```

Exact quality formulas:

```text
irisLandmarkVisibility =
  visible iris landmark count / 8

eyeOpenness(single eye) =
  (
    dist(p1, p5) +
    dist(p2, p4)
  ) / (2 * dist(p0, p3))

averageEyeOpenness =
  average(left EAR-like openness, right EAR-like openness)

normalizedFaceSize =
  sqrt((leftEyeOuter.x - rightEyeOuter.x)^2 + (leftEyeOuter.y - rightEyeOuter.y)^2)

normalizedHeadMotion =
  average over nose/chin/leftEye/rightEye anchors of
  sqrt((x_now - x_prev)^2 + (y_now - y_prev)^2)

irisJump =
  sqrt(
    (horizontalRatio_now - horizontalRatio_prev)^2 +
    (verticalRatio_now - verticalRatio_prev)^2
  )

qualityScore =
  clamp(
    irisVisibility * 30 +
    clamp(eyeOpenness / 0.28, 0, 1) * 25 +
    clamp(faceSize / 0.16, 0, 1) * 20 +
    clamp(1 - irisJump / 0.12, 0, 1) * 15 +
    clamp(1 - headMotion / 0.08, 0, 1) * 10,
    0,
    100
  )

frame valid if:
  reasons.length == 0 and ratios exists

reasons append:
  "iris_landmarks_missing" if irisVisibility < 1
  "eyes_partially_closed" if eyeOpenness < 0.16
  "face_too_small" if faceSize < 0.08
  "excessive_head_movement" if headMotion > 0.08
  "iris_landmarks_unstable" if irisJump > 0.12
```

Exact gaze direction formulas:

```text
centerHorizontal = thresholds.centerHorizontal if finite else 0.5
centerVertical = thresholds.centerVertical if finite else 0.5

leftOffsetBoundary = min(left - centerHorizontal, -0.001)
rightOffsetBoundary = max(right - centerHorizontal, 0.001)
upOffsetBoundary = min(up - centerVertical, -0.001)
downOffsetBoundary = max(down - centerVertical, 0.001)

horizontalOffset =
  horizontalRatio - centerHorizontal

verticalOffset =
  verticalRatio - centerVertical

distanceFromCenter =
  sqrt(horizontalOffset^2 + verticalOffset^2)

axisExcursionScore(offset, negativeBoundary, positiveBoundary) =
  abs(offset) / abs(negativeBoundary)
  if offset < 0

axisExcursionScore(offset, negativeBoundary, positiveBoundary) =
  abs(offset) / abs(positiveBoundary)
  if offset >= 0

horizontalScore =
  axisExcursionScore(horizontalOffset, leftOffsetBoundary, rightOffsetBoundary)

verticalScore =
  axisExcursionScore(verticalOffset, upOffsetBoundary, downOffsetBoundary)

isCentered =
  horizontalScore <= 1 and verticalScore <= 1
```

Exact gaze state classification:

```text
if isCentered:
  direction = "Center"
else if horizontalScore >= verticalScore:
  direction = "Left" if horizontalOffset < 0 else "Right"
else:
  direction = "Up" if verticalOffset < 0 else "Down"
```

Exact gaze metrics formulas:

```text
currentGazeScore =
  100 if gazeDirection == "Center" else 0

rollingCenterFrames =
  count(rollingFrames where isCenter == true)

rollingGazeScore =
  (rollingCenterFrames / rollingFrames.length) * 100
  if rollingFrames.length > 0
  else 0

sessionGazeScore =
  (centerFrames / totalFrames) * 100
  if totalFrames > 0
  else 0

gazeScore =
  rollingGazeScore
```

### 8. Gaze Calibration

Files:
- [gazeCalibration.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeCalibration.js)

Constants:

```text
GAZE_CALIBRATION_STAGES = ["Center", "Left", "Right", "Up", "Down"]
GAZE_CALIBRATION_STAGE_MS = 5000 ms
MIN_VALID_SAMPLES_PER_STAGE = 10
```

Exact formulas:

```text
stageIndex =
  floor((now - startedAt) / 5000)

currentTarget =
  GAZE_CALIBRATION_STAGES[stageIndex] or null

successful =
  every stage sample count >= 10

centerHorizontal =
  center.horizontal.median if finite else 0.5

centerVertical =
  center.vertical.median if finite else 0.5

horizontalDeadzone =
  max(center.horizontal.mad * 2, 0.03)

verticalDeadzone =
  max(center.vertical.mad * 2, 0.03)

midpoint(a, b, fallback) =
  fallback if a or b not finite
  else (a + b) / 2

lowerBoundary(targetMedian, centerMedian, centerDeadzone, fallback) =
  min(midpoint(targetMedian, centerMedian, fallback), centerMedian - centerDeadzone)

upperBoundary(centerMedian, targetMedian, centerDeadzone, fallback) =
  max(midpoint(centerMedian, targetMedian, fallback), centerMedian + centerDeadzone)

personalized thresholds = {
  centerHorizontal: centerHorizontal,
  centerVertical: centerVertical,
  left: lowerBoundary(left.horizontal.median, centerHorizontal, horizontalDeadzone, 0.42),
  right: upperBoundary(centerHorizontal, right.horizontal.median, horizontalDeadzone, 0.58),
  up: lowerBoundary(up.vertical.median, centerVertical, verticalDeadzone, 0.38),
  down: upperBoundary(centerVertical, down.vertical.median, verticalDeadzone, 0.62)
}
```

Exact calibration confidence and validation formulas:

```text
sampleCoverage =
  (
    sum over stages of min(1, stageSampleCount / 10)
  ) / 5

validRate =
  validFrames / collectedFrames
  if collectedFrames > 0
  else 0

calibration confidence =
  round((sampleCoverage * 0.65 + validRate * 0.35) * 100)

horizontalSpread =
  center.horizontal.mad + left.horizontal.mad + right.horizontal.mad + 0.001

verticalSpread =
  center.vertical.mad + up.vertical.mad + down.vertical.mad + 0.001

leftSep =
  abs(center.horizontal.median - left.horizontal.median) / horizontalSpread

rightSep =
  abs(right.horizontal.median - center.horizontal.median) / horizontalSpread

upSep =
  abs(center.vertical.median - up.vertical.median) / verticalSpread

downSep =
  abs(down.vertical.median - center.vertical.median) / verticalSpread

directionSeparability =
  round(min(100, mean([leftSep, rightSep, upSep, downSep]) * 25))

reliability score numeric =
  directionSeparability * 0.6 + confidence * 0.4

reliability label:
  "Poor" if successful == false
  "Excellent" if score >= 85
  "Good" if score >= 70
  "Fair" if score >= 50
  "Poor" otherwise
```

### 9. Gaze Confidence

Files:
- [useGazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useGazeTracking.js)

Constants:

```text
STATE_UPDATE_MS = 250 ms
```

Exact formulas:

```text
iris =
  frameQuality.irisVisibility ?? 0

openness =
  min(100, ((frameQuality.eyeOpenness ?? 0) / 0.28) * 100)

stability =
  max(
    0,
    100 -
    ((frameQuality.irisJump ?? 0) / 0.12) * 60 -
    ((frameQuality.headMotion ?? 0) / 0.08) * 40
  )

calibration =
  100
  if calibrationStatus.successful

calibration =
  min(100, (calibrationStatus.overallProgress ?? 0) * 70)
  otherwise

gatePenalty =
  1 if frameQuality.valid
  else 0.35

gazeConfidence =
  round(
    (
      iris * 0.3 +
      openness * 0.25 +
      stability * 0.25 +
      calibration * 0.2
    ) * gatePenalty
  )
```

### 10. Attention Fusion

Files:
- [attentionFusion.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/attentionFusion.js)
- [useAttentionFusion.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useAttentionFusion.js)

Constants:

```text
HISTORY_LIMIT = 120
PROFILE_READY_CONFIDENCE = 0.75
PROFILE_READY_SAMPLES = 15
CONFLICT_CONFIDENCE_FLOOR = 45
STRONG_CONFLICT_GAP = 45

BLINK_ZONES = [
  { key: "hyperfocused", min: 0, max: 8 },
  { key: "attentive", min: 8, max: 15 },
  { key: "neutral", min: 15, max: 21 },
  { key: "fatigued", min: 21, max: 31 },
  { key: "sleepy", min: 31, max: Infinity }
]
```

Exact blink score formulas:

```text
profileReady(profile) =
  (profile.confidence ?? 0) >= 0.75 and
  (profile.sampleCount ?? 0) >= 15

if profileReady(profile) == false:
  blinkScore = bpmZoneAttentionScore(blink)

if profileReady(profile) == true:
  attentionDriftScore = clamp(drift.attentionDriftScore ?? 100, 0, 100)
  fatigueScore = clamp(fatigue.fatigueScore ?? 0, 0, 100)
  inverseFatigueScore = 100 - fatigueScore
  baselineNormalityScore = baselineNormalityFromZScores([fatigue.bpmZ, fatigue.ibiZ, fatigue.blinkDurationZ])

  blinkScore =
    clamp(
      attentionDriftScore * 0.4 +
      inverseFatigueScore * 0.35 +
      baselineNormalityScore * 0.25,
      0,
      100
    )

bpmZoneAttentionScore(blink):
  if zone == "attentive":
    100
  if zone == "neutral":
    clamp(88 - abs(bpm - 18) * 2, 55, 88)
  if zone == "hyperfocused":
    clamp(72 + (8 - bpm) * 2.5, 45, 76)
  if zone == "fatigued":
    clamp(60 - (bpm - 21) * 2, 28, 60)
  else:
    clamp(40 - (bpm - 31) * 1.5, 0, 40)

baselineNormalityFromZScores(values):
  clean = finite z-scores
  if clean.length == 0: 50
  meanAbsoluteZ = mean(abs(clean))
  return clamp(100 - meanAbsoluteZ * 25, 0, 100)
```

Exact head score formulas:

```text
session = clamp(head.sessionHeadScore ?? 0, 0, 100)
rolling = clamp(head.rollingHeadScore ?? session, 0, 100)

headScore =
  clamp(rolling * 0.6 + session * 0.4, 0, 100)
```

Exact gaze score formulas:

```text
session = clamp(gaze.sessionGazeScore ?? 0, 0, 100)
rolling = clamp(gaze.rollingGazeScore ?? session, 0, 100)

gazeScore =
  clamp(rolling * 0.65 + session * 0.35, 0, 100)
```

Exact confidence formulas:

```text
blinkConfidence =
  clamp(
    profileConfidence * 0.35 +
    fatigueConfidence * 0.25 +
    driftConfidence * 0.2 +
    faceAvailability * 0.2,
    0,
    100
  )

where
  profileConfidence = clamp(profile.confidence ?? 0, 0, 1) * 100
  fatigueConfidence = clamp(fatigue.fatigueConfidence ?? 0, 0, 1) * 100
  driftConfidence = clamp(attentionDrift.attentionTrendConfidence ?? attentionDrift.trendConfidence ?? 0, 0, 1) * 100
  faceAvailability = 100 if blink.faceDetected else 0

headConfidence =
  clamp(
    calibration * 0.45 +
    poseStability * 0.3 +
    trackingContinuity * 0.25,
    0,
    100
  )

where
  calibration = clamp(head.calibrationConfidence ?? 0, 0, 1) * 100
  poseStability = stabilityScore([head.rollingHeadScore ?? 0, head.sessionHeadScore ?? 0])
  trackingContinuity = clamp((head.totalFrames ?? 0) / 30, 0, 1) * 100

stabilityScore(values) =
  if no finite positive values: 0
  avg = mean(clean)
  spread = mean(abs(value - avg))
  clamp(100 - spread * 200, 0, 100)

gazeConfidence =
  clamp(
    moduleConfidence * 0.35 +
    calibrationConfidence * 0.25 +
    frameQuality * 0.25 +
    reliability * 0.15,
    0,
    100
  )

where
  moduleConfidence = clamp(gaze.gazeConfidence ?? 0, 0, 100)
  calibrationConfidence = clamp(gaze.calibration.validationReport.confidence ?? 0, 0, 100)
  frameQuality = clamp(gaze.frameQuality.qualityScore ?? 0, 0, 100)
  reliability = reliabilityScoreToPercent(gaze.calibration.validationReport.reliabilityScore)

reliabilityScoreToPercent(label):
  100 if "Excellent"
  80 if "Good"
  55 if "Fair"
  25 if "Poor"
  0 otherwise
```

Exact fusion formulas:

```text
confidenceSum =
  blinkConfidence + headConfidence + gazeConfidence

safeSum =
  confidenceSum if confidenceSum > 0
  else 1

blinkWeight =
  blinkConfidence / safeSum

headWeight =
  headConfidence / safeSum

gazeWeight =
  gazeConfidence / safeSum

rawAttentionScore =
  clamp(
    blinkWeight * blinkScore +
    headWeight * headScore +
    gazeWeight * gazeScore,
    0,
    100
  )
```

Exact conflict penalty:

```text
for each modality pair (a, b):
  confidence = min(a.confidence, b.confidence)
  if confidence < 45: continue

  gap = abs(a.score - b.score)
  if gap < 45: continue

  confidenceScale =
    (confidence - 45) / (100 - 45)

  gapScale =
    (gap - 45) / (100 - 45)

  pairPenalty =
    12 * confidenceScale * gapScale

conflictPenalty =
  clamp(sum(pairPenalty over all modality pairs), 0, 20)
```

Exact final attention formulas:

```text
finalAttentionScore =
  clamp(rawAttentionScore - conflictPenalty, 0, 100)

finalAttentionState =
  "High" if finalAttentionScore >= 70
  "Medium" if finalAttentionScore >= 40
  "Low" otherwise

contributions = {
  blink: blinkWeight * blinkScore,
  head: headWeight * headScore,
  gaze: gazeWeight * gazeScore
}
```

## PART 2 - Dataset Extraction

Files:
- [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js)
- [AttentionFusionDebugPanel.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/components/AttentionFusionDebugPanel.jsx)

Export formats actually implemented:

```text
CSV: yes
JSON: yes
XLSX: no
Frame-level export: no
```

### A. Frame-Level Schema

There is no exported frame-level dataset in the current codebase.

Internal runtime frame-level objects that exist in memory only:

1. Face landmark frame from [useFaceMesh.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useFaceMesh.js):

```text
{
  t: number,
  landmarks: Array<FaceMeshLandmark>,
  width: number,
  height: number
}
```

2. Eye sample from [useFaceMesh.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useFaceMesh.js):

```text
{
  t: number,
  ear: number,
  threshold: number
}
```

3. Blink event from [blinkEvents.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/blinkEvents.js):

```text
{
  t: number,
  duration: number,
  ibi: number
}
```

4. Head frame passed to metrics from [useHeadPose.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useHeadPose.js):

```text
{
  t: number,
  headDirection: "Forward" | "Left" | "Right" | "Up" | "Down",
  isForward: boolean
}
```

5. Gaze frame passed to metrics from [useGazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useGazeTracking.js):

```text
{
  t: number,
  gazeDirection: "Center" | "Left" | "Right" | "Up" | "Down"
}
```

### B. Session-Level Schema

CSV columns defined in [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js):

| Column | Datatype | Source file | Source module | Formula/source | Description |
| --- | --- | --- | --- | --- | --- |
| `timestamp` | string (ISO 8601) | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Session Recorder | `new Date(now).toISOString()` | Sample timestamp |
| `attentionScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion | `fusion.finalAttentionScore` | Duplicate export of final attention score |
| `attentionState` | string | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion | `fusion.finalAttentionState` | Final attention label |
| `blinkScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion / Blink | `fusion.blinkScore` | Blink module contribution score before weighting |
| `blinkConfidence` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion / Blink | `fusion.blinkConfidence` | Blink module confidence |
| `fatigueScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Fatigue | `blinkAnalytics.fatigue.fatigueScore` | Fatigue score |
| `fatigueConfidence` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Fatigue | `blinkAnalytics.fatigue.fatigueConfidence` | Fatigue confidence |
| `attentionDriftScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Drift | `blinkAnalytics.attentionDrift.attentionDriftScore` | Drift-adjusted attention score |
| `attentionDriftTrend` | string | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Drift | `blinkAnalytics.attentionDrift.trendLabel` | Trend label: Stable / Improving / Declining |
| `bpm` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Blink Analytics | `metrics.currentBpm` | Rolling blinks per minute |
| `ibiMean` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Blink Events | `blinkAnalytics.ibi.avgIbi` | Mean inter-blink interval |
| `ibiStd` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Blink Events | `blinkAnalytics.ibi.ibiStdDev` | Standard deviation of IBI |
| `blinkVariability` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Blink Events | `blinkAnalytics.ibi.variabilityIndex` | Coefficient of variation of IBI |
| `headScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion / Head | `fusion.headScore` | Head module score before weighting |
| `headConfidence` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion / Head | `fusion.headConfidence` | Head module confidence |
| `pitch` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Head Pose | `headPose.pitchAngle` | Calibrated pitch angle |
| `yaw` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Head Pose | `headPose.yawAngle` | Calibrated yaw angle |
| `roll` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Head Pose | `headPose.rollAngle` | Calibrated roll angle |
| `headDirection` | string | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Head Pose | `headPose.headDirection` | Direction label |
| `gazeScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion / Gaze | `fusion.gazeScore` | Gaze module score before weighting |
| `gazeConfidence` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion / Gaze | `fusion.gazeConfidence` | Gaze module confidence |
| `gazeDirection` | string | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Gaze Tracking | `gaze.gazeDirection` | Gaze direction label |
| `finalAttentionScore` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Attention Fusion | `fusion.finalAttentionScore` | Final fusion score |
| `fusionConfidence` | number | [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Session Recorder | `averageFinite([fusion.blinkConfidence, fusion.headConfidence, fusion.gazeConfidence])` | Mean module confidence |

Sampling rule:

```text
SAMPLE_INTERVAL_MS = 5000 ms
```

Normalization rule:

```text
For numeric fields:
  if finite -> keep value
  else -> 0

For string fields:
  if value != null -> keep value
  else -> ""
```

### C. Summary-Level Schema

JSON payload written by `exportJson()` in [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js):

Top-level schema:

```text
{
  metadata: {...},
  sessionSummary: {...},
  samples: [...]
}
```

`metadata` fields:

| Field | Datatype | Formula/source | Description |
| --- | --- | --- | --- |
| `exportedAt` | string | `new Date().toISOString()` | Export timestamp |
| `sessionStartedAt` | string or null | `startedAt ? new Date(startedAt).toISOString() : null` | Recording start time |
| `sessionStoppedAt` | string or null | `stoppedAt ? new Date(stoppedAt).toISOString() : null` | Recording stop time |
| `sampleIntervalSeconds` | number | `sampleIntervalMs / 1000` | Sampling period in seconds |
| `sampleCount` | number | `samplesRef.current.length` | Number of session samples |
| `schemaVersion` | number | `1` | Schema version |
| `fields` | string[] | `DATASET_FIELDS` | CSV field list |

`sessionSummary` fields from `createSessionSummary()`:

| Field | Datatype | Formula/source | Description |
| --- | --- | --- | --- |
| `sessionDuration` | number | `round((durationEnd - startedAt) / 1000)` | Recording duration in seconds |
| `averageAttentionScore` | number | `averageField(samples, "attentionScore")` | Mean attention score |
| `minimumAttentionScore` | number | `minField(samples, "attentionScore")` | Minimum attention score |
| `maximumAttentionScore` | number | `maxField(samples, "attentionScore")` | Maximum attention score |
| `averageBlinkScore` | number | `averageField(samples, "blinkScore")` | Mean blink score |
| `averageHeadScore` | number | `averageField(samples, "headScore")` | Mean head score |
| `averageGazeScore` | number | `averageField(samples, "gazeScore")` | Mean gaze score |
| `averageFatigueScore` | number | `averageField(samples, "fatigueScore")` | Mean fatigue score |
| `highAttentionPercentage` | number | `(count(attentionState == "High") / sampleCount) * 100` | Percentage of High samples |
| `mediumAttentionPercentage` | number | `(count(attentionState == "Medium") / sampleCount) * 100` | Percentage of Medium samples |
| `lowAttentionPercentage` | number | `(count(attentionState == "Low") / sampleCount) * 100` | Percentage of Low samples |
| `averageBPM` | number | `averageField(samples, "bpm")` | Mean BPM |

## PART 3 - Research Variables

Classification of exported variables:

### Independent Variables

- `bpm`
- `ibiMean`
- `ibiStd`
- `blinkVariability`
- `fatigueScore`
- `fatigueConfidence`
- `attentionDriftScore`
- `attentionDriftTrend`
- `pitch`
- `yaw`
- `roll`
- `headDirection`
- `gazeDirection`

### Dependent Variables

- `attentionScore`
- `finalAttentionScore`
- `attentionState`

### Control Variables

- `timestamp`
- `blinkConfidence`
- `headConfidence`
- `gazeConfidence`
- `fusionConfidence`

### Derived Variables

- `blinkScore`
- `headScore`
- `gazeScore`
- `attentionScore`
- `finalAttentionScore`
- `attentionState`
- `fusionConfidence`

### Potential Ground Truth Variables

Current exported dataset includes no external ground-truth field.

Possible proxies only:
- `attentionState`
- `attentionDriftTrend`
- `gazeDirection`
- `headDirection`

### Potential Labels

- `attentionState`
- `attentionDriftTrend`
- `gazeDirection`
- `headDirection`

## PART 4 - Paper Figures

All figure definitions below use only currently exported session-level columns.

| Figure No. | Figure Title | Purpose | X Axis | Y Axis | Dataset Columns Required |
| --- | --- | --- | --- | --- | --- |
| 1 | Attention Timeline | Show final attention over session time | `timestamp` | `finalAttentionScore` | `timestamp`, `finalAttentionScore`, `attentionState` |
| 2 | Module Score Timeline | Show blink/head/gaze score trajectories | `timestamp` | `blinkScore`, `headScore`, `gazeScore` | `timestamp`, `blinkScore`, `headScore`, `gazeScore` |
| 3 | Blink Timeline | Show blink rate progression | `timestamp` | `bpm` | `timestamp`, `bpm`, `blinkScore` |
| 4 | Fatigue Progression | Show fatigue and blink variability progression | `timestamp` | `fatigueScore`, `ibiMean`, `blinkVariability` | `timestamp`, `fatigueScore`, `ibiMean`, `blinkVariability` |
| 5 | Attention Drift Timeline | Show drift score across session | `timestamp` | `attentionDriftScore` | `timestamp`, `attentionDriftScore`, `attentionDriftTrend` |
| 6 | Gaze Direction Distribution | Show gaze class frequencies | `gazeDirection` | count | `gazeDirection` |
| 7 | Head Direction Distribution | Show head direction frequencies | `headDirection` | count | `headDirection` |
| 8 | Attention State Distribution | Show final state frequencies | `attentionState` | count | `attentionState` |
| 9 | Head Pose Angle Histograms | Show angle distributions | angle bins | count | `pitch`, `yaw`, `roll` |
| 10 | Gaze Score Histogram | Show gaze score distribution | score bins | count | `gazeScore` |
| 11 | Fusion Contribution Timeline | Show recomputed weighted blink/head/gaze contributions | `timestamp` | `blinkContribution`, `headContribution`, `gazeContribution` | `timestamp`, `blinkScore`, `headScore`, `gazeScore`, `blinkConfidence`, `headConfidence`, `gazeConfidence` |
| 12 | Confidence Timeline | Show module confidence over time | `timestamp` | `blinkConfidence`, `headConfidence`, `gazeConfidence`, `fusionConfidence` | `timestamp`, `blinkConfidence`, `headConfidence`, `gazeConfidence`, `fusionConfidence` |
| 13 | Correlation Heatmap | Show linear relationships among numeric fields | numeric variables | numeric variables | exported numeric columns |
| 14 | Attention vs Blink Scatter | Show association between final attention and blink score | `blinkScore` | `finalAttentionScore` | `blinkScore`, `finalAttentionScore` |
| 15 | Attention vs Head Scatter | Show association between final attention and head score | `headScore` | `finalAttentionScore` | `headScore`, `finalAttentionScore` |
| 16 | Attention vs Gaze Scatter | Show association between final attention and gaze score | `gazeScore` | `finalAttentionScore` | `gazeScore`, `finalAttentionScore` |
| 17 | Fatigue vs Attention Scatter | Show fatigue-attention relationship | `fatigueScore` | `finalAttentionScore` | `fatigueScore`, `finalAttentionScore` |
| 18 | Attention State Boxplots | Compare key numeric variables by `attentionState` | `attentionState` | numeric variables | `attentionState`, `bpm`, `blinkScore`, `headScore`, `gazeScore`, `fatigueScore`, `finalAttentionScore` |
| 19 | Attention State Violin Plots | Show distribution shape by `attentionState` | `attentionState` | numeric variables | same as Figure 18 |
| 20 | Numeric Histograms Grid | Show univariate numeric distributions | numeric bins | count | exported numeric columns |
| 21 | Trend Curve Grid | Show rolling means of key metrics | sample index / `timestamp` | rolling mean | `timestamp`, `finalAttentionScore`, `bpm`, `fatigueScore`, `blinkScore`, `headScore`, `gazeScore` |
| 22 | Calibration Quality Proxy Plot | Show post-calibration stability proxies | `timestamp` | `gazeConfidence`, `headConfidence`, `fusionConfidence` | `timestamp`, `gazeConfidence`, `headConfidence`, `fusionConfidence` |
| 23 | Participant Mean Comparison | Compare participant/session means | participant/session id | mean score | `finalAttentionScore`, `blinkScore`, `headScore`, `gazeScore`, inferred dataset id |
| 24 | Participant State Comparison | Compare state proportions by participant/session | participant/session id | state percentage | `attentionState`, inferred dataset id |
| 25 | Direction Crosstab Heatmap | Show head-gaze co-occurrence | `headDirection` | `gazeDirection` | `headDirection`, `gazeDirection` |

Calibration quality note:

```text
Direct calibration quality metrics are not exported to CSV.
The only exportable calibration proxies are:
  gazeConfidence
  headConfidence
  fusionConfidence
```

## PART 5 - Paper Tables

| Table Title | Columns | Purpose |
| --- | --- | --- |
| Dataset Inventory | file name, row count, start time, end time, duration | Show dataset coverage |
| Export Schema Table | field, datatype, source module, formula | Data dictionary |
| Session Descriptive Statistics | variable, mean, std, min, max, median, q1, q3 | Overall numeric summary |
| Categorical Distributions | variable, category, count, percentage | Frequency summary |
| Participant Summary | participant/session id, sample count, mean attention, mean blink/head/gaze score, mean fatigue, mean confidence | Between-session comparison |
| Attention State Group Means | attentionState, variable means, stds, counts | Compare variables by final label |
| Gaze Direction Group Means | gazeDirection, variable means, stds, counts | Compare variables by gaze label |
| Head Direction Group Means | headDirection, variable means, stds, counts | Compare variables by head label |
| Correlation Matrix | numeric variable x numeric variable | Report association structure |
| Missingness Report | variable, missing count, missing percentage | Data completeness |
| Statistical Test Results | test name, variables, statistic, p-value, effect size, interpretation | Publication-ready inferential results |
| Confidence Intervals Table | grouping variable, metric, n, mean, ci_low, ci_high | Uncertainty summary |

## PART 6 - Statistical Analysis

Only currently exported columns are used.

Important interpretation constraint:

```text
attentionState is derived from finalAttentionScore.
blinkScore, headScore, and gazeScore are direct inputs to finalAttentionScore.
Therefore, tests involving these variables are descriptive/associative for publication,
not independent causal validation.
```

### Descriptive Statistics

Use:
- `finalAttentionScore`
- `blinkScore`
- `headScore`
- `gazeScore`
- `bpm`
- `fatigueScore`
- `ibiMean`
- `ibiStd`
- `blinkVariability`
- `pitch`
- `yaw`
- `roll`
- `blinkConfidence`
- `headConfidence`
- `gazeConfidence`
- `fusionConfidence`

### Pearson Correlations

Recommended pairs:
- `finalAttentionScore` vs `blinkScore`
- `finalAttentionScore` vs `headScore`
- `finalAttentionScore` vs `gazeScore`
- `finalAttentionScore` vs `fatigueScore`
- `finalAttentionScore` vs `bpm`
- `fatigueScore` vs `blinkVariability`
- `gazeScore` vs `gazeConfidence`
- `headScore` vs `headConfidence`
- `blinkScore` vs `blinkConfidence`

Null hypothesis:

```text
H0: Pearson r = 0 between the two variables.
H1: Pearson r != 0 between the two variables.
```

### Spearman Correlations

Recommended for monotonic but potentially non-normal data:
- `finalAttentionScore` vs `fatigueScore`
- `finalAttentionScore` vs `bpm`
- `finalAttentionScore` vs `blinkVariability`
- `attentionState` encoded ordinal vs `fatigueScore`

Null hypothesis:

```text
H0: Spearman rho = 0.
H1: Spearman rho != 0.
```

### t-tests

Recommended comparisons:
- `High` vs `Low` attention groups on `bpm`
- `High` vs `Low` attention groups on `fatigueScore`
- `High` vs `Low` attention groups on `blinkScore`
- `High` vs `Low` attention groups on `headScore`
- `High` vs `Low` attention groups on `gazeScore`
- `High` vs `Low` attention groups on `fusionConfidence`

Null hypothesis:

```text
H0: mean(variable | High) = mean(variable | Low)
H1: mean(variable | High) != mean(variable | Low)
```

### ANOVA

Recommended one-way ANOVA across `attentionState` groups (`High`, `Medium`, `Low`) for:
- `bpm`
- `fatigueScore`
- `blinkScore`
- `headScore`
- `gazeScore`
- `fusionConfidence`

Null hypothesis:

```text
H0: all group means are equal
H1: at least one group mean differs
```

### Mann-Whitney U

Non-parametric alternative for `High` vs `Low` on:
- `bpm`
- `fatigueScore`
- `blinkScore`
- `headScore`
- `gazeScore`

Null hypothesis:

```text
H0: the distributions of the two groups are equal
H1: the distributions differ
```

### Kruskal-Wallis

Non-parametric alternative across `attentionState` groups for:
- `bpm`
- `fatigueScore`
- `blinkScore`
- `headScore`
- `gazeScore`
- `fusionConfidence`

Null hypothesis:

```text
H0: all group distributions are equal
H1: at least one group distribution differs
```

### Chi-Square

Recommended contingency tests:
- `attentionState` x `gazeDirection`
- `attentionState` x `headDirection`
- `headDirection` x `gazeDirection`
- `attentionDriftTrend` x `attentionState`

Null hypothesis:

```text
H0: the two categorical variables are independent
H1: the two categorical variables are associated
```

### Cohen's d

Recommended effect sizes for `High` vs `Low` attention groups:
- `fatigueScore`
- `blinkScore`
- `headScore`
- `gazeScore`
- `bpm`

Formula:

```text
pooled_sd =
  sqrt(((n1 - 1) * sd1^2 + (n2 - 1) * sd2^2) / (n1 + n2 - 2))

Cohen's d =
  (mean1 - mean2) / pooled_sd
```

### Confidence Intervals

Recommended 95% confidence intervals for means of:
- `finalAttentionScore`
- `blinkScore`
- `headScore`
- `gazeScore`
- `fatigueScore`
- `bpm`
- `fusionConfidence`

Formula used in analytics package:

```text
mean +/- t_(0.975, n-1) * (sd / sqrt(n))
```

## PART 7 - Automatic Analytics Package

Implemented in:
- [paper_analytics/common.py](file:///c:/Users/santh/Downloads/blink-detection-main/paper_analytics/common.py)
- [paper_analytics/generate_figures.py](file:///c:/Users/santh/Downloads/blink-detection-main/paper_analytics/generate_figures.py)
- [paper_analytics/generate_tables.py](file:///c:/Users/santh/Downloads/blink-detection-main/paper_analytics/generate_tables.py)
- [paper_analytics/run_statistics.py](file:///c:/Users/santh/Downloads/blink-detection-main/paper_analytics/run_statistics.py)
- [paper_analytics/run_all.py](file:///c:/Users/santh/Downloads/blink-detection-main/paper_analytics/run_all.py)

Output structure:

```text
paper_outputs/
  figures/
  tables/
  statistics/
  correlations/
  participants/
```

The package:

1. Loads exported CSV and JSON session files
2. Parses timestamps
3. Infers dataset/session identifiers from file names
4. Recomputes fusion weights, contributions, raw score, and conflict penalty from exported columns
5. Generates publication figures
6. Generates publication tables
7. Runs inferential statistics and confidence intervals
8. Saves all outputs automatically

## PART 8 - Paper Writing Package

### Candidate Titles

1. `Privacy-Preserving Multi-Modal Attention Monitoring with On-Device Blink, Head Pose, and Gaze Fusion`
2. `Browser-Native Attention Estimation Using Personalized Blink Analytics and Confidence-Weighted Fusion`
3. `A Real-Time On-Device Attention Analysis Framework Based on Ocular and Postural Biomarkers`
4. `Confidence-Weighted Attention Fusion from Blink Dynamics, Head Pose, and Gaze Direction in the Browser`

### Novelty Statement

Implemented novelty actually present in code:

1. Real-time attention estimation runs fully client-side in a browser using MediaPipe FaceMesh.
2. Blink analytics are personalized with robust baseline statistics rather than fixed population thresholds alone.
3. Gaze classification is centered on learned calibration medians instead of assuming neutral gaze at absolute 0.5 eye-box ratios.
4. Final attention is computed by confidence-weighted fusion with an explicit disagreement penalty between modalities.

### Contributions

Engineering contributions implemented in code:

1. Real-time webcam landmark extraction with no backend dependency.
2. Dynamic EAR thresholding from rolling open-eye history.
3. Personalized baseline estimation from robust median and MAD statistics.
4. Fatigue inference from personalized blink-rate, blink-duration, and IBI deviations.
5. Lightweight head pose estimation with neutral-pose self-calibration.
6. Center-relative gaze calibration and classification.
7. Multi-modal confidence-weighted attention fusion with conflict penalty.
8. In-app CSV and JSON session export.

### Abstract Outline

1. Motivation: privacy-preserving attention measurement.
2. Method: on-device blink, head pose, and gaze analytics.
3. Personalization: robust baseline learning and gaze calibration.
4. Fusion: confidence-weighted scoring plus conflict penalty.
5. Output: session-level export for research analysis.
6. Evaluation: participant study and statistical validation plan.

### Introduction Outline

1. Attention monitoring need in education and human-computer interaction.
2. Limitations of cloud, intrusive sensors, and single-modality systems.
3. Advantages of browser-native, camera-only, on-device inference.
4. Research gap addressed by personalized multi-modal fusion.
5. Contribution summary.

### Methodology Outline

1. Camera acquisition and landmark extraction.
2. Blink detection and event analytics.
3. Personalized profile estimation.
4. Fatigue and attention drift modeling.
5. Head pose estimation and forward-attention metrics.
6. Gaze ratio estimation, calibration, and confidence.
7. Fusion scoring and final state classification.
8. Session recording and export.

### Experimental Setup Outline

1. Participants and consent.
2. Hardware and webcam placement conditions.
3. Calibration procedure.
4. Fixed attention and distraction tasks.
5. Recording protocol and export procedure.
6. Ground-truth labeling procedure.
7. Statistical analysis plan.

### Results Outline

1. Descriptive statistics of exported measures.
2. Distribution of final attention states.
3. Correlations between module scores and final attention.
4. Participant/session variability.
5. Calibration proxy stability over time.
6. Inferential test results.

### Discussion Outline

1. Which modality tracks final attention most strongly.
2. Effect of fatigue-related blink dynamics.
3. Benefits and limits of confidence weighting.
4. Sensitivity to head pose and gaze behavior.
5. Dataset limitations and generalizability.

### Conclusion Outline

1. Restate browser-native multi-modal contribution.
2. Summarize implemented personalization and fusion logic.
3. Summarize research export value.
4. Outline next validation steps with participant data.

## PART 9 - Missing Items

### A. Already Completed

Supported directly by current implementation:

1. Browser-native runtime application
2. Real-time blink detection
3. Personalized profile estimation
4. Fatigue scoring
5. Attention drift scoring
6. Head pose estimation and scoring
7. Gaze tracking, calibration, and scoring
8. Attention fusion
9. CSV export
10. JSON export
11. Session summary export
12. Debug panels for module inspection

### B. Needs Participant Data

Not present in the codebase:

1. Actual participant session datasets
2. Participant identifier field inside exported samples
3. Demographics
4. Task labels
5. Ground-truth attention annotations
6. Repeated sessions for reliability analysis
7. Between-device datasets

### C. Needs Experimental Validation

Not present in the codebase:

1. Accuracy validation against human labels or external ground truth
2. Inter-rater agreement if manual annotation is used
3. Statistical power analysis
4. Robustness analysis across lighting conditions
5. Robustness analysis across webcam placement conditions
6. Test-retest reliability
7. External validity across populations and tasks
8. Comparative benchmarking against another attention system

### D. Optional Future Work

Not required for current code extraction, but not implemented:

1. Native participant/session identifiers in export
2. Explicit calibration summary export
3. Per-frame raw EAR/gaze/head export
4. Export of fusion weights and contributions
5. Export of blink bursts and profile baselines in session CSV
6. Additional modalities such as keyboard/mouse context
7. Ground-truth annotation UI
8. XLSX export

## Code Inventory

| File | Purpose | Role in pipeline |
| --- | --- | --- |
| [main.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/main.jsx) | React bootstrap | App entry |
| [App.jsx](file:///c:/Users/santh/Downloads/blink-detection-main/src/App.jsx) | Wires hooks and UI | Runtime orchestrator |
| [useFaceMesh.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useFaceMesh.js) | Camera, landmarks, EAR, blink state machine | Sensor and feature extraction |
| [useBlinkStats.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useBlinkStats.js) | BPM, zones, profile/fatigue/drift orchestration | Blink analytics controller |
| [blinkEvents.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/blinkEvents.js) | IBI and burst analytics | Blink event analytics |
| [personalizedProfile.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/personalizedProfile.js) | Robust baseline estimation | Personalization layer |
| [fatigue.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/fatigue.js) | Personalized fatigue scoring | Blink-derived fatigue model |
| [attentionDrift.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/attentionDrift.js) | Trend analysis over fatigue-adjusted attention | Temporal blink trend model |
| [useHeadPose.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useHeadPose.js) | Head pose state management | Head pipeline controller |
| [headPoseCalculation.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headPoseCalculation.js) | Pose estimation and calibration | Head geometry model |
| [headDirection.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headDirection.js) | Head direction labels | Head classifier |
| [headAttentionMetrics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/headAttentionMetrics.js) | Forward-looking metrics | Head scoring |
| [useGazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useGazeTracking.js) | Gaze state management | Gaze pipeline controller |
| [gazeTracking.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeTracking.js) | Iris ratios and quality | Gaze geometry and frame quality |
| [gazeDirection.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeDirection.js) | Center-relative gaze classification | Gaze classifier |
| [gazeCalibration.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeCalibration.js) | Gaze threshold learning and validation | Gaze calibration |
| [gazeMetrics.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/gazeMetrics.js) | Center-looking metrics | Gaze scoring |
| [attentionFusion.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/analytics/attentionFusion.js) | Multi-modal confidence-weighted fusion | Final scoring |
| [useAttentionFusion.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/hooks/useAttentionFusion.js) | Fusion state hook | Fusion controller |
| [sessionRecorder.js](file:///c:/Users/santh/Downloads/blink-detection-main/src/sessionRecorder.js) | Recording, CSV/JSON export, summary | Research data export |
| [validate_calibration.py](file:///c:/Users/santh/Downloads/blink-detection-main/validate_calibration.py) | Offline threshold comparison on external datasets | Standalone validation utility |
