System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameRoot, _dec, _class, _crd, ccclass, GameManager;

  function _reportPossibleCrUseOfGameRoot(extras) {
    _reporterNs.report("GameRoot", "./GameRoot", _context.meta, extras);
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
    }, function (_unresolved_2) {
      GameRoot = _unresolved_2.GameRoot;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdh", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass
      } = _decorator);
      /**
       * GameManager entry point - delegates to GameRoot to maintain backwards compatibility
       * with existing Main.scene node references.
       */

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec(_class = class GameManager extends Component {
        onLoad() {
          let root = this.node.getComponent(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
            error: Error()
          }), GameRoot) : GameRoot);

          if (!root) {
            root = this.node.addComponent(_crd && GameRoot === void 0 ? (_reportPossibleCrUseOfGameRoot({
              error: Error()
            }), GameRoot) : GameRoot);
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=42f59bac52d006379f29926c8e6ca7913ebd0c5f.js.map