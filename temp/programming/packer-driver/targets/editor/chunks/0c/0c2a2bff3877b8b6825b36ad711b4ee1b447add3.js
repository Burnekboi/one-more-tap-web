System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Color, _dec, _class, _crd, ccclass, CONFETTI_PALETTE, Confetti;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f01db4iN81H0a8gQm1SZzsu", "Confetti", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'Color']);

      ({
        ccclass
      } = _decorator);
      CONFETTI_PALETTE = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#facc15'];

      _export("Confetti", Confetti = (_dec = ccclass('Confetti'), _dec(_class = class Confetti extends Component {
        constructor(...args) {
          super(...args);
          this.pieces = [];
          this.graphics = null;
        }

        init(graphics) {
          this.graphics = graphics;
        }

        burst(count = 70) {
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 160 + Math.random() * 340;
            const hex = CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)];
            const num = parseInt(hex.replace('#', ''), 16);
            const color = new Color(num >> 16 & 255, num >> 8 & 255, num & 255, 255);
            const life = 1.6 + Math.random() * 1.4;
            this.pieces.push({
              x: 0,
              y: 0,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed + 120,
              w: 5 + Math.random() * 6,
              h: 10 + Math.random() * 8,
              color,
              rot: Math.random() * Math.PI * 2,
              vrot: (Math.random() - 0.5) * 8,
              life,
              maxLife: life,
              flutter: 2 + Math.random() * 4,
              flutterPhase: Math.random() * Math.PI * 2
            });
          }
        }

        clear() {
          this.pieces = [];
          if (this.graphics) this.graphics.clear();
        }

        updateConfetti(dt) {
          if (!this.graphics) return;
          const g = this.graphics;
          g.clear();
          if (this.pieces.length === 0) return;

          for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            p.life -= dt;

            if (p.life <= 0) {
              this.pieces.splice(i, 1);
              continue;
            }

            p.vy -= 300 * dt; // gravity pulls pieces back down

            p.x += p.vx * dt;
            p.y += (p.vy + Math.sin(p.flutterPhase) * 30) * dt;
            p.flutterPhase += p.flutter * dt;
            p.rot += p.vrot * dt;
            const fade = Math.min(1, p.life / 0.4);
            const c = new Color(p.color.r, p.color.g, p.color.b, Math.floor(fade * 255)); // Draw each piece as a rotated rectangle polygon. Only moveTo/lineTo/
            // close/fill are used (no Graphics transforms) so it renders everywhere.

            const cos = Math.cos(p.rot);
            const sin = Math.sin(p.rot);
            const hw = p.w / 2;
            const hh = p.h / 2;
            g.fillColor = c;
            g.moveTo(p.x + (-hw * cos - -hh * sin), p.y + (-hw * sin + -hh * cos));
            g.lineTo(p.x + (hw * cos - -hh * sin), p.y + (hw * sin + -hh * cos));
            g.lineTo(p.x + (hw * cos - hh * sin), p.y + (hw * sin + hh * cos));
            g.lineTo(p.x + (-hw * cos - hh * sin), p.y + (-hw * sin + hh * cos));
            g.close();
            g.fill();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0c2a2bff3877b8b6825b36ad711b4ee1b447add3.js.map