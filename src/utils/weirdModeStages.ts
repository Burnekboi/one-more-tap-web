import { ActiveChallenge, ChallengeType, TargetItem } from '../types';

export const WEIRD_MODE_STAGE_COUNT = 24;
export const CRAZY_MODE_STAGE_COUNT = 50;

/**
 * 24 Weird Mode Core Mechanics (Pure Colors & Pure Numbers - No Hints):
 *
 * Initial 8 Core Mechanics (Starts from 8):
 * 1. TAP_TARGET: Pure colored circle in center. Tap to clear.
 * 2. COLOR_TARGET: 4 pure colored circles (Red, Green, Blue, Yellow). Tap the requested color.
 * 3. DONT_TAP: Single red circle with 1.5s countdown gauge. Do not touch.
 * 4. MOVING_TARGET: Single moving blue circle gliding across the screen. Catch and tap.
 * 5. SHRINKING_TARGET: Single purple circle shrinking over time. Tap before it disappears.
 * 6. MULTI_TAP: Single amber circle requiring 5 rapid taps (5 -> 4 -> 3 -> 2 -> 1).
 * 7. SEQUENCE: 3 circles with standard numbers (1, 2, 3). Tap in numerical order.
 * 8. REACTION: Red circle waiting, suddenly turns pure green. Tap fast on green.
 *
 * Added 7 Core Mechanics (Later we add 7):
 * 9. TRIPLE_COLOR_RULE: Red, Green, Blue circles (colors only).
 * 10. FLOATING_BUBBLE: 10 blue circles, 1 floating upwards, 9 falling.
 * 11. IMPOSTOR_FINDER: 5 circles with emojis, only 1 is different.
 * 12. CATCH_ME_RED: 5 blue circles moving, one turns red for 1.5s.
 * 13. CONFUSION_TAP: Red, Blue, Green circles (colors only, taps countdown).
 * 14. GHOST_CIRCLE: 50 light-blue circles, only 1 fading ghost.
 * 15. TOUCH_SPACE: 1 blue circle in center (tap empty space, not circle).
 *
 * Added 9 Core Mechanics (Latest we add 9):
 * 16. ODD_NUMBER_HUNT: 5 circles with numbers, 1 is odd.
 * 17. EAT_VEGETABLES: 10 circles (5 red, 2 blue, 3 green). Tap greens only.
 * 18. TAP_BEFORE_EXPLODE: 5 circles (3 shrinking, 2 exploding in 3s).
 * 19. DONT_EAT_VEGETABLES: 10 circles (5 red, 2 blue, 3 green). Tap red & blue, avoid green.
 * 20. WASD_JUMP: 5 circles (W, A, S, D, SPACE).
 * 21. GREEN_MEANS_STOP: 3 circles (Red, Orange, Green).
 * 22. WASD_WALK: 5 circles (W, A, S, D, SPACE).
 * 23. HIT_ME_BABY_ONE: 3 circles (1, 2, 3).
 * 24. TAP_THE_TOP: 3 circles moving upwards at different speeds.
 */

export const WEIRD_MODE_PROGRESSION: ChallengeType[] = [
  // Original 8 Core Mechanics (1-8)
  'TAP_TARGET',
  'COLOR_TARGET',
  'DONT_TAP',
  'MOVING_TARGET',
  'SHRINKING_TARGET',
  'MULTI_TAP',
  'SEQUENCE',
  'REACTION',

  // 7 Added Core Mechanics (9-15)
  'TRIPLE_COLOR_RULE',
  'FLOATING_BUBBLE',
  'IMPOSTOR_FINDER',
  'CATCH_ME_RED',
  'CONFUSION_TAP',
  'GHOST_CIRCLE',
  'TOUCH_SPACE',

  // 9 Latest Added Core Mechanics (16-24)
  'ODD_NUMBER_HUNT',
  'EAT_VEGETABLES',
  'TAP_BEFORE_EXPLODE',
  'DONT_EAT_VEGETABLES',
  'WASD_JUMP',
  'GREEN_MEANS_STOP',
  'WASD_WALK',
  'HIT_ME_BABY_ONE',
  'TAP_THE_TOP',
];

// Helper: 50 Lightblue Circles for Ghost Hunt
function createGhostSwarm(ghostIndex: number, count: number = 50): TargetItem[] {
  const targets: TargetItem[] = [];
  const rows = 10;
  const cols = 5;

  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const baseX = 14 + (c / (cols - 1)) * 72;
    const baseY = 14 + (r / (rows - 1)) * 72;
    const jitterX = Math.sin(i * 997) * 4;
    const jitterY = Math.cos(i * 733) * 4;
    const isGhost = i === ghostIndex;

    targets.push({
      id: `ghost-swarm-${i}`,
      x: Math.max(10, Math.min(90, baseX + jitterX)),
      y: Math.max(12, Math.min(88, baseY + jitterY)),
      size: 24,
      color: isGhost ? '#38bdf8' : '#7dd3fc',
      isGhost,
      isCorrect: isGhost,
      opacity: 1,
      vx: Math.sin(i * 1.5) * 0.06,
      vy: Math.cos(i * 2.1) * 0.06,
    });
  }
  return targets;
}

export function generateWeirdModeStage(stageIndex: number): ActiveChallenge {
  const stageNumber = Math.min(24, Math.max(1, stageIndex + 1));
  const timeLimit = 10000;

  switch (stageNumber) {
    // ----------------------------------------------------
    // CORE 1: Tap Target (Pure Color, No Clue)
    // ----------------------------------------------------
    case 1:
      return {
        type: 'TAP_TARGET',
        title: 'STAGE 1',
        instruction: 'TAP THE CIRCLE',
        failBlurb: 'You missed the circle! Warm up those fingers!',
        targets: [
          { id: 'weird-1-tap', x: 50, y: 50, size: 76, color: '#06b6d4', isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 2: Color Target (Pure Colors, No Clue Labels)
    // ----------------------------------------------------
    case 2:
      return {
        type: 'COLOR_TARGET',
        title: 'STAGE 2',
        instruction: 'TAP THE BLUE CIRCLE',
        failBlurb: 'Wrong color! Tap only the BLUE circle!',
        targets: [
          { id: 'weird-2-red', x: 28, y: 38, size: 68, color: '#ef4444', isDanger: true },
          { id: 'weird-2-green', x: 72, y: 38, size: 68, color: '#22c55e', isDanger: true },
          { id: 'weird-2-blue', x: 28, y: 64, size: 68, color: '#3b82f6', isCorrect: true },
          { id: 'weird-2-yellow', x: 72, y: 64, size: 68, color: '#eab308', isDanger: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 3: Don't Tap (1.5s Hold Still)
    // ----------------------------------------------------
    case 3:
      return {
        type: 'DONT_TAP',
        title: 'STAGE 3',
        instruction: 'DO NOT TAP!',
        failBlurb: 'Impulsive touch! You were explicitly instructed DO NOT TAP!',
        targets: [
          { id: 'weird-3-danger', x: 50, y: 50, size: 84, color: '#ef4444', isDanger: true },
        ],
        durationMs: 1500,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 4: Moving Target (Pure Color Gliding)
    // ----------------------------------------------------
    case 4:
      return {
        type: 'MOVING_TARGET',
        title: 'STAGE 4',
        instruction: 'TAP THE MOVING CIRCLE',
        failBlurb: 'You missed the moving circle!',
        targets: [
          { id: 'weird-4-moving', x: 28, y: 48, size: 68, color: '#3b82f6', vx: 0.28, vy: -0.22, isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 5: Shrinking Target (Pure Color Vanishing)
    // ----------------------------------------------------
    case 5:
      return {
        type: 'SHRINKING_TARGET',
        title: 'STAGE 5',
        instruction: 'TAP BEFORE IT SHRINKS AWAY',
        failBlurb: 'Too slow! The circle vanished before you tapped it!',
        targets: [
          { id: 'weird-5-shrink', x: 50, y: 50, size: 82, color: '#8b5cf6', isShrinking: true, isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 6: Multi-Tap (Pure Numbers 5 -> 1)
    // ----------------------------------------------------
    case 6:
      return {
        type: 'MULTI_TAP',
        title: 'STAGE 6',
        instruction: 'TAP 5 TIMES RAPIDLY',
        failBlurb: 'Too slow! Tap 5 times quickly!',
        targets: [
          { id: 'weird-6-multi', x: 50, y: 50, size: 84, color: '#f59e0b', label: '5', textColor: '#ffffff', tapsRemaining: 5, isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 7: Sequence (Clean Numbers 1 -> 2 -> 3)
    // ----------------------------------------------------
    case 7:
      return {
        type: 'SEQUENCE',
        title: 'STAGE 7',
        instruction: 'TAP IN ORDER: 1, 2, 3',
        failBlurb: 'Wrong sequence! Tap 1, then 2, then 3!',
        targets: [
          { id: 'weird-7-s1', x: 26, y: 50, size: 76, color: '#16a34a', label: '1', textColor: '#ffffff', stepNumber: 1, isCorrect: true },
          { id: 'weird-7-s2', x: 50, y: 50, size: 76, color: '#334155', label: '2', textColor: '#ffffff', stepNumber: 2, isCorrect: false },
          { id: 'weird-7-s3', x: 74, y: 50, size: 76, color: '#334155', label: '3', textColor: '#ffffff', stepNumber: 3, isCorrect: false },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 8: Reaction (Red Waits, Flips to Green)
    // ----------------------------------------------------
    case 8:
      return {
        type: 'REACTION',
        title: 'STAGE 8',
        instruction: 'WAIT FOR GREEN, THEN TAP!',
        failBlurb: 'You tapped before it turned green! Wait for green!',
        subState: 'WAIT',
        targets: [
          { id: 'weird-8-wait', x: 50, y: 50, size: 78, color: '#ef4444', isCorrect: false },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 9: Triple Color Rule (Red, Green, Blue)
    // ----------------------------------------------------
    case 9:
      return {
        type: 'TRIPLE_COLOR_RULE',
        title: 'STAGE 9',
        instruction: 'TAP RED, DON\'T TAP GREEN, TAP BLUE',
        failBlurb: 'You touched GREEN! The rule is: TAP RED, DON\'T TAP GREEN, TAP BLUE!',
        targets: [
          { id: 'weird-9-red', x: 24, y: 50, size: 76, color: '#ef4444', isCorrect: true },
          { id: 'weird-9-green', x: 50, y: 50, size: 76, color: '#22c55e', isDanger: true },
          { id: 'weird-9-blue', x: 76, y: 50, size: 76, color: '#3b82f6', isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 10: Catch the Floating Bubble (1 up, 9 down)
    // ----------------------------------------------------
    case 10:
      return {
        type: 'FLOATING_BUBBLE',
        title: 'STAGE 10',
        instruction: 'CATCH THE FLOATING BUBBLE',
        failBlurb: 'That bubble was falling down! Catch the one floating UP!',
        targets: [
          { id: 'fb-down-1', x: 18, y: 20, size: 52, color: '#38bdf8', vy: 0.22, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-2', x: 42, y: 15, size: 48, color: '#0284c7', vy: 0.26, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-3', x: 74, y: 25, size: 54, color: '#38bdf8', vy: 0.20, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-4', x: 28, y: 40, size: 50, color: '#0ea5e9', vy: 0.24, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-5', x: 62, y: 38, size: 52, color: '#0284c7', vy: 0.28, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-6', x: 84, y: 55, size: 46, color: '#38bdf8', vy: 0.22, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-7', x: 20, y: 70, size: 54, color: '#0ea5e9', vy: 0.25, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-8', x: 78, y: 75, size: 50, color: '#0284c7', vy: 0.21, isFloatingUp: false, isCorrect: false },
          { id: 'fb-down-9', x: 50, y: 65, size: 52, color: '#38bdf8', vy: 0.27, isFloatingUp: false, isCorrect: false },
          { id: 'fb-up-winner', x: 48, y: 82, size: 60, color: '#60a5fa', vy: -0.32, isFloatingUp: true, isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 11: Who's the impostor? (5 emojis, 1 different)
    // ----------------------------------------------------
    case 11:
      return {
        type: 'IMPOSTOR_FINDER',
        title: 'STAGE 11',
        instruction: 'WHO\'S THE IMPOSTOR?',
        failBlurb: 'Wrong emoji! Look closely for the one with disguise/mask!',
        targets: [
          { id: 'imp-1', x: 20, y: 35, size: 68, color: '#f59e0b', emoji: '😀', isCorrect: false },
          { id: 'imp-2', x: 80, y: 35, size: 68, color: '#f59e0b', emoji: '😀', isCorrect: false },
          { id: 'imp-3', x: 50, y: 50, size: 68, color: '#f59e0b', emoji: '😀', isCorrect: false },
          { id: 'imp-4', x: 30, y: 68, size: 68, color: '#f59e0b', emoji: '😀', isCorrect: false },
          { id: 'imp-winner', x: 70, y: 68, size: 68, color: '#f59e0b', emoji: '🥸', isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 12: Catch me, If you can! (Flash Red)
    // ----------------------------------------------------
    case 12:
      return {
        type: 'CATCH_ME_RED',
        title: 'STAGE 12',
        instruction: 'CATCH ME, IF YOU CAN!',
        failBlurb: 'It was BLUE! Catch it only when it turns RED!',
        targets: [
          { id: 'catch-1', x: 50, y: 18, size: 64, color: '#3b82f6', vy: -0.22, isRed: false, isCorrect: false },
          { id: 'catch-2', x: 50, y: 36, size: 64, color: '#ef4444', vy: -0.22, isRed: true, isCorrect: true },
          { id: 'catch-3', x: 50, y: 54, size: 64, color: '#3b82f6', vy: -0.22, isRed: false, isCorrect: false },
          { id: 'catch-4', x: 50, y: 72, size: 64, color: '#3b82f6', vy: -0.22, isRed: false, isCorrect: false },
          { id: 'catch-5', x: 50, y: 90, size: 64, color: '#3b82f6', vy: -0.22, isRed: false, isCorrect: false },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 13: Confusion Tap (Red 3x, Blue 2x, Green Next)
    // ----------------------------------------------------
    case 13:
      return {
        type: 'CONFUSION_TAP',
        title: 'STAGE 13',
        instruction: 'TAP RED 3x, TAP BLUE 2x AND TAP GREEN ON THE NEXT STAGE',
        failBlurb: 'You tapped GREEN! Green was for NEXT stage!',
        targets: [
          { id: 'conf-red', x: 25, y: 50, size: 78, color: '#ef4444', tapsRemaining: 3, isCorrect: true },
          { id: 'conf-blue', x: 50, y: 50, size: 78, color: '#3b82f6', tapsRemaining: 2, isCorrect: true },
          { id: 'conf-green', x: 75, y: 50, size: 78, color: '#22c55e', isDanger: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 14: Find the Ghost (50 light-blue, 1 ghost)
    // ----------------------------------------------------
    case 14:
      return {
        type: 'GHOST_CIRCLE',
        title: 'STAGE 14',
        instruction: 'FIND THE GHOST!',
        failBlurb: 'That wasn\'t the ghost! Look for the one fading in and out!',
        targets: createGhostSwarm(23, 50),
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 15: Touch Space (Tap empty space, not circle)
    // ----------------------------------------------------
    case 15:
      return {
        type: 'TOUCH_SPACE',
        title: 'STAGE 15',
        instruction: 'TOUCH SPACE!',
        failBlurb: 'You touched the circle! The instruction said TOUCH SPACE!',
        targets: [
          { id: 'space-circle', x: 50, y: 50, size: 88, color: '#3b82f6', isDanger: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 16: I am not even! (Odd number hunt)
    // ----------------------------------------------------
    case 16:
      return {
        type: 'ODD_NUMBER_HUNT',
        title: 'STAGE 16',
        instruction: 'I AM NOT EVEN!',
        failBlurb: 'That is an EVEN number! I am not even—tap the ODD number!',
        targets: [
          { id: 'odd-2', x: 18, y: 38, size: 72, color: '#8b5cf6', label: '2', textColor: '#ffffff', isCorrect: false },
          { id: 'odd-4', x: 42, y: 34, size: 72, color: '#8b5cf6', label: '4', textColor: '#ffffff', isCorrect: false },
          { id: 'odd-8', x: 78, y: 38, size: 72, color: '#8b5cf6', label: '8', textColor: '#ffffff', isCorrect: false },
          { id: 'odd-12', x: 30, y: 66, size: 72, color: '#8b5cf6', label: '12', textColor: '#ffffff', isCorrect: false },
          { id: 'odd-7', x: 68, y: 66, size: 72, color: '#8b5cf6', label: '7', textColor: '#ffffff', isOdd: true, isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 17: Eat Vegetables (Only tap green circles)
    // ----------------------------------------------------
    case 17:
      return {
        type: 'EAT_VEGETABLES',
        title: 'STAGE 17',
        instruction: 'BE HEALTHY, EAT ONLY VEGETABLES',
        failBlurb: 'You tapped junk food! Be healthy, tap only the GREEN circles!',
        targets: [
          { id: 'v-r1', x: 16, y: 24, size: 54, color: '#ef4444', isDanger: true },
          { id: 'v-r2', x: 48, y: 22, size: 54, color: '#ef4444', isDanger: true },
          { id: 'v-r3', x: 82, y: 24, size: 54, color: '#ef4444', isDanger: true },
          { id: 'v-r4', x: 20, y: 48, size: 54, color: '#ef4444', isDanger: true },
          { id: 'v-r5', x: 80, y: 48, size: 54, color: '#ef4444', isDanger: true },
          { id: 'v-b1', x: 20, y: 74, size: 54, color: '#3b82f6', isDanger: true },
          { id: 'v-b2', x: 80, y: 74, size: 54, color: '#3b82f6', isDanger: true },
          { id: 'v-g1', x: 50, y: 48, size: 66, color: '#22c55e', isCorrect: true },
          { id: 'v-g2', x: 34, y: 74, size: 66, color: '#22c55e', isCorrect: true },
          { id: 'v-g3', x: 66, y: 74, size: 66, color: '#22c55e', isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 18: Tap before it explodes! (3s countdown)
    // ----------------------------------------------------
    case 18:
      return {
        type: 'TAP_BEFORE_EXPLODE',
        title: 'STAGE 18',
        instruction: 'TAP BEFORE IT EXPLODES!',
        failBlurb: '💥 BOOM! The circle exploded within 3 seconds!',
        targets: [
          { id: 'exp-s1', x: 24, y: 35, size: 64, color: '#64748b', isShrinking: true, isCorrect: false },
          { id: 'exp-s2', x: 76, y: 35, size: 64, color: '#64748b', isShrinking: true, isCorrect: false },
          { id: 'exp-s3', x: 50, y: 50, size: 64, color: '#64748b', isShrinking: true, isCorrect: false },
          { id: 'exp-b1', x: 28, y: 68, size: 76, color: '#f97316', isExploding: true, isCorrect: true },
          { id: 'exp-b2', x: 72, y: 68, size: 76, color: '#f97316', isExploding: true, isCorrect: true },
        ],
        durationMs: 3000,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 19: Don't eat the vegetables! (Avoid green)
    // ----------------------------------------------------
    case 19:
      return {
        type: 'DONT_EAT_VEGETABLES',
        title: 'STAGE 19',
        instruction: 'DON\'T EAT THE VEGETABLES!',
        failBlurb: 'You ate a vegetable! Avoid the greens!',
        targets: [
          { id: 'dv-r1', x: 16, y: 24, size: 54, color: '#ef4444', isCorrect: true },
          { id: 'dv-r2', x: 50, y: 22, size: 54, color: '#ef4444', isCorrect: true },
          { id: 'dv-r3', x: 84, y: 24, size: 54, color: '#ef4444', isCorrect: true },
          { id: 'dv-r4', x: 20, y: 48, size: 54, color: '#ef4444', isCorrect: true },
          { id: 'dv-r5', x: 80, y: 48, size: 54, color: '#ef4444', isCorrect: true },
          { id: 'dv-b1', x: 20, y: 74, size: 54, color: '#3b82f6', isCorrect: true },
          { id: 'dv-b2', x: 80, y: 74, size: 54, color: '#3b82f6', isCorrect: true },
          { id: 'dv-g1', x: 50, y: 48, size: 66, color: '#22c55e', isDanger: true },
          { id: 'dv-g2', x: 35, y: 72, size: 66, color: '#22c55e', isDanger: true },
          { id: 'dv-g3', x: 65, y: 72, size: 66, color: '#22c55e', isDanger: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 20: Jump! (WASD & Space - Tap Space)
    // ----------------------------------------------------
    case 20:
      return {
        type: 'WASD_JUMP',
        title: 'STAGE 20',
        instruction: 'JUMP!',
        failBlurb: 'Wrong key! Tap SPACE to Jump!',
        targets: [
          { id: 'j-w', x: 26, y: 35, size: 64, color: '#334155', label: 'W', textColor: '#ffffff', isCorrect: false },
          { id: 'j-a', x: 74, y: 35, size: 64, color: '#334155', label: 'A', textColor: '#ffffff', isCorrect: false },
          { id: 'j-sp', x: 50, y: 50, size: 84, color: '#0284c7', label: 'SPACE', textColor: '#ffffff', isCorrect: true },
          { id: 'j-s', x: 26, y: 68, size: 64, color: '#334155', label: 'S', textColor: '#ffffff', isCorrect: false },
          { id: 'j-d', x: 74, y: 68, size: 64, color: '#334155', label: 'D', textColor: '#ffffff', isCorrect: false },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 21: Green means go, but Stop! (Tap Red)
    // ----------------------------------------------------
    case 21:
      return {
        type: 'GREEN_MEANS_STOP',
        title: 'STAGE 21',
        instruction: 'GREEN MEANS GO, BUT STOP!',
        failBlurb: 'Green means go, BUT STOP! Tap RED!',
        targets: [
          { id: 't-g', x: 26, y: 50, size: 76, color: '#22c55e', isCorrect: false },
          { id: 't-o', x: 50, y: 50, size: 76, color: '#f97316', isCorrect: false },
          { id: 't-r', x: 74, y: 50, size: 76, color: '#ef4444', isCorrect: true },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 22: Walk Forward! (WASD & Space - Tap W)
    // ----------------------------------------------------
    case 22:
      return {
        type: 'WASD_WALK',
        title: 'STAGE 22',
        instruction: 'WALK FORWARD!',
        failBlurb: 'Wrong key! Tap W to walk forward!',
        targets: [
          { id: 'w-w', x: 50, y: 28, size: 74, color: '#10b981', label: 'W', textColor: '#ffffff', isCorrect: true },
          { id: 'w-a', x: 26, y: 52, size: 64, color: '#334155', label: 'A', textColor: '#ffffff', isCorrect: false },
          { id: 'w-s', x: 50, y: 52, size: 64, color: '#334155', label: 'S', textColor: '#ffffff', isCorrect: false },
          { id: 'w-d', x: 74, y: 52, size: 64, color: '#334155', label: 'D', textColor: '#ffffff', isCorrect: false },
          { id: 'w-sp', x: 50, y: 74, size: 84, color: '#334155', label: 'SPACE', textColor: '#ffffff', isCorrect: false },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 23: Hit me baby one more time! (Tap 1)
    // ----------------------------------------------------
    case 23:
      return {
        type: 'HIT_ME_BABY_ONE',
        title: 'STAGE 23',
        instruction: 'HIT ME BABY ONE MORE TIME!',
        failBlurb: 'Oops!... Hit me baby ONE more time! Tap 1!',
        targets: [
          { id: 'h-1', x: 26, y: 50, size: 76, color: '#ec4899', label: '1', textColor: '#ffffff', isCorrect: true },
          { id: 'h-2', x: 50, y: 50, size: 76, color: '#8b5cf6', label: '2', textColor: '#ffffff', isCorrect: false },
          { id: 'h-3', x: 74, y: 50, size: 76, color: '#3b82f6', label: '3', textColor: '#ffffff', isCorrect: false },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };

    // ----------------------------------------------------
    // CORE 24: Tap the Top! (Highest circle on screen)
    // ----------------------------------------------------
    case 24:
    default:
      return {
        type: 'TAP_THE_TOP',
        title: 'STAGE 24',
        instruction: 'TAP THE TOP!',
        failBlurb: 'That wasn\'t the highest circle! Tap the circle closest to the top!',
        targets: [
          { id: 'top-1', x: 26, y: 50, size: 68, color: '#06b6d4', vy: -0.16 },
          { id: 'top-2', x: 50, y: 65, size: 68, color: '#eab308', vy: -0.32 },
          { id: 'top-3', x: 74, y: 80, size: 68, color: '#ec4899', vy: -0.48 },
        ],
        durationMs: timeLimit,
        startTime: Date.now(),
      };
  }
}
