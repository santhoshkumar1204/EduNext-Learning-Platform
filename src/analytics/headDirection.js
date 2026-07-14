const PITCH_THRESHOLD_DEG = 12;
const YAW_THRESHOLD_DEG = 14;
const ROLL_TILT_THRESHOLD_DEG = 15;

export function classifyHeadDirection({ pitchAngle, yawAngle, rollAngle }) {
  const absPitch = Math.abs(pitchAngle);
  const absYaw = Math.abs(yawAngle);

  let headDirection = 'Forward';
  if (absYaw >= YAW_THRESHOLD_DEG && absYaw >= absPitch) {
    headDirection = yawAngle > 0 ? 'Right' : 'Left';
  } else if (absPitch >= PITCH_THRESHOLD_DEG) {
    headDirection = pitchAngle > 0 ? 'Down' : 'Up';
  }

  return {
    headDirection,
    isForward: headDirection === 'Forward',
    isTilted: Math.abs(rollAngle) >= ROLL_TILT_THRESHOLD_DEG,
    labels: {
      pitch: pitchAngle > PITCH_THRESHOLD_DEG ? 'Looking Down' : pitchAngle < -PITCH_THRESHOLD_DEG ? 'Looking Up' : 'Level',
      yaw: yawAngle > YAW_THRESHOLD_DEG ? 'Looking Right' : yawAngle < -YAW_THRESHOLD_DEG ? 'Looking Left' : 'Centered',
      roll: Math.abs(rollAngle) >= ROLL_TILT_THRESHOLD_DEG ? 'Head Tilt' : 'Level',
    },
  };
}
