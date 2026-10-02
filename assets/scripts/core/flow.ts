import { GameContext } from './ctx';
import { GameMode, GameState } from '../template/models';
import { INITIAL_TIMER_BANK_SEC, MAX_TIMER_BANK_SEC } from '../template/constants';

export class FlowController {
  public static createInitialContext(mode: GameMode = 'WEIRD'): GameContext {
    return {
      mode,
      state: GameState.MENU,
      score: 0,
      combo: 0,
      stageIndex: 0,
      timerBankSec: INITIAL_TIMER_BANK_SEC,
      maxTimerBankSec: MAX_TIMER_BANK_SEC,
      stageTimeLimitSec: INITIAL_TIMER_BANK_SEC,
      lastDefeatReason: '',
      activeChallenge: null,
      survivalHoldSec: null,
      canRevive: true,
    };
  }

  public static getStageTimeLimit(mode: GameMode, stageIndex: number): number {
    if (mode === 'WEIRD') {
      if (stageIndex < 6) return 3.8;
      if (stageIndex < 12) return 3.1;
      if (stageIndex < 18) return 2.5;
      return 1.8;
    }
    if (stageIndex < 10) return 4.2;
    if (stageIndex < 20) return 3.1;
    if (stageIndex < 30) return 2.5;
    if (stageIndex < 40) return 1.8;
    return 1.2;
  }

  public static calculateStageScore(combo: number, remainingSec: number, limitSec: number): number {
    const base = 100;
    const timeBonus = Math.round(150 * Math.max(0, Math.min(1, remainingSec / limitSec)));
    const multiplier = 1 + Math.min(9, combo) * 0.1;
    return Math.round((base + timeBonus) * multiplier);
  }

}
