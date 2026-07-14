import { useEffect, useRef, useState } from 'react';
import { computeAttentionFusion, createAttentionFusionStore } from '../analytics/attentionFusion.js';

const EMPTY_FUSION = {
  finalAttentionScore: 0,
  finalAttentionState: 'Low',
  rawAttentionScore: 0,
  conflictPenalty: 0,
  blinkScore: 0,
  headScore: 0,
  gazeScore: 0,
  blinkConfidence: 0,
  headConfidence: 0,
  gazeConfidence: 0,
  contributions: {
    blink: 0,
    head: 0,
    gaze: 0,
  },
  weights: {
    blink: 0,
    head: 0,
    gaze: 0,
  },
};

export function useAttentionFusion({ blink, head, gaze }) {
  const storeRef = useRef(createAttentionFusionStore());
  const [fusion, setFusion] = useState(EMPTY_FUSION);

  useEffect(() => {
    const snapshot = computeAttentionFusion({
      blink,
      head,
      gaze,
      now: Date.now(),
      store: storeRef.current,
    });

    setFusion(snapshot);
  }, [blink, head, gaze]);

  return {
    fusion,
    fusionStore: storeRef.current,
  };
}
