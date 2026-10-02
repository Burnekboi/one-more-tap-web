System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Color, MAX_TIMER_BANK_SEC, _dec, _class, _crd, ccclass, TimerBar;

  function _reportPossibleCrUseOfMAX_TIMER_BANK_SEC(extras) {
    _reporterNs.report("MAX_TIMER_BANK_SEC", "../template/constants", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      MAX_TIMER_BANK_SEC = _unresolved_2.MAX_TIMER_BANK_SEC;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdo", "TimerBar", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'Label', 'Color']);

      ({
        ccclass
      } = _decorator);

      _export("TimerBar", TimerBar = (_dec = ccclass('TimerBar'), _dec(_class = class TimerBar extends Component {
        constructor(...args) {
          super(...args);
          this.graphics = null;
          this.label = null;
        }

        init(graphics, label) {
          this.graphics = graphics;
          this.label = label;
        }

        updateTimer(currentSec, maxSec = _crd && MAX_TIMER_BANK_SEC === void 0 ? (_reportPossibleCrUseOfMAX_TIMER_BANK_SEC({
          error: Error()
        }), MAX_TIMER_BANK_SEC) : MAX_TIMER_BANK_SEC) {
          this.render(currentSec, maxSec);
        }

        render(currentSec, maxSec = _crd && MAX_TIMER_BANK_SEC === void 0 ? (_reportPossibleCrUseOfMAX_TIMER_BANK_SEC({
          error: Error()
        }), MAX_TIMER_BANK_SEC) : MAX_TIMER_BANK_SEC) {
          if (this.label) {
            this.label.string = `${Math.max(0, currentSec).toFixed(1)}s`;
          }

          if (!this.graphics) return;
          this.graphics.clear();
          const barWidth = 348;
          const barHeight = 18;
          const radius = 9; // Background track with subtle border

          this.graphics.fillColor = new Color(24, 24, 27, 230);
          this.graphics.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, radius);
          this.graphics.fill();
          this.graphics.strokeColor = new Color(39, 39, 42, 255);
          this.graphics.lineWidth = 2;
          this.graphics.stroke(); // Fill percent

          const pct = Math.max(0, Math.min(1, currentSec / maxSec));

          if (pct > 0.01) {
            if (pct <= 0.25) {
              const pulse = 190 + Math.round((Math.sin(Date.now() / 90) + 1) * 32);
              this.graphics.fillColor = new Color(pulse, 68, 68, 255); // Pulsing crimson
            } else if (pct <= 0.5) {
              this.graphics.fillColor = new Color(245, 158, 11, 255); // Amber
            } else {
              this.graphics.fillColor = new Color(16, 185, 129, 255); // Neon mint active
            }

            this.graphics.roundRect(-barWidth / 2, -barHeight / 2, barWidth * pct, barHeight, radius);
            this.graphics.fill();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1661c9b3072e0b8bf89449f074aef3e304cebd26.js.map