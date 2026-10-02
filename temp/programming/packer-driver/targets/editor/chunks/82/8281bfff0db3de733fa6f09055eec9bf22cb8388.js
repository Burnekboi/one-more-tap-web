System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _crd, INITIAL_ACHIEVEMENTS;

  function _reportPossibleCrUseOfAchievement(extras) {
    _reporterNs.report("Achievement", "./models", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "670e7OjXLlP9qOLyxCCawAb", "achievements", undefined);

      _export("INITIAL_ACHIEVEMENTS", INITIAL_ACHIEVEMENTS = [{
        id: 'first_tap',
        title: 'First Tap',
        description: 'Complete your first successful tap challenge.',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      }, {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Score 50 points in a single run.',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      }, {
        id: 'tap_master',
        title: 'Tap Master',
        description: 'Accumulate 100 total lifetime taps.',
        unlocked: false,
        progress: 0,
        maxProgress: 100
      }, {
        id: 'combo_king',
        title: 'Combo King',
        description: 'Build a streak combo of 25.',
        unlocked: false,
        progress: 0,
        maxProgress: 25
      }, {
        id: 'insane',
        title: 'Insane',
        description: 'Reach a 50 combo streak.',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      }, {
        id: 'weird_master',
        title: 'Weird Conqueror',
        description: 'Complete all 25 stages of Weird Mode.',
        unlocked: false,
        progress: 0,
        maxProgress: 25
      }, {
        id: 'crazy_legend',
        title: 'Crazy Legend',
        description: 'Conquer all 50 stages of Crazy Mode.',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      }]);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8281bfff0db3de733fa6f09055eec9bf22cb8388.js.map