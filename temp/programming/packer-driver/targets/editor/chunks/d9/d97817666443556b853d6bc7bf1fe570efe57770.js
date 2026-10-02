System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, GameState, INITIAL_TIMER_BANK_SEC, MAX_TIMER_BANK_SEC, FlowController, _crd;

  function _reportPossibleCrUseOfGameContext(extras) {
    _reporterNs.report("GameContext", "./ctx", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameMode(extras) {
    _reporterNs.report("GameMode", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameState(extras) {
    _reporterNs.report("GameState", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfINITIAL_TIMER_BANK_SEC(extras) {
    _reporterNs.report("INITIAL_TIMER_BANK_SEC", "../template/constants", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMAX_TIMER_BANK_SEC(extras) {
    _reporterNs.report("MAX_TIMER_BANK_SEC", "../template/constants", _context.meta, extras);
  }

  _export("FlowController", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      GameState = _unresolved_2.GameState;
    }, function (_unresolved_3) {
      INITIAL_TIMER_BANK_SEC = _unresolved_3.INITIAL_TIMER_BANK_SEC;
      MAX_TIMER_BANK_SEC = _unresolved_3.MAX_TIMER_BANK_SEC;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "12acftyb8BE56ZLWYRB3A8e", "flow", undefined);

      _export("FlowController", FlowController = class FlowController {
        static createInitialContext(mode = 'WEIRD') {
          return {
            mode,
            state: (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
              error: Error()
            }), GameState) : GameState).MENU,
            score: 0,
            combo: 0,
            stageIndex: 0,
            timerBankSec: _crd && INITIAL_TIMER_BANK_SEC === void 0 ? (_reportPossibleCrUseOfINITIAL_TIMER_BANK_SEC({
              error: Error()
            }), INITIAL_TIMER_BANK_SEC) : INITIAL_TIMER_BANK_SEC,
            maxTimerBankSec: _crd && MAX_TIMER_BANK_SEC === void 0 ? (_reportPossibleCrUseOfMAX_TIMER_BANK_SEC({
              error: Error()
            }), MAX_TIMER_BANK_SEC) : MAX_TIMER_BANK_SEC,
            stageTimeLimitSec: _crd && INITIAL_TIMER_BANK_SEC === void 0 ? (_reportPossibleCrUseOfINITIAL_TIMER_BANK_SEC({
              error: Error()
            }), INITIAL_TIMER_BANK_SEC) : INITIAL_TIMER_BANK_SEC,
            lastDefeatReason: '',
            activeChallenge: null,
            survivalHoldSec: null,
            canRevive: true
          };
        }

        static getStageTimeLimit(mode, stageIndex) {
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

        static calculateStageScore(combo, remainingSec, limitSec) {
          const base = 100;
          const timeBonus = Math.round(150 * Math.max(0, Math.min(1, remainingSec / limitSec)));
          const multiplier = 1 + Math.min(9, combo) * 0.1;
          return Math.round((base + timeBonus) * multiplier);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d97817666443556b853d6bc7bf1fe570efe57770.js.map