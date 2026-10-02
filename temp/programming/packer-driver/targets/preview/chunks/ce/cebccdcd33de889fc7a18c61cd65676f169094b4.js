System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Graphics, Color, input, Input, DESIGN_HEIGHT, DESIGN_WIDTH, _dec, _class, _crd, ccclass, NeonBackground;

  function _reportPossibleCrUseOfDESIGN_HEIGHT(extras) {
    _reporterNs.report("DESIGN_HEIGHT", "../template/constants", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDESIGN_WIDTH(extras) {
    _reporterNs.report("DESIGN_WIDTH", "../template/constants", _context.meta, extras);
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
      Graphics = _cc.Graphics;
      Color = _cc.Color;
      input = _cc.input;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      DESIGN_HEIGHT = _unresolved_2.DESIGN_HEIGHT;
      DESIGN_WIDTH = _unresolved_2.DESIGN_WIDTH;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdr", "NeonBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'Color', 'input', 'Input', 'EventTouch']);

      ({
        ccclass
      } = _decorator);
      /**
       * Animated Neon Cyber Grid & Glow background
       * Provides modern ambient visuals without needing external texture assets.
       */

      _export("NeonBackground", NeonBackground = (_dec = ccclass('NeonBackground'), _dec(_class = class NeonBackground extends Component {
        constructor() {
          super(...arguments);
          this.graphics = null;
          this.time = 0;
          this.rippleX = 0;
          this.rippleY = 0;
          this.rippleLife = 0;
        }

        onLoad() {
          var g = this.node.getComponent(Graphics);

          if (!g) {
            g = this.node.addComponent(Graphics);
          }

          this.graphics = g;
          input.on(Input.EventType.TOUCH_START, this.onTouch, this);
          this.drawBackground();
        }

        onDestroy() {
          input.off(Input.EventType.TOUCH_START, this.onTouch, this);
        }

        onTouch(event) {
          var location = event.getUILocation ? event.getUILocation() : event.getLocation();
          this.rippleX = location.x - (_crd && DESIGN_WIDTH === void 0 ? (_reportPossibleCrUseOfDESIGN_WIDTH({
            error: Error()
          }), DESIGN_WIDTH) : DESIGN_WIDTH) / 2;
          this.rippleY = location.y - (_crd && DESIGN_HEIGHT === void 0 ? (_reportPossibleCrUseOfDESIGN_HEIGHT({
            error: Error()
          }), DESIGN_HEIGHT) : DESIGN_HEIGHT) / 2;
          this.rippleLife = 1;
        }

        update(dt) {
          this.time += dt;
          this.rippleLife = Math.max(0, this.rippleLife - dt * 1.7); // Periodic pulse refresh every 50ms for smooth ambient glow + star twinkle

          if (this.time >= 0.05) {
            this.time = 0;
            this.drawBackground();
          }
        }

        drawBackground() {
          if (!this.graphics) return;
          var g = this.graphics;
          g.clear();
          var w = _crd && DESIGN_WIDTH === void 0 ? (_reportPossibleCrUseOfDESIGN_WIDTH({
            error: Error()
          }), DESIGN_WIDTH) : DESIGN_WIDTH;
          var h = _crd && DESIGN_HEIGHT === void 0 ? (_reportPossibleCrUseOfDESIGN_HEIGHT({
            error: Error()
          }), DESIGN_HEIGHT) : DESIGN_HEIGHT;
          var halfW = w / 2;
          var halfH = h / 2;
          var now = Date.now() / 1000; // 1. Deep space backdrop (near-black, not flat gray)

          g.fillColor = new Color(6, 6, 9, 255);
          g.rect(-halfW, -halfH, w, h);
          g.fill(); // 2. Aurora bands (very subtle vertical falloff toward top/bottom)

          var band = (color, y, height, alpha) => {
            g.fillColor = new Color(color.r, color.g, color.b, alpha);
            g.rect(-halfW, y, w, height);
            g.fill();
          };

          band(new Color(6, 182, 212, 255), halfH - 0, -320, 2);
          band(new Color(6, 182, 212, 255), halfH - 320, -320, 1);
          band(new Color(244, 63, 94, 255), -halfH + 0, 320, 2);
          band(new Color(244, 63, 94, 255), -halfH + 320, 320, 1); // 3. Center halo ring behind the content (barely-there breathing light)

          var breathe = 3 + Math.sin(now * 0.8) * 1;
          g.fillColor = new Color(120, 220, 255, Math.floor(breathe));
          g.circle(0, 0, 480);
          g.fill(); // 4. Starfield (deterministic scatter, gentle twinkle)

          for (var i = 0; i < 72; i++) {
            var px = (i * 97 % 137 - 68.5) * 5.1;
            var py = (i * 149 % 255 - 127.5) * 5;
            var tw = (Math.sin(now * 2 + i * 1.7) + 1) / 2;
            var alpha = 26 + Math.floor(tw * 64);
            var cyanStar = i % 5 === 0;
            g.fillColor = new Color(150, 250, 255, alpha);
            g.circle(px, py, 2.1);
            g.fill();
            g.fillColor = new Color(cyanStar ? 150 : 235, cyanStar ? 250 : 245, cyanStar ? 255 : 250, alpha);
            g.circle(px, py, 1.1);
            g.fill();
          } // 5. Ambient glow orbs (kept low so UI stays readable)


          var pulseCyan = 11 + Math.sin(now * 1.5) * 3;
          g.fillColor = new Color(6, 182, 212, Math.floor(pulseCyan));
          g.circle(0, 380, 330);
          g.fill();
          var pulseRose = 9 + Math.cos(now * 1.2) * 2;
          g.fillColor = new Color(244, 63, 94, Math.floor(pulseRose));
          g.circle(0, -380, 350);
          g.fill(); // 6. Cyber perspective grid (fainter than before)

          g.strokeColor = new Color(39, 39, 42, 32);
          g.lineWidth = 1;

          for (var x = -halfW; x <= halfW; x += 96) {
            g.moveTo(x, -halfH);
            g.lineTo(x, halfH);
            g.stroke();
          }

          for (var y = -halfH; y <= halfH; y += 96) {
            g.moveTo(-halfW, y);
            g.lineTo(halfW, y);
            g.stroke();
          } // 7. Corner vignette for focus depth


          var vig = (x, y, ww, hh) => {
            g.fillColor = new Color(0, 0, 0, 26);
            g.rect(x, y, ww, hh);
            g.fill();
          };

          vig(-halfW, -halfH, 84, h);
          vig(halfW - 84, -halfH, 84, h);
          vig(-halfW, halfH - 84, w, 84);
          vig(-halfW, -halfH, w, 84); // Each tap sends a quiet cyan radar ripple through the dashboard/game.

          if (this.rippleLife > 0) {
            var radius = 26 + (1 - this.rippleLife) * 140;
            g.strokeColor = new Color(0, 242, 254, Math.floor(this.rippleLife * 90));
            g.lineWidth = 2;
            g.circle(this.rippleX, this.rippleY, radius);
            g.stroke();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cebccdcd33de889fc7a18c61cd65676f169094b4.js.map