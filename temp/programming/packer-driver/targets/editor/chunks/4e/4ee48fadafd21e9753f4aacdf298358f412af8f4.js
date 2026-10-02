System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Graphics, UITransform, Color, MathUtil, _dec, _class, _crd, ccclass, Target;

  function _reportPossibleCrUseOfTargetItem(extras) {
    _reporterNs.report("TargetItem", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTargetShape(extras) {
    _reporterNs.report("TargetShape", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../core/MathUtil", _context.meta, extras);
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
      Node = _cc.Node;
      Label = _cc.Label;
      Graphics = _cc.Graphics;
      UITransform = _cc.UITransform;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      MathUtil = _unresolved_2.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdp", "Target", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Graphics', 'UITransform', 'Color']);

      ({
        ccclass
      } = _decorator);

      _export("Target", Target = (_dec = ccclass('Target'), _dec(_class = class Target extends Component {
        constructor(...args) {
          super(...args);
          this.data = null;
          this.graphics = null;
          this.label = null;
          this.currentRadius = 60;
          this.isShrinking = false;
          this.isExpanding = false;
          this.onHitCallback = null;
          this.colorElapsed = 0;
          this.colorIndex = 0;
          this.orbitAngle = 0;
        }

        init(item, graphics, onHit) {
          this.data = item;

          if (item.orbitPhaseDeg !== undefined) {
            this.orbitAngle = item.orbitPhaseDeg;
          }

          this.currentRadius = Math.max(24, Math.round((item.size || 60) * 0.72));
          this.isShrinking = item.size ? false : true;
          this.onHitCallback = onHit || null;
          let transform = this.node.getComponent(UITransform);

          if (!transform) {
            transform = this.node.addComponent(UITransform);
          }

          transform.setContentSize(this.currentRadius * 2, this.currentRadius * 2);

          if (graphics) {
            this.graphics = graphics;
          } else {
            let g = this.node.getComponent(Graphics);
            if (!g) g = this.node.addComponent(Graphics);
            this.graphics = g;
          }

          this.renderCircle();

          if (item.label || item.requiredTaps) {
            const lblNode = new Node('Label');
            lblNode.addComponent(UITransform).setContentSize(Math.max(24, this.currentRadius * 2 - 10), Math.max(16, this.currentRadius * 2 - 10));
            this.label = lblNode.addComponent(Label);
            const rawText = item.requiredTaps ? `${item.tapsRemaining || item.requiredTaps}` : item.label || '';
            this.label.string = rawText.replace(/[^\x20-\x7E]/g, '');
            this.label.fontSize = Math.max(11, Math.round(this.currentRadius * 0.5));
            this.label.overflow = Label.Overflow.SHRINK;
            this.label.enableWrapText = true;
            this.label.horizontalAlign = Label.HorizontalAlign.CENTER;
            this.label.verticalAlign = Label.VerticalAlign.CENTER;
            this.label.color = item.textColor ? (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
              error: Error()
            }), MathUtil) : MathUtil).hexToColor(item.textColor) : new Color(255, 255, 255, 255);
            this.node.addChild(lblNode);
          }
        }

        checkHit(x, y) {
          const nodePos = this.node.position;
          const distSq = (x - nodePos.x) * (x - nodePos.x) + (y - nodePos.y) * (y - nodePos.y);
          const hit = distSq <= this.currentRadius * 1.15 * (this.currentRadius * 1.15);

          if (hit && this.onHitCallback) {
            this.onHitCallback();
          }

          return hit;
        }

        updateTarget(dt) {
          this.updateShrink(dt);
          if (!this.data) return; // Color alternation logic

          if (this.data.alternatingColors && this.data.alternatingColors.length > 0 && this.data.colorIntervalSec) {
            this.colorElapsed += dt;

            if (this.colorElapsed >= this.data.colorIntervalSec) {
              this.colorElapsed = 0;
              this.colorIndex = (this.colorIndex + 1) % this.data.alternatingColors.length;
              const currentVariant = this.data.alternatingColors[this.colorIndex];
              this.data.color = currentVariant.color;
              this.data.isCorrect = currentVariant.isCorrect;
              if (currentVariant.shape) this.data.shape = currentVariant.shape;
              this.renderCircle();
            }
          } // Orbiting logic around center (0,0)


          if (this.data.isOrbiting && this.data.orbitRadius !== undefined && this.data.orbitSpeedDeg !== undefined) {
            this.orbitAngle += this.data.orbitSpeedDeg * dt;
            const rad = this.orbitAngle * Math.PI / 180;
            const x = Math.cos(rad) * this.data.orbitRadius;
            const y = Math.sin(rad) * this.data.orbitRadius;
            this.node.setPosition(x, y, 0);
          } // Challenge velocities are expressed as a small percentage of the
          // playfield per second. Keep targets inside the playable centre area.


          if (this.data.vx || this.data.vy) {
            const p = this.node.position;
            const nextX = p.x + (this.data.vx || 0) * 42 * dt;
            const nextY = p.y - (this.data.vy || 0) * 42 * dt;
            const limitX = 150;
            const limitY = 210;
            if (Math.abs(nextX) > limitX && this.data.vx) this.data.vx *= -1;
            if (Math.abs(nextY) > limitY && this.data.vy) this.data.vy *= -1;
            this.node.setPosition(nextX, nextY, 0);
          }
        }

        setLabel(text) {
          if (this.label) this.label.string = text;
        }

        setActiveColor(color, isCorrect) {
          if (!this.data) return;
          this.data.color = color;
          this.data.isCorrect = isCorrect;
          this.renderCircle();
        }

        enableShrink() {
          this.isShrinking = true;
        }

        enableExpand() {
          this.isExpanding = true;
        }

        updateTaps(remaining) {
          if (this.label) {
            this.label.string = `${remaining}`;
          }
        }

        updateShrink(dt) {
          if (this.isShrinking && this.currentRadius > 15) {
            this.currentRadius -= dt * 25;
            this.renderCircle();
          } else if (this.isExpanding && this.currentRadius < 170) {
            this.currentRadius += dt * 25;
            this.renderCircle();
          }
        }

        renderCircle() {
          if (!this.graphics || !this.data) return;

          if (this.data.opacity === 0) {
            this.graphics.clear();
            return;
          }

          this.graphics.clear();
          const color = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).hexToColor(this.data.color);

          if (this.data.opacity !== undefined) {
            color.a = Math.floor(this.data.opacity * 255);
          }

          const shape = this.data.shape || 'circle'; // Outer subtle glow ring

          this.graphics.fillColor = new Color(color.r, color.g, color.b, 40);
          this.shapePath(shape, this.currentRadius + 8);
          this.graphics.fill(); // Main disc

          this.graphics.fillColor = color;
          this.shapePath(shape, this.currentRadius);
          this.graphics.fill(); // Inner highlight border

          this.graphics.strokeColor = new Color(255, 255, 255, 200);
          this.graphics.lineWidth = 3;
          this.shapePath(shape, this.currentRadius - 2);
          this.graphics.stroke();
        }

        shapePath(shape, r) {
          if (!this.graphics) return;

          if (shape === 'circle') {
            this.graphics.circle(0, 0, r);
          } else if (shape === 'square') {
            this.graphics.roundRect(-r, -r, r * 2, r * 2, Math.max(4, r * 0.2));
          } else if (shape === 'diamond') {
            this.graphics.moveTo(0, r);
            this.graphics.lineTo(r, 0);
            this.graphics.lineTo(0, -r);
            this.graphics.lineTo(-r, 0);
            this.graphics.close();
          } else if (shape === 'triangle') {
            this.graphics.moveTo(0, r);
            this.graphics.lineTo(r * 0.95, -r * 0.65);
            this.graphics.lineTo(-r * 0.95, -r * 0.65);
            this.graphics.close();
          } else if (shape === 'triangle') {
            this.graphics.moveTo(0, r);
            this.graphics.lineTo(r * 0.95, -r * 0.65);
            this.graphics.lineTo(-r * 0.95, -r * 0.65);
            this.graphics.close();
          } else if (shape === 'pentagon') {
            this.regularPolygon(5, r);
          } else if (shape === 'hexagon') {
            this.regularPolygon(6, r);
          } else if (shape === 'octagon') {
            this.regularPolygon(8, r);
          } else if (shape === 'nonagon') {
            this.regularPolygon(9, r);
          }
        } // Regular polygon (n >= 3) with flat top, centered at origin.


        regularPolygon(n, r) {
          if (!this.graphics) return;
          const step = Math.PI * 2 / n;

          for (let i = 0; i < n; i++) {
            const angleDeg = i * step - Math.PI / 2;
            const px = Math.cos(angleDeg) * r;
            const py = Math.sin(angleDeg) * r;

            if (i === 0) {
              this.graphics.moveTo(px, py);
            } else {
              this.graphics.lineTo(px, py);
            }
          }

          this.graphics.close();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4ee48fadafd21e9753f4aacdf298358f412af8f4.js.map