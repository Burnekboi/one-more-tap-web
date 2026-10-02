System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, GameRoot, PopupManager, Dashboard, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, UIManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameRoot(extras) {
    _reporterNs.report("GameRoot", "../GameRoot", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPopupManager(extras) {
    _reporterNs.report("PopupManager", "./PopupManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDashboard(extras) {
    _reporterNs.report("Dashboard", "./Dashboard", _context.meta, extras);
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
    }, function (_unresolved_2) {
      GameRoot = _unresolved_2.GameRoot;
    }, function (_unresolved_3) {
      PopupManager = _unresolved_3.PopupManager;
    }, function (_unresolved_4) {
      Dashboard = _unresolved_4.Dashboard;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdn", "UIManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Main UIManager orchestrator connecting all native Cocos UI nodes with game state.
       */

      _export("UIManager", UIManager = (_dec = ccclass('UIManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(_crd && PopupManager === void 0 ? (_reportPossibleCrUseOfPopupManager({
        error: Error()
      }), PopupManager) : PopupManager), _dec7 = property(_crd && Dashboard === void 0 ? (_reportPossibleCrUseOfDashboard({
        error: Error()
      }), Dashboard) : Dashboard), _dec8 = property(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
        error: Error()
      }), GameRoot) : GameRoot), _dec(_class = (_class2 = class UIManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "mainDashboard", _descriptor, this);

          _initializerDefineProperty(this, "gameplayHUD", _descriptor2, this);

          _initializerDefineProperty(this, "gameOverPanel", _descriptor3, this);

          _initializerDefineProperty(this, "victoryPanel", _descriptor4, this);

          _initializerDefineProperty(this, "popupManager", _descriptor5, this);

          _initializerDefineProperty(this, "dashboard", _descriptor6, this);

          _initializerDefineProperty(this, "gameRoot", _descriptor7, this);
        }

        onLoad() {
          if (!this.gameRoot) {
            this.gameRoot = this.node.getComponent(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
              error: Error()
            }), GameRoot) : GameRoot) || this.getComponent(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
              error: Error()
            }), GameRoot) : GameRoot) || null;
          }
        }

        getGameRoot() {
          if (!this.gameRoot) {
            this.gameRoot = this.node.getComponent(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
              error: Error()
            }), GameRoot) : GameRoot) || this.getComponent(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
              error: Error()
            }), GameRoot) : GameRoot) || null;
          }

          return this.gameRoot;
        }

        onPlayWeirdMode() {
          const root = this.getGameRoot();

          if (root) {
            root.startMode('WEIRD');
          }
        }

        onPlayCrazyMode() {
          const root = this.getGameRoot();

          if (root) {
            root.startMode('CRAZY');
          }
        }

        onOpenSettings() {
          var _this$popupManager;

          (_this$popupManager = this.popupManager) == null || _this$popupManager.openSettings();
        }

        onOpenAchievements() {
          var _this$popupManager2;

          (_this$popupManager2 = this.popupManager) == null || _this$popupManager2.openAchievements();
        }

        onOpenRewards() {
          var _this$popupManager3;

          (_this$popupManager3 = this.popupManager) == null || _this$popupManager3.openRewards();
        }

        onReturnToDashboard() {
          var _this$dashboard;

          const root = this.getGameRoot();

          if (root) {
            root.showMenu();
          }

          (_this$dashboard = this.dashboard) == null || _this$dashboard.refreshStats();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainDashboard", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gameplayHUD", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gameOverPanel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "victoryPanel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "popupManager", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "dashboard", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gameRoot", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1c245f7d9ed00471c5e8b5bec958660d42ff8e7b.js.map