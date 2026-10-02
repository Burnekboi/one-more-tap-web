System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  function createDailySeed(dateString) {
    let hash = 0;

    for (let i = 0; i < dateString.length; i++) {
      hash = (hash << 5) - hash + dateString.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  }

  function createLCG(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = s * 16807 % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  _export({
    createDailySeed: createDailySeed,
    createLCG: createLCG,
    getTodayDateString: getTodayDateString
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "80876e1Vs5JpaSmpSDaOOjF", "dailySeed", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8dcd3054021f58f27425ca0593d5448f71989157.js.map