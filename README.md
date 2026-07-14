# Blink Rate Attention Analyzer

A browser-based dashboard that uses your webcam to detect blinks in real time,
compute your blink rate, and categorize your attention state. Everything runs
client-side — no backend, no video ever leaves your machine.

## How it works

* **MediaPipe FaceMesh** (468 landmarks) tracks your eyes each frame.
* **Eye Aspect Ratio (EAR)** is computed from 6 landmarks per eye and averaged:
`EAR = (|p2-p6| + |p3-p5|) / (2 \\\\\\\* |p1-p4|)`. A blink is counted when the
smoothed EAR dips below `0.21` and recovers.
* A rolling **60-second window** of blink timestamps gives blinks-per-minute
(BPM), which maps to an attention zone:

|BPM|State|Color|
|-|-|-|
|< 8|Hyperfocused|blue|
|8–14|Attentive|green|
|15–20|Neutral|yellow|
|21–30|Fatigued|orange|
|> 30|Sleepy|red|

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Allow camera access when prompted. The MediaPipe model and its wasm assets are
loaded from a CDN on first run, so an internet connection is needed the first
time.

```bash
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Project structure

```
src/
  App.jsx               layout shell + wiring
  hooks/
    useFaceMesh.js       camera + MediaPipe init, EAR + blink detection
    useBlinkStats.js     rolling BPM, categorization, session stats
  components/
    CameraFeed.jsx       video + canvas landmark overlay, live EAR
    AttentionBadge.jsx   current state badge
    BpmChart.jsx         BPM-over-time area chart
    TimelineChart.jsx    attention-state timeline
    DurationChart.jsx    blink-duration histogram
    SessionStats.jsx     summary stat cards
```

## Notes \& tuning

* Per-frame work (EAR, landmark drawing, blink state) lives in refs to avoid
re-render lag; only aggregated chart/stat data is promoted to React state and
recomputed every 5 seconds.
* EAR is smoothed over the last 3 frames before thresholding to reduce noise.
* If no face is seen for 3+ seconds, a warning shows and BPM sampling pauses.
* Thresholds live at the top of `useFaceMesh.js` (`EAR\\\\\\\_THRESHOLD`,
`SMOOTH\\\\\\\_WINDOW`, `NO\\\\\\\_FACE\\\\\\\_TIMEOUT`) and zone boundaries in `useBlinkStats.js`.

```



