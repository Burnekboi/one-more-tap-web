System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, GameState;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "01911y0CmhL9qL5X1NYHUGa", "models", undefined);

      _export("GameState", GameState = /*#__PURE__*/function (GameState) {
        GameState["MENU"] = "MENU";
        GameState["PLAYING"] = "PLAYING";
        GameState["GAME_OVER"] = "GAME_OVER";
        GameState["VICTORY"] = "VICTORY";
        GameState["ACHIEVEMENTS"] = "ACHIEVEMENTS";
        return GameState;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=010bdac1a6bd1bebb8b0aca1beda02b2ff2520ee.js.map