System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, INITIAL_ACHIEVEMENTS, Platform, SaveManager, _crd, STORAGE_KEY;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _reportPossibleCrUseOfPlayerData(extras) {
    _reporterNs.report("PlayerData", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAchievement(extras) {
    _reporterNs.report("Achievement", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfINITIAL_ACHIEVEMENTS(extras) {
    _reporterNs.report("INITIAL_ACHIEVEMENTS", "../template/achievements", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlatform(extras) {
    _reporterNs.report("Platform", "./platform", _context.meta, extras);
  }

  _export("SaveManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      INITIAL_ACHIEVEMENTS = _unresolved_2.INITIAL_ACHIEVEMENTS;
    }, function (_unresolved_3) {
      Platform = _unresolved_3.Platform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "17fcbnPh0JGbKp4YuUnEwet", "SaveManager", undefined);

      STORAGE_KEY = 'ONE_MORE_TAP_SAVE_DATA_V2';

      _export("SaveManager", SaveManager = class SaveManager {
        static load() {
          var raw = (_crd && Platform === void 0 ? (_reportPossibleCrUseOfPlatform({
            error: Error()
          }), Platform) : Platform).getStorage(STORAGE_KEY);

          if (raw) {
            try {
              var parsed = JSON.parse(raw);
              this.data = _extends({}, this.data, parsed);
            } catch (e) {}
          }

          return this.data;
        }

        static getData() {
          return this.data;
        }

        static getAchievements() {
          return this.achievements;
        }

        static updateData(partial) {
          this.data = _extends({}, this.data, partial);
          (_crd && Platform === void 0 ? (_reportPossibleCrUseOfPlatform({
            error: Error()
          }), Platform) : Platform).setStorage(STORAGE_KEY, JSON.stringify(this.data));
          this.checkAchievements();
        }

        static recordTap() {
          this.incrementTaps();
        }

        static incrementTaps() {
          this.data.totalTaps++;
          (_crd && Platform === void 0 ? (_reportPossibleCrUseOfPlatform({
            error: Error()
          }), Platform) : Platform).setStorage(STORAGE_KEY, JSON.stringify(this.data));
          this.checkAchievements();
        }

        static checkAchievements() {
          var changed = false;

          for (var ach of this.achievements) {
            if (ach.unlocked) continue;

            if (ach.id === 'first_tap' && this.data.totalTaps >= 1) {
              ach.unlocked = true;
              ach.progress = 1;
              changed = true;
            } else if (ach.id === 'getting_started' && (this.data.bestScore >= 50 || this.data.bestScoreWeird >= 50 || this.data.bestScoreCrazy >= 50)) {
              ach.unlocked = true;
              ach.progress = 50;
              changed = true;
            } else if (ach.id === 'tap_master' && this.data.totalTaps >= 100) {
              ach.unlocked = true;
              ach.progress = 100;
              changed = true;
            } else if (ach.id === 'combo_king' && this.data.highestCombo >= 25) {
              ach.unlocked = true;
              ach.progress = 25;
              changed = true;
            } else if (ach.id === 'insane' && this.data.highestCombo >= 50) {
              ach.unlocked = true;
              ach.progress = 50;
              changed = true;
            } else if (ach.id === 'weird_master' && this.data.weirdModeCleared) {
              ach.unlocked = true;
              ach.progress = 25;
              changed = true;
            } else if (ach.id === 'crazy_legend' && this.data.crazyModeCleared) {
              ach.unlocked = true;
              ach.progress = 50;
              changed = true;
            }
          }

          if (changed) {
            (_crd && Platform === void 0 ? (_reportPossibleCrUseOfPlatform({
              error: Error()
            }), Platform) : Platform).setStorage(STORAGE_KEY + '_ACH', JSON.stringify(this.achievements));
          }
        }

      });

      SaveManager.data = {
        bestScore: 0,
        bestScoreWeird: 0,
        bestScoreCrazy: 0,
        highestCombo: 0,
        totalTaps: 0,
        totalRuns: 0,
        weirdModeCleared: false,
        crazyModeCleared: false,
        trophyClaimed: false,
        soundEnabled: true
      };
      SaveManager.achievements = [...(_crd && INITIAL_ACHIEVEMENTS === void 0 ? (_reportPossibleCrUseOfINITIAL_ACHIEVEMENTS({
        error: Error()
      }), INITIAL_ACHIEVEMENTS) : INITIAL_ACHIEVEMENTS)];

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3a13179ae496f9d8cba19543f2bdc2050c97e346.js.map