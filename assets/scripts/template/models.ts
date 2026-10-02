export type GameMode = 'WEIRD' | 'CRAZY' | 'DAILY';

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
}

export type TargetShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'pentagon' | 'hexagon' | 'octagon' | 'nonagon';

export interface TargetItem {
  id: string;
  x: number; // percentage 0-100 from left or Cocos x
  y: number; // percentage 0-100 from top or Cocos y
  size: number;
  color: string;
  shape?: TargetShape;
  label?: string;
  subtitle?: string;
  textColor?: string;
  isCorrect?: boolean;
  isDecoy?: boolean;
  vx?: number;
  vy?: number;
  isFloatingUp?: boolean;
  isGhost?: boolean;
  opacity?: number;
  requiredTaps?: number;
  tapsRemaining?: number;
  sequenceIndex?: number;
  isRed?: boolean;
  exploding?: boolean;
  isShy?: boolean;
  shrink?: boolean;
  expand?: boolean;
  alternatingColors?: Array<{ color: string; isCorrect: boolean; shape?: TargetShape }>;
  colorIntervalSec?: number;
  orbitRadius?: number;
  orbitSpeedDeg?: number;
  orbitPhaseDeg?: number;
  isOrbiting?: boolean;
  originalColor?: string;
}

export interface ActiveChallenge {
  type: string;
  title: string;
  instruction: string;
  failBlurb: string;
  targets: TargetItem[];
  subState?: string;
  waitDurationSec?: number;
  isSurvivalHold?: boolean;
  timeLimitSec?: number;
  collectAllCorrect?: boolean;
  stopAfterTaps?: number;
  stopDurationSec?: number;
  stopMessage?: string;
  stopPrompt?: string;
  overlapKill?: boolean;
  countdownSec?: number;
  countdownSteps?: Array<{ label: string; color: string }>;
}

export interface PlayerData {
  bestScore: number;
  bestScoreWeird: number;
  bestScoreCrazy: number;
  highestCombo: number;
  totalTaps: number;
  totalRuns: number;
  weirdModeCleared: boolean;
  crazyModeCleared?: boolean;
  trophyClaimed?: boolean;
  dailyBest?: Record<string, number>;
  bestStageWeird?: number;
  bestStageCrazy?: number;
  soundEnabled?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}
