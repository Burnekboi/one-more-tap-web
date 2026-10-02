System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Color, Music, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, SettingsPanel;

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
      Label = _cc.Label;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      Music = _unresolved_2.Music;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "43015qRSbhGy4Sq89bOdGdl", "SettingsPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SettingsPanel", SettingsPanel = (_dec = ccclass('SettingsPanel'), _dec2 = property(Label), _dec(_class = (_class2 = class SettingsPanel extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "audioStatusLabel", _descriptor, this);
        }

        onEnable() {
          this.updateStatus();
        }

        toggleMute() {
          (_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
            error: Error()
          }), Music) : Music).setMuted(!(_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
            error: Error()
          }), Music) : Music).isMuted());
          this.updateStatus();
        }

        updateStatus() {
          if (this.audioStatusLabel) {
            this.audioStatusLabel.string = (_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
              error: Error()
            }), Music) : Music).isMuted() ? 'SOUND: OFF' : 'SOUND: ON';
            this.audioStatusLabel.color = (_crd && Music === void 0 ? (_reportPossibleCrUseOfMusic({
              error: Error()
            }), Music) : Music).isMuted() ? new Color(239, 68, 68, 255) : new Color(16, 185, 129, 255);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "audioStatusLabel", [_dec2], {
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
//# sourceMappingURL=3ed74b507f020ea5e1c8c9d6f5199c04d3eee36d.js.map