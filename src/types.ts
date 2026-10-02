export type TabType = 'dashboard' | 'prototype' | 'docs' | 'tuning' | 'legal';

export type GameMode = 'WEIRD' | 'CRAZY';

export interface DocumentationSection {
  id: number;
  title: string;
  category: 'Overview' | 'Gameplay' | 'Systems' | 'Architecture' | 'Retention' | 'Production';
  summary: string;
  content: string;
  codeSnippet?: string;
  tags: string[];
}

export enum GameState {
  MENU = 'MENU',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}

export enum TapResult {
  NORMAL = 'NORMAL',
  PERFECT = 'PERFECT',
  MISS = 'MISS',
}

export type ChallengeType =
  | 'TAP_TARGET'
  | 'COLOR_TARGET'
  | 'DONT_TAP'
  | 'MOVING_TARGET'
  | 'SHRINKING_TARGET'
  | 'MULTI_TAP'
  | 'SEQUENCE'
  | 'REACTION'
  | 'PET_PEEVE'
  | 'STROOP_LIAR'
  | 'REVERSE_PSYCH'
  | 'IMPOSTOR'
  | 'OPPOSITE_DAY'
  | 'QUICK_MATH'
  | 'SHY_TELEPORT'
  // 9 Viral & Meme Mechanics
  | 'AURA_CHECK'
  | 'BATTERY_PANIC'
  | 'WIFI_HUNT'
  | 'CAT_MEME'
  | 'AUTOCORRECT_RESCUE'
  | 'CAP_OR_NO_CAP'
  | 'EMOTIONAL_DAMAGE'
  | 'WATER_3AM'
  | 'RIZZ_CHECK'
  // 26 New Mechanics (50 Total Non-Repeating Gauntlet!)
  | 'BUBBLE_WRAP'
  | 'MICROWAVE_STOP'
  | 'ALARM_SNOOZE'
  | 'CAPTCHA_BOT'
  | 'UNSUBSCRIBE_NINJA'
  | 'OVERTHINKING'
  | 'PIN_CRACK'
  | 'ELEVATOR_DOOR'
  | 'USB_ORIENTATION'
  | 'SPOILER_ALERT'
  | 'SNEEZING_HOLD'
  | 'PHONE_DROP'
  | 'MATH_MISDIRECTION'
  | 'LOW_STORAGE'
  | 'DISCORD_PING'
  | 'PHANTOM_VIBRATION'
  | 'SPEED_TYPO'
  | 'CHOPSTICKS_GRAB'
  | 'ODD_ONE_OUT'
  | 'MIRROR_TAP'
  | 'RGB_COLOR_BLIND'
  | 'TIKTOK_SCROLL'
  | 'CHAOS_SHUFFLE'
  | 'HIGH_STAKES_BOMB'
  | 'QUANTUM_DECISION'
  | 'FINAL_BOSS_REFLEX'
  // 7 Weird Mode Core Mechanics (Batch 1)
  | 'TRIPLE_COLOR_RULE'
  | 'FLOATING_BUBBLE'
  | 'IMPOSTOR_FINDER'
  | 'CATCH_ME_RED'
  | 'CONFUSION_TAP'
  | 'GHOST_CIRCLE'
  | 'TOUCH_SPACE'
  // 9 New Weird Mode Core Mechanics (Batch 2)
  | 'ODD_NUMBER_HUNT'
  | 'EAT_VEGETABLES'
  | 'TAP_BEFORE_EXPLODE'
  | 'DONT_EAT_VEGETABLES'
  | 'WASD_JUMP'
  | 'GREEN_MEANS_STOP'
  | 'WASD_WALK'
  | 'HIT_ME_BABY_ONE'
  | 'TAP_THE_TOP';

export interface TargetItem {
  id: string;
  x: number; // 0-100% inside play field
  y: number; // 0-100% inside play field
  size: number; // pixels
  color: string;
  label?: string;
  subtitle?: string;
  textColor?: string;
  isCorrect?: boolean;
  isDanger?: boolean;
  vx?: number;
  vy?: number;
  tapsRemaining?: number;
  stepNumber?: number;
  isGhost?: boolean;
  isFloatingUp?: boolean;
  isRed?: boolean;
  isOdd?: boolean;
  isShrinking?: boolean;
  isExploding?: boolean;
  explodeTimeLeft?: number;
  opacity?: number;
  emoji?: string;
}

export interface ActiveChallenge {
  type: ChallengeType;
  title: string;
  instruction: string;
  funnyBlurb?: string;
  failBlurb?: string;
  targets: TargetItem[];
  durationMs: number;
  startTime: number;
  subState?: string; // e.g. for reaction/reverse psych: 'WAIT' | 'TAP' | 'HOLD'
  mustSurviveDuration?: boolean; // For reverse psychology "DO NOT PRESS" challenges
}

export interface PlayerData {
  bestScore: number;
  bestScoreWeird?: number;
  bestScoreCrazy?: number;
  weirdModeCleared?: boolean;
  totalRuns: number;
  totalTaps: number;
  highestCombo: number;
  achievements: string[];
  dailyBestScore: number;
  lastDailyDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface ChecklistCategory {
  category: string;
  items: {
    id: string;
    text: string;
    checked: boolean;
  }[];
}

export interface DifficultyTier {
  range: string;
  tier: string;
  reactionTimeMs: number;
  targetScale: number;
  speed: number;
  complexity: string;
}

export interface ChallengeWeight {
  type: ChallengeType;
  name: string;
  earlyWeight: number;
  extremeWeight: number;
}
