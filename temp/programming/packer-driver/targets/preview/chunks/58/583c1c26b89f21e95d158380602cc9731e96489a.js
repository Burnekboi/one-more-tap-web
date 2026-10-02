System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, Vec3, Music, _dec, _class, _crd, ccclass, property, ButtonController;

  function _reportPossibleCrUseOfMusic(extras) {
    _reporterNs.report("Music", "../core/Music", _context.meta, extras);
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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Music = _unresolved_2.Music;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdi", "ButtonController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'Color', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Native Cocos Button Controller with haptic/audio feedback and smooth tween animations.
       */

      _export("ButtonController", ButtonController = (_dec = ccclass('ButtonController'), _dec(_class = class ButtonController extends Component {
        constructor() {
          super(...arguments);
          this.originalScale = new Vec3(1, 1, 1);
          this.isClicking = false;
        }

        onLoad() {
          this.originalScale = new Vec3(this.node.scale.x, this.node.scale.y, this.node.scale.z);
          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onTouchStart() {
          this.isClicking = true;
          (_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
            error: Error()
          }), Music) : Music).playTap();
          tween(this.node).to(0.08, {
            scale: new Vec3(this.originalScale.x * 0.94, this.originalScale.y * 0.94, 1)
          }).start();
        }

        onTouchEnd() {
          if (!this.isClicking) return;
          this.isClicking = false;
          tween(this.node).to(0.08, {
            scale: this.originalScale
          }).start();
        }

        onTouchCancel() {
          this.isClicking = false;
          tween(this.node).to(0.08, {
            scale: this.originalScale
          }).start();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=583c1c26b89f21e95d158380602cc9731e96489a.js.map