System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, DESIGN_WIDTH, DESIGN_HEIGHT, INITIAL_TIMER_BANK_SEC, MAX_TIMER_BANK_SEC, TIMER_BONUS_SEC, COMBO_TIMER_BONUS_SEC, SCORE_BASE_PER_TAP, SCORE_COMBO_MULTIPLIER, WEIRD_STAGE_COUNT, CRAZY_STAGE_COUNT, STAGE_PROGRESSION;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "be92cMpKNNGsKbJSXtvJa1/", "constants", undefined);

      // The TikTok mini-game is authored for the target portrait viewport.  Keeping
      // this in sync with the Creator project avoids a cropped 720px-wide canvas on
      // 392px devices.
      _export("DESIGN_WIDTH", DESIGN_WIDTH = 392);

      _export("DESIGN_HEIGHT", DESIGN_HEIGHT = 800);

      _export("INITIAL_TIMER_BANK_SEC", INITIAL_TIMER_BANK_SEC = 8.0);

      _export("MAX_TIMER_BANK_SEC", MAX_TIMER_BANK_SEC = 8.0);

      _export("TIMER_BONUS_SEC", TIMER_BONUS_SEC = 2.0);

      _export("COMBO_TIMER_BONUS_SEC", COMBO_TIMER_BONUS_SEC = 3.0);

      _export("SCORE_BASE_PER_TAP", SCORE_BASE_PER_TAP = 10);

      _export("SCORE_COMBO_MULTIPLIER", SCORE_COMBO_MULTIPLIER = 5);

      _export("WEIRD_STAGE_COUNT", WEIRD_STAGE_COUNT = 25);

      _export("CRAZY_STAGE_COUNT", CRAZY_STAGE_COUNT = 50);

      _export("STAGE_PROGRESSION", STAGE_PROGRESSION = ['TAP_TARGET', 'AURA_CHECK', 'COLOR_TARGET', 'BATTERY_PANIC', 'BUBBLE_WRAP', 'WIFI_HUNT', 'CAT_MEME', 'AUTOCORRECT_RESCUE', 'MICROWAVE_STOP', 'DONT_TAP', 'TRIPLE_LOCK', 'SKULL_DODGE', 'ASCENDING_TRIO', 'TWIN_RED', 'VANISHING_ORBS', 'DONT_TAP_RED', 'HAMMER_TIME', 'COLOR_COPY_FAKE', 'SHIELD_BOMB', 'DESCENDING_TRIO', 'CHAMELEON', 'MOSH_PIT', 'EVEN_FAIR', 'DON_T_TAP_BLUE', 'CONVEYOR', 'TRAFFIC_LIGHT', 'SHAPE_SHIFT', 'MIRROR_MATH', 'SHAPE_CONFUSER', 'SHAPE_CONFUSER', 'CORD_CUTTER', 'STROBE_FIRE', 'TICKING_ORBIT', 'STORM_SURGE', 'CREEPING_CURSOR', 'CIRCUIT_BREAK', 'TACHYON_DEFUSE', 'PHANTOM_SHIFT', 'JITTER_MASH', 'CROWN_JEWEL', 'FLASH_TRACE', 'GOLD_ORBIT', 'WHITE_SPACE', 'SWEEP_SWARM', 'DRAW_REACTION', 'HOLD_STILL', 'SHRINK_HUNT', 'NEON_HUNT', 'COMBO_FOUR', 'FINALE_GAUNTLET']);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c1ba5834de9a6688dcc4614014a6eb04cc81e468.js.map