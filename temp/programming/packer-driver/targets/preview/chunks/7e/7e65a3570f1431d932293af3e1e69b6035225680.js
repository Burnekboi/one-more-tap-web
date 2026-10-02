System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, SaveManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, AchievementsPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSaveManager(extras) {
    _reporterNs.report("SaveManager", "../core/SaveManager", _context.meta, extras);
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
    }, function (_unresolved_2) {
      SaveManager = _unresolved_2.SaveManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdm", "AchievementsPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Graphics', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Achievements Panel UI component: populates and displays achievement trophies in Cocos Creator.
       */

      _export("AchievementsPanel", AchievementsPanel = (_dec = ccclass('AchievementsPanel'), _dec2 = property(Node), _dec3 = property(Label), _dec(_class = (_class2 = class AchievementsPanel extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "contentContainer", _descriptor, this);

          _initializerDefineProperty(this, "totalUnlockedLabel", _descriptor2, this);
        }

        onEnable() {
          this.renderAchievements();
        }

        renderAchievements() {
          var achievements = (_crd && SaveManager === void 0 ? (_reportPossibleCrUseOfSaveManager({
            error: Error()
          }), SaveManager) : SaveManager).getAchievements();
          var unlockedCount = achievements.filter(a => a.unlocked).length;

          if (this.totalUnlockedLabel) {
            this.totalUnlockedLabel.string = unlockedCount + " / " + achievements.length + " Unlocked";
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "contentContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "totalUnlockedLabel", [_dec3], {
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
//# sourceMappingURL=7e65a3570f1431d932293af3e1e69b6035225680.js.map