System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Color, _dec, _class, _crd, ccclass, ParticleEmitter;

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

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdq", "Particle", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'Color']);

      ({
        ccclass
      } = _decorator);

      _export("ParticleEmitter", ParticleEmitter = (_dec = ccclass('ParticleEmitter'), _dec(_class = class ParticleEmitter extends Component {
        constructor() {
          super(...arguments);
          this.particles = [];
          this.graphics = null;
        }

        init(graphics) {
          this.graphics = graphics;
        }

        emit(centerX, centerY, colorOrHex, count) {
          if (colorOrHex === void 0) {
            colorOrHex = new Color(6, 182, 212, 255);
          }

          if (count === void 0) {
            count = 16;
          }

          var finalColor;

          if (typeof colorOrHex === 'string') {
            var clean = colorOrHex.replace('#', '');
            if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
            var num = parseInt(clean, 16) || 0;
            finalColor = new Color(num >> 16 & 255, num >> 8 & 255, num & 255, 255);
          } else {
            finalColor = colorOrHex;
          }

          this.burst(centerX, centerY, count, finalColor);
        }

        burst(centerX, centerY, count, color) {
          if (count === void 0) {
            count = 16;
          }

          if (color === void 0) {
            color = new Color(6, 182, 212, 255);
          }

          for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 2 + Math.random() * 6;
            this.particles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1.0,
              size: 3 + Math.random() * 5,
              color
            });
          }
        }

        updateParticles(dt) {
          if (!this.graphics || this.particles.length === 0) return;
          this.graphics.clear();

          for (var i = this.particles.length - 1; i >= 0; i--) {
            var p = this.particles[i];
            p.x += p.vx * dt * 60;
            p.y += p.vy * dt * 60;
            p.alpha -= dt * 2.5;

            if (p.alpha <= 0) {
              this.particles.splice(i, 1);
            } else {
              var c = new Color(p.color.r, p.color.g, p.color.b, Math.floor(p.alpha * 255));
              this.graphics.fillColor = c;
              this.graphics.circle(p.x, p.y, p.size);
              this.graphics.fill();
            }
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c5a22c5db85eed7a50e224b2fa3f69b34951842d.js.map