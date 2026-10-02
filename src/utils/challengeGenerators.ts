import { ActiveChallenge, ChallengeType, TargetItem, GameMode } from '../types';
import { STAGE_PROGRESSION } from '../data/gameConstants';
import { generateWeirdModeStage } from './weirdModeStages';
import {
  shuffle,
  pickRandom,
  getAuraCheckStage,
  getColorTargetStage,
  getBatteryPanicStage,
  getWifiHuntStage,
  getCatMemeStage,
  getAutocorrectStage,
  getMicrowaveStage,
  getCapOrNoCapStage,
  getPetPeeveStage,
  getAlarmSnoozeStage,
  getWater3AMStage,
  getCaptchaStage,
  getEmotionalDamageStage,
  getRizzCheckStage,
  getUnsubscribeStage,
  getImpostorStage,
  getOverthinkingStage,
  getQuickMathStage,
  getUsbStage,
  getSpoilerStage,
  getStroopStage,
  getMathMisdirectionStage,
  getLowStorageStage,
  getDiscordPingStage,
  getBombWireStage,
  getElevatorStage,
  getOppositeDayStage,
  getSneezingHoldStage,
  getPhantomVibrationStage,
  getSpeedTypoStage,
  getOddOneOutStage,
  getRgbCountingStage,
  getTiktokScrollStage,
  getChaosShuffleStage,
  getQuantumDecisionStage,
  getFinalBossStage,
} from './questionPools';

export function getStageDifficulty(stageNumber: number, mode: GameMode = 'CRAZY'): { label: string; color: string; bg: string; border: string } {
  if (mode === 'WEIRD') {
    if (stageNumber <= 8) {
      return { label: 'EASY', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)' };
    } else if (stageNumber <= 16) {
      return { label: 'MEDIUM', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' };
    } else {
      return { label: 'TRICKY', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)' };
    }
  }

  if (stageNumber <= 10) {
    return { label: 'EASY', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)' };
  } else if (stageNumber <= 20) {
    return { label: 'MEDIUM', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' };
  } else if (stageNumber <= 35) {
    return { label: 'HARD', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)' };
  } else if (stageNumber <= 45) {
    return { label: 'EXTREME', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)', border: 'rgba(251, 146, 60, 0.4)' };
  } else {
    return { label: 'INSANE', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)', border: 'rgba(244, 63, 94, 0.6)' };
  }
}

export function generateStageChallenge(stageIndex: number, mode: GameMode = 'CRAZY'): ActiveChallenge {
  if (mode === 'WEIRD') {
    return generateWeirdModeStage(stageIndex);
  }

  const stageNumber = Math.min(50, Math.max(1, stageIndex + 1));
  const challengeType: ChallengeType = STAGE_PROGRESSION[stageIndex] || 'TAP_TARGET';
  const timeLimit = 10000;

  switch (challengeType) {
    // -----------------------------------------------------------
    // TIER 1: EASY (Stages 1-10)
    // -----------------------------------------------------------
    case 'TAP_TARGET': {
      const x = 32 + Math.random() * 36;
      const y = 38 + Math.random() * 24;
      const labels = ['TAP!', 'HIT ME!', 'CLICK!', 'ORB!', 'PULSE!'];
      const pickedLabel = pickRandom(labels);
      return {
        type: 'TAP_TARGET',
        title: `STAGE ${stageNumber}: THE FIRST STEP`,
        instruction: 'TAP THE PULSING ORB',
        failBlurb: 'You missed the circle! Warm up those fingers!',
        targets: [
          {
            id: 'tap-target-1',
            x,
            y,
            size: 68,
            color: '#06b6d4',
            label: pickedLabel,
            textColor: '#000000',
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'AURA_CHECK': {
      return {
        type: 'AURA_CHECK',
        ...getAuraCheckStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'COLOR_TARGET': {
      return {
        type: 'COLOR_TARGET',
        ...getColorTargetStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'BATTERY_PANIC': {
      return {
        type: 'BATTERY_PANIC',
        ...getBatteryPanicStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'BUBBLE_WRAP': {
      const positions = shuffle([
        { x: 32, y: 40 },
        { x: 68, y: 40 },
        { x: 32, y: 60 },
        { x: 68, y: 60 },
      ]);
      return {
        type: 'BUBBLE_WRAP',
        title: `STAGE ${stageNumber}: BUBBLE POPPER`,
        instruction: 'POP ALL 4 PACKAGING BUBBLES QUICKLY!',
        failBlurb: 'Left unpopped bubbles on the sheet! Pop them all!',
        targets: positions.map((p, idx) => ({
          id: `bubble-${idx + 1}`,
          x: p.x,
          y: p.y,
          size: 56,
          color: '#38bdf8',
          label: '🫧',
          textColor: '#000000',
          isCorrect: true,
        })),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'WIFI_HUNT': {
      return {
        type: 'WIFI_HUNT',
        ...getWifiHuntStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'CAT_MEME': {
      return {
        type: 'CAT_MEME',
        ...getCatMemeStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'AUTOCORRECT_RESCUE': {
      return {
        type: 'AUTOCORRECT_RESCUE',
        ...getAutocorrectStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'MICROWAVE_STOP': {
      return {
        type: 'MICROWAVE_STOP',
        ...getMicrowaveStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'DONT_TAP': {
      return {
        type: 'DONT_TAP',
        title: `STAGE ${stageNumber}: HOLD YOUR HORSES!`,
        instruction: 'DO NOT TOUCH THE SCREEN! (WAIT FOR TIMER)',
        failBlurb: 'You touched the screen! The test specifically said DO NOT TOUCH!',
        mustSurviveDuration: true,
        targets: [
          {
            id: 'dont-tap-mine',
            x: 50,
            y: 50,
            size: 80,
            color: '#dc2626',
            label: '⚠️ DO NOT TOUCH',
            subtitle: 'HOLD STILL FOR TIMER',
            textColor: '#ffffff',
            isCorrect: false,
          },
        ],
        durationMs: 3000,
        startTime: Date.now(),
      };
    }

    // -----------------------------------------------------------
    // TIER 2: MEDIUM (Stages 11-20)
    // -----------------------------------------------------------
    case 'CAP_OR_NO_CAP': {
      return {
        type: 'CAP_OR_NO_CAP',
        ...getCapOrNoCapStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'PET_PEEVE': {
      return {
        type: 'PET_PEEVE',
        ...getPetPeeveStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'ALARM_SNOOZE': {
      return {
        type: 'ALARM_SNOOZE',
        ...getAlarmSnoozeStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'WATER_3AM': {
      return {
        type: 'WATER_3AM',
        ...getWater3AMStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'CAPTCHA_BOT': {
      return {
        type: 'CAPTCHA_BOT',
        ...getCaptchaStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'EMOTIONAL_DAMAGE': {
      return {
        type: 'EMOTIONAL_DAMAGE',
        ...getEmotionalDamageStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'RIZZ_CHECK': {
      return {
        type: 'RIZZ_CHECK',
        ...getRizzCheckStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'UNSUBSCRIBE_NINJA': {
      return {
        type: 'UNSUBSCRIBE_NINJA',
        ...getUnsubscribeStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'IMPOSTOR': {
      return {
        type: 'IMPOSTOR',
        ...getImpostorStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'OVERTHINKING': {
      return {
        type: 'OVERTHINKING',
        ...getOverthinkingStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    // -----------------------------------------------------------
    // TIER 3: HARD (Stages 21-35)
    // -----------------------------------------------------------
    case 'PIN_CRACK': {
      // Shuffle physical positions of the four buttons on screen
      const shuffledPositions = shuffle([
        { x: 26, y: 50 },
        { x: 42, y: 50 },
        { x: 58, y: 50 },
        { x: 74, y: 50 },
      ]);

      const numbers = [1, 2, 3, 4];
      return {
        type: 'PIN_CRACK',
        title: `STAGE ${stageNumber}: UNLOCK PASSCODE`,
        instruction: 'ENTER PIN IN ORDER: 1 ➔ 2 ➔ 3 ➔ 4',
        failBlurb: 'Wrong passcode order! iPhone locked for 48,000 hours!',
        targets: numbers.map((num, idx) => ({
          id: `pin-${num}`,
          x: shuffledPositions[idx].x,
          y: shuffledPositions[idx].y,
          size: 54,
          color: '#334155',
          label: `${num}`,
          textColor: '#ffffff',
          stepNumber: num,
          isCorrect: num === 1,
        })),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'ELEVATOR_DOOR': {
      return {
        type: 'ELEVATOR_DOOR',
        ...getElevatorStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'MOVING_TARGET': {
      const startX = 30 + Math.random() * 40;
      const startY = 35 + Math.random() * 30;
      const speed = 1.8 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      return {
        type: 'MOVING_TARGET',
        title: `STAGE ${stageNumber}: KINETIC INTERCEPT`,
        instruction: 'INTERCEPT THE MOVING TARGET!',
        failBlurb: 'You swung and missed! Read the target trajectory!',
        targets: [
          {
            id: 'moving-orb',
            x: startX,
            y: startY,
            size: 58,
            color: '#a855f7',
            label: '🎯',
            textColor: '#ffffff',
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'QUICK_MATH': {
      return {
        type: 'QUICK_MATH',
        ...getQuickMathStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'USB_ORIENTATION': {
      return {
        type: 'USB_ORIENTATION',
        ...getUsbStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'SPOILER_ALERT': {
      return {
        type: 'SPOILER_ALERT',
        ...getSpoilerStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'SHRINKING_TARGET': {
      const x = 35 + Math.random() * 30;
      const y = 35 + Math.random() * 30;
      return {
        type: 'SHRINKING_TARGET',
        title: `STAGE ${stageNumber}: QUANTUM COMPRESSION`,
        instruction: 'TAP BEFORE THE TARGET EVAPORATES TO ZERO!',
        failBlurb: 'Target collapsed into nothingness before you could touch it!',
        targets: [
          {
            id: 'shrinking-orb',
            x,
            y,
            size: 85,
            color: '#f43f5e',
            label: 'TAP QUICK!',
            textColor: '#ffffff',
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'OPPOSITE_DAY': {
      return {
        type: 'OPPOSITE_DAY',
        ...getOppositeDayStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'SNEEZING_HOLD': {
      return {
        type: 'SNEEZING_HOLD',
        ...getSneezingHoldStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'STROOP_LIAR': {
      return {
        type: 'STROOP_LIAR',
        ...getStroopStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'PHONE_DROP': {
      const phoneModels = ['📱 IPHONE 15 PRO', '📱 GALAXY ULTRA', '📱 PIXEL 9 PRO', '📱 BRAND NEW PHONE'];
      const chosenPhone = pickRandom(phoneModels);
      const startX = 35 + Math.random() * 30;
      const speed = 2.0 + Math.random() * 0.7;
      return {
        type: 'PHONE_DROP',
        title: `STAGE ${stageNumber}: FUMBLED PHONE!`,
        instruction: `${chosenPhone} SLIPPED! CATCH IT MID-AIR!`,
        failBlurb: 'CRACK! Screen shattered into 10,000 spiderweb pieces!',
        targets: [
          {
            id: 'falling-phone',
            x: startX,
            y: 32,
            size: 64,
            color: '#06b6d4',
            label: '📱 CATCH!',
            subtitle: chosenPhone,
            textColor: '#000000',
            vx: 0,
            vy: speed,
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'MATH_MISDIRECTION': {
      return {
        type: 'MATH_MISDIRECTION',
        ...getMathMisdirectionStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'LOW_STORAGE': {
      return {
        type: 'LOW_STORAGE',
        ...getLowStorageStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'SHY_TELEPORT': {
      const startPositions = [
        { x: 35, y: 35 },
        { x: 65, y: 35 },
        { x: 35, y: 65 },
        { x: 65, y: 65 },
      ];
      const startPos = pickRandom(startPositions);
      return {
        type: 'SHY_TELEPORT',
        title: `STAGE ${stageNumber}: QUANTUM SHY ORB`,
        instruction: 'TAP THE TARGET! (IT WILL TELEPORT 2 TIMES BEFORE VULNERABLE)',
        failBlurb: 'Too slow! The teleporting orb escaped your grasp!',
        subState: 'FIRST_POS',
        targets: [
          {
            id: 'shy-orb',
            x: startPos.x,
            y: startPos.y,
            size: 60,
            color: '#f59e0b',
            label: '💨 FLEE',
            subtitle: 'SHY TARGET',
            textColor: '#000000',
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'MULTI_TAP': {
      const requiredTaps = Math.floor(Math.random() * 3) + 5; // 5, 6, or 7 taps
      return {
        type: 'MULTI_TAP',
        title: `STAGE ${stageNumber}: ADRENALINE HYPER-MASH`,
        instruction: `MASH THE BUTTON ${requiredTaps} TIMES AS FAST AS POSSIBLE!`,
        failBlurb: 'Finger fatigue! You failed to mash fast enough!',
        targets: [
          {
            id: 'multi-tap-btn',
            x: 50,
            y: 50,
            size: 80,
            color: '#ef4444',
            label: `MASH! 0/${requiredTaps}`,
            subtitle: `${requiredTaps} RAPID TAPS REQUIRED`,
            textColor: '#ffffff',
            tapsRemaining: requiredTaps,
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    // -----------------------------------------------------------
    // TIER 4: EXTREME (Stages 36-45)
    // -----------------------------------------------------------
    case 'DISCORD_PING': {
      return {
        type: 'DISCORD_PING',
        ...getDiscordPingStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'PHANTOM_VIBRATION': {
      return {
        type: 'PHANTOM_VIBRATION',
        ...getPhantomVibrationStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'SPEED_TYPO': {
      return {
        type: 'SPEED_TYPO',
        ...getSpeedTypoStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'CHOPSTICKS_GRAB': {
      const foods = [
        { name: '🥟 DUMPLING', fail: 'The dumpling slipped into boiling soup!' },
        { name: '🍣 SASHIMI', fail: 'The slippery tuna sashimi fell off the table!' },
        { name: '🍤 TEMPURA', fail: 'The crispy tempura snapped and flew away!' },
        { name: '🧆 EDAMAME', fail: 'The edamame bean launched across the room!' },
      ];
      const pickedFood = pickRandom(foods);
      const speedX = (1.8 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
      const speedY = (1.8 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
      return {
        type: 'CHOPSTICKS_GRAB',
        title: `STAGE ${stageNumber}: CHOPSTICK MASTER`,
        instruction: `SNATCH THE SLIPPERY ${pickedFood.name} WITH CHOPSTICKS!`,
        failBlurb: pickedFood.fail,
        targets: [
          {
            id: 'chop-food',
            x: 50,
            y: 48,
            size: 60,
            color: '#f59e0b',
            label: pickedFood.name,
            textColor: '#000000',
            vx: speedX,
            vy: speedY,
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'ODD_ONE_OUT': {
      return {
        type: 'ODD_ONE_OUT',
        ...getOddOneOutStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'MIRROR_TAP': {
      const invertRight = Math.random() > 0.5;
      return {
        type: 'MIRROR_TAP',
        title: `STAGE ${stageNumber}: INVERTED MIRROR`,
        instruction: invertRight
          ? 'INVERTED REALM: TO HIT THE LEFT TARGET, TAP OPPOSITE (RIGHT)!'
          : 'INVERTED REALM: TO HIT THE RIGHT TARGET, TAP OPPOSITE (LEFT)!',
        failBlurb: 'Brain cross-wired! Inverted controls tricked your instinct!',
        targets: [
          {
            id: 'mirror-right',
            x: 70,
            y: 50,
            size: 68,
            color: '#0284c7',
            label: '👉 RIGHT BUTTON',
            subtitle: 'INVERTS DIRECTION',
            textColor: '#ffffff',
            isCorrect: invertRight,
          },
          {
            id: 'mirror-left',
            x: 30,
            y: 50,
            size: 68,
            color: '#0284c7',
            label: '👈 LEFT BUTTON',
            subtitle: 'INVERTS DIRECTION',
            textColor: '#ffffff',
            isCorrect: !invertRight,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'RGB_COLOR_BLIND': {
      return {
        type: 'RGB_COLOR_BLIND',
        ...getRgbCountingStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'TIKTOK_SCROLL': {
      return {
        type: 'TIKTOK_SCROLL',
        ...getTiktokScrollStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'SEQUENCE': {
      const positions = shuffle([
        { x: 30, y: 44 },
        { x: 70, y: 44 },
        { x: 50, y: 62 },
      ]);
      const numbers = [1, 2, 3];
      return {
        type: 'SEQUENCE',
        title: `STAGE ${stageNumber}: MEMORY SEQUENCE`,
        instruction: 'TAP NUMBERS IN SEQUENCE: 1 ➔ 2 ➔ 3',
        failBlurb: 'Sequence broken! Follow the numerical order 1 ➔ 2 ➔ 3!',
        targets: numbers.map((num, idx) => ({
          id: `seq-${num}`,
          x: positions[idx].x,
          y: positions[idx].y,
          size: 58,
          color: '#334155',
          label: `${num}`,
          textColor: '#ffffff',
          stepNumber: num,
          isCorrect: num === 1,
        })),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'REACTION': {
      const delay = Math.floor(Math.random() * 1000) + 1200; // 1200ms to 2200ms
      return {
        type: 'REACTION',
        title: `STAGE ${stageNumber}: RED LIGHT GREEN LIGHT`,
        instruction: 'WAIT FOR SIGNAL TO TURN GREEN, THEN TAP IMMEDIATELY!',
        failBlurb: 'False start! Tapped while signal was still red!',
        subState: 'WAIT',
        targets: [
          {
            id: 'traffic-signal',
            x: 50,
            y: 50,
            size: 80,
            color: '#ef4444',
            label: '🛑 WAIT...',
            subtitle: 'DO NOT TAP RED',
            textColor: '#ffffff',
            isCorrect: false,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    // -----------------------------------------------------------
    // TIER 5: INSANE (Stages 46-50)
    // -----------------------------------------------------------
    case 'REVERSE_PSYCH': {
      const forbiddenLabels = [
        '⚠️ DO NOT PRESS',
        '⛔ FORBIDDEN BUTTON',
        '🚫 DO NOT TOUCH',
        '🛑 DON\'T YOU DARE',
      ];
      const pickedForbidden = pickRandom(forbiddenLabels);
      return {
        type: 'REVERSE_PSYCH',
        title: `STAGE ${stageNumber}: REVERSE PSYCHOLOGY`,
        instruction: 'HOLD STILL! DO NOT TOUCH THE FORBIDDEN BUTTON!',
        failBlurb: 'Fell for the reverse psychology trap! You touched the forbidden button!',
        mustSurviveDuration: true,
        targets: [
          {
            id: 'reverse-psych-btn',
            x: 50,
            y: 50,
            size: 80,
            color: '#dc2626',
            label: pickedForbidden,
            subtitle: 'HOLD STILL TO WIN',
            textColor: '#ffffff',
            isCorrect: false,
          },
        ],
        durationMs: 3000,
        startTime: Date.now(),
      };
    }

    case 'CHAOS_SHUFFLE': {
      return {
        type: 'CHAOS_SHUFFLE',
        ...getChaosShuffleStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'HIGH_STAKES_BOMB': {
      return {
        type: 'HIGH_STAKES_BOMB',
        ...getBombWireStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'QUANTUM_DECISION': {
      return {
        type: 'QUANTUM_DECISION',
        ...getQuantumDecisionStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    case 'FINAL_BOSS_REFLEX': {
      return {
        type: 'FINAL_BOSS_REFLEX',
        ...getFinalBossStage(stageNumber),
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }

    default: {
      return {
        type: 'TAP_TARGET',
        title: `STAGE ${stageNumber}: TAP CHALLENGE`,
        instruction: 'TAP THE TARGET',
        targets: [
          {
            id: 'fallback-target',
            x: 50,
            y: 50,
            size: 64,
            color: '#06b6d4',
            label: 'TAP!',
            textColor: '#000000',
            isCorrect: true,
          },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
    }
  }
}
