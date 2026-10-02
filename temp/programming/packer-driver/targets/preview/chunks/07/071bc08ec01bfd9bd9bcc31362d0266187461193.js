System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Color, SaveManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, Dashboard;

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
      Label = _cc.Label;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      SaveManager = _unresolved_2.SaveManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdj", "Dashboard", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Dashboard UI component attached directly to the MainDashboard node.
       * Coordinates all sub-panels, button clicks, and stats displays in Cocos Inspector.
       */

      _export("Dashboard", Dashboard = (_dec = ccclass('Dashboard'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec(_class = (_class2 = class Dashboard extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "scoreWeirdLabel", _descriptor, this);

          _initializerDefineProperty(this, "scoreCrazyLabel", _descriptor2, this);

          _initializerDefineProperty(this, "comboLabel", _descriptor3, this);

          _initializerDefineProperty(this, "tapsLabel", _descriptor4, this);

          _initializerDefineProperty(this, "weirdLockBadge", _descriptor5, this);

          _initializerDefineProperty(this, "crazyLockBadge", _descriptor6, this);
        }

        onLoad() {
          this.refreshStats();
        }

        refreshStats() {
          var data = (_crd && SaveManager === void 0 ? (_reportPossibleCrUseOfSaveManager({
            error: Error()
          }), SaveManager) : SaveManager).load();

          if (this.scoreWeirdLabel) {
            this.scoreWeirdLabel.string = "" + (data.bestScoreWeird || 0);
          }

          if (this.scoreCrazyLabel) {
            this.scoreCrazyLabel.string = "" + (data.bestScoreCrazy || 0);
          }

          if (this.comboLabel) {
            this.comboLabel.string = "x" + (data.highestCombo || 0);
          }

          if (this.tapsLabel) {
            this.tapsLabel.string = "" + (data.totalTaps || 0);
          }

          if (this.crazyLockBadge) {
            if (data.weirdModeCleared) {
              this.crazyLockBadge.string = 'UNLOCKED (50 Stages)';
              this.crazyLockBadge.color = new Color(244, 63, 94, 255);
            } else {
              this.crazyLockBadge.string = '[LOCKED] CLEAR WEIRD FIRST';
              this.crazyLockBadge.color = new Color(251, 191, 36, 255);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scoreWeirdLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scoreCrazyLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "comboLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "tapsLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "weirdLockBadge", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "crazyLockBadge", [_dec7], {
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
//# sourceMappingURL=071bc08ec01bfd9bd9bcc31362d0266187461193.js.map