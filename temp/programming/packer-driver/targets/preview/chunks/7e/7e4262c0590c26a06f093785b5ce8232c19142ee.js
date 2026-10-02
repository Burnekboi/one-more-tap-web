System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, Vec3, Music, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, PopupManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdk", "PopupManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Native Cocos Popup Manager for modal popups (Settings, Achievements, Rewards, Confirmation)
       */

      _export("PopupManager", PopupManager = (_dec = ccclass('PopupManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = class PopupManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "settingsPopup", _descriptor, this);

          _initializerDefineProperty(this, "achievementsPopup", _descriptor2, this);

          _initializerDefineProperty(this, "rewardPopup", _descriptor3, this);

          _initializerDefineProperty(this, "confirmationPopup", _descriptor4, this);
        }

        showPopup(popupNode) {
          if (!popupNode) return;
          popupNode.active = true;
          popupNode.setScale(new Vec3(0.8, 0.8, 1));
          (_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
            error: Error()
          }), Music) : Music).playTap();
          tween(popupNode).to(0.18, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).start();
        }

        hidePopup(popupNode) {
          if (!popupNode) return;
          (_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
            error: Error()
          }), Music) : Music).playTap();
          tween(popupNode).to(0.12, {
            scale: new Vec3(0.8, 0.8, 1)
          }, {
            easing: 'backIn'
          }).call(() => {
            popupNode.active = false;
          }).start();
        }

        openSettings() {
          this.showPopup(this.settingsPopup);
        }

        closeSettings() {
          this.hidePopup(this.settingsPopup);
        }

        openAchievements() {
          this.showPopup(this.achievementsPopup);
        }

        closeAchievements() {
          this.hidePopup(this.achievementsPopup);
        }

        openRewards() {
          this.showPopup(this.rewardPopup);
        }

        closeRewards() {
          this.hidePopup(this.rewardPopup);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "settingsPopup", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "achievementsPopup", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rewardPopup", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "confirmationPopup", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7e4262c0590c26a06f093785b5ce8232c19142ee.js.map