System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Platform, _crd;

  _export("Platform", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3d8f78366FJ06zIGC86q5rh", "platform", undefined);
      /**
       * Platform abstraction layer for TikTok Mini Game (ByteDance) & Web Preview
       */
      // Global type declaration for TikTok Mini Game runtime


      _export("Platform", Platform = class Platform {
        static isTikTok() {
          return typeof tt !== 'undefined' && typeof tt.getSystemInfoSync === 'function';
        }

        static getStorage(key) {
          try {
            if (this.isTikTok() && typeof tt.getStorageSync === 'function') {
              return tt.getStorageSync(key) || null;
            }

            if (typeof localStorage !== 'undefined') {
              return localStorage.getItem(key);
            }
          } catch (e) {
            console.warn('[Platform] Storage read failed:', e);
          }

          return null;
        }

        static setStorage(key, value) {
          try {
            if (this.isTikTok() && typeof tt.setStorageSync === 'function') {
              tt.setStorageSync(key, value);
              return;
            }

            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(key, value);
            }
          } catch (e) {
            console.warn('[Platform] Storage write failed:', e);
          }
        } // TikTok rewarded-video placement id for the Revive button (REVIVE ADS).


        static showRewardedVideoAd(onReward, onClose) {
          if (this.isTikTok() && typeof tt.createRewardedVideoAd === 'function') {
            try {
              const ad = tt.createRewardedVideoAd({
                adUnitId: this.REWARDED_VIDEO_PLACEMENT_ID
              });
              ad.onClose(res => {
                if (res && res.isEnded) {
                  onReward();
                } else {
                  onClose == null || onClose();
                }
              });
              ad.show().catch(() => {
                ad.load().then(() => ad.show()).catch(() => {
                  // If the ad fails to load/show, fail gracefully (no reward).
                  onClose == null || onClose();
                });
              });
              return;
            } catch (e) {
              console.warn('[Platform] TikTok ad error:', e);
            }
          } // Web / Editor preview fallback: instant reward simulation


          console.log('[Platform] Simulating rewarded ad in Preview/Browser...');
          setTimeout(() => {
            onReward();
          }, 200);
        }

        static showInterstitialAd() {
          if (this.isTikTok() && typeof tt.createInterstitialAd === 'function') {
            try {
              const ad = tt.createInterstitialAd({
                adUnitId: this.INTERSTITIAL_PLACEMENT_ID
              });
              ad.show().catch(() => {
                ad.load().then(() => ad.show()).catch(() => {// Failing interstitial is non-fatal; just skip it.
                });
              });
              return;
            } catch (e) {
              console.warn('[Platform] TikTok interstitial error:', e);
            }
          } // Web / Editor preview: no-op so there is nothing to dismiss.

        }

        static vibrate(short = true) {
          if (!this.isTikTok()) return;

          try {
            short ? tt.vibrateShort == null ? void 0 : tt.vibrateShort() : tt.vibrateLong == null ? void 0 : tt.vibrateLong();
          } catch (e) {}
        }

      });

      Platform.REWARDED_VIDEO_PLACEMENT_ID = 'ad7688609012350240786';
      // TikTok interstitial placement id shown on every game-over.
      Platform.INTERSTITIAL_PLACEMENT_ID = 'ad7688594863805286408';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=95a74988aeef59ccc2a2611745261bc20465c9bb.js.map