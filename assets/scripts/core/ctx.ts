import { GameMode, GameState, ActiveChallenge } from '../template/models';

export interface GameContext {
  mode: GameMode;
  state: GameState;
  score: number;
  combo: number;
  stageIndex: number; // 0-based
  timerBankSec: number;
  maxTimerBankSec: number;
  stageTimeLimitSec: number;
  lastDefeatReason: string;
  activeChallenge: ActiveChallenge | null;
  survivalHoldSec: number | null;
  canRevive: boolean;
}
