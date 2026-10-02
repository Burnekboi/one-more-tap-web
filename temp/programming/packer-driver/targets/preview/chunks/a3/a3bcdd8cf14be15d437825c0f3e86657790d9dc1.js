System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, MathUtil, _crd;

  _export("MathUtil", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1db58dFVttF7aEFHnQpn3PS", "MathUtil", undefined);

      __checkObsolete__(['Color']);

      _export("MathUtil", MathUtil = class MathUtil {
        static clamp(val, min, max) {
          return Math.max(min, Math.min(max, val));
        }

        static randomRange(min, max) {
          return min + Math.random() * (max - min);
        }

        static hexToColor(hex) {
          var cleanHex = hex.replace('#', '');

          if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
          }

          var num = parseInt(cleanHex, 16) || 0;
          var r = num >> 16 & 255;
          var g = num >> 8 & 255;
          var b = num & 255;
          return new Color(r, g, b, 255);
        }

        static percentToCocosPos(percentX, percentY, width, height) {
          if (width === void 0) {
            width = 392;
          }

          if (height === void 0) {
            height = 800;
          }

          // Cocos coordinate space is centered at (0, 0)
          // percentX: 0 (left) to 100 (right) -> -360 to +360
          // percentY: 0 (top) to 100 (bottom) -> +640 to -640
          var x = percentX / 100 * width - width / 2;
          var y = height / 2 - percentY / 100 * height;
          return {
            x,
            y
          };
        }

        static screenToGame(screenX, screenY, width, height) {
          if (width === void 0) {
            width = 392;
          }

          if (height === void 0) {
            height = 800;
          }

          // Converts screen/UI touch coordinate to game center-offset space
          // screenX: 0..720 -> -360..+360
          // screenY: 0..1280 -> -640..+640 (Cocos Y is upwards from center)
          return {
            x: screenX - width / 2,
            y: screenY - height / 2
          };
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a3bcdd8cf14be15d437825c0f3e86657790d9dc1.js.map