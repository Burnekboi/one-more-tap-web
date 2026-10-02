/**
 * Platform abstraction layer for TikTok Mini Game (ByteDance) & Web Preview
 */

// Global type declaration for TikTok Mini Game runtime
declare const tt: any;

export class Platform {
  public static isTikTok(): boolean {
    return typeof tt !== 'undefined' && typeof tt.getSystemInfoSync === 'function';
  }

  public static getStorage(key: string): string | null {
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

  public static setStorage(key: string, value: string): void {
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
  }

  // TikTok rewarded-video placement id for the Revive button (REVIVE ADS).
  public static readonly REWARDED_VIDEO_PLACEMENT_ID = 'ad7688609012350240786';

  // TikTok interstitial placement id shown on every game-over.
  public static readonly INTERSTITIAL_PLACEMENT_ID = 'ad7688594863805286408';

  public static showRewardedVideoAd(onReward: () => void, onClose?: () => void): void {
    if (this.isTikTok() && typeof tt.createRewardedVideoAd === 'function') {
      try {
        const ad = tt.createRewardedVideoAd({ adUnitId: this.REWARDED_VIDEO_PLACEMENT_ID });
        ad.onClose((res: any) => {
          if (res && res.isEnded) {
            onReward();
          } else {
            onClose?.();
          }
        });
        ad.show().catch(() => {
          ad.load().then(() => ad.show()).catch(() => {
            // If the ad fails to load/show, fail gracefully (no reward).
            onClose?.();
          });
        });
        return;
      } catch (e) {
        console.warn('[Platform] TikTok ad error:', e);
      }
    }

    // Web / Editor preview fallback: instant reward simulation
    console.log('[Platform] Simulating rewarded ad in Preview/Browser...');
    setTimeout(() => {
      onReward();
    }, 200);
  }

  public static showInterstitialAd(): void {
    if (this.isTikTok() && typeof tt.createInterstitialAd === 'function') {
      try {
        const ad = tt.createInterstitialAd({ adUnitId: this.INTERSTITIAL_PLACEMENT_ID });
        ad.show().catch(() => {
          ad.load().then(() => ad.show()).catch(() => {
            // Failing interstitial is non-fatal; just skip it.
          });
        });
        return;
      } catch (e) {
        console.warn('[Platform] TikTok interstitial error:', e);
      }
    }
    // Web / Editor preview: no-op so there is nothing to dismiss.
  }

  public static vibrate(short = true): void {
    if (!this.isTikTok()) return;
    try {
      short ? tt.vibrateShort?.() : tt.vibrateLong?.();
    } catch (e) {}
  }

  // Add to Desktop / Favorite (Desktop Shortcut capability)
  public static addToDesktop(): Promise<boolean> {
    if (this.isTikTok() && typeof tt.addToDesktop === 'function') {
      return tt
        .addToDesktop()
        .then(() => true)
        .catch((err: any) => {
          console.warn('[Platform] addToDesktop failed:', err);
          return false;
        });
    }
    if (this.isTikTok() && typeof tt.showFavoriteGuide === 'function') {
      try {
        tt.showFavoriteGuide();
        return Promise.resolve(true);
      } catch (err) {
        console.warn('[Platform] showFavoriteGuide failed:', err);
      }
    }
    console.log('[Platform] addToDesktop not available in Preview/Browser');
    return Promise.resolve(false);
  }

  public static showFavoriteGuide(): void {
    if (this.isTikTok() && typeof tt.showFavoriteGuide === 'function') {
      try {
        tt.showFavoriteGuide();
      } catch (err) {
        console.warn('[Platform] showFavoriteGuide failed:', err);
      }
      return;
    }
    if (this.isTikTok() && typeof tt.addToDesktop === 'function') {
      tt.addToDesktop?.().catch(() => {});
      return;
    }
    console.log('[Platform] Favorite guide not available in Preview/Browser');
  }

  // Sidebar capability
  public static openSidebar(): void {
    if (this.isTikTok() && typeof tt.openSidebar === 'function') {
      try {
        tt.openSidebar();
      } catch (err) {
        console.warn('[Platform] openSidebar failed:', err);
      }
      return;
    }
    if (this.isTikTok() && typeof tt.navigateTo === 'function') {
      try {
        tt.navigateTo({ url: 'sidebar' });
      } catch (err) {
        console.warn('[Platform] navigateTo sidebar failed:', err);
      }
      return;
    }
    console.log('[Platform] Sidebar not available in Preview/Browser');
  }

  public static hasDesktopShortcutAPI(): boolean {
    if (!this.isTikTok()) return false;
    return typeof tt.addToDesktop === 'function' || typeof tt.showFavoriteGuide === 'function';
  }

  public static hasSidebarAPI(): boolean {
    if (!this.isTikTok()) return false;
    return typeof tt.openSidebar === 'function' || typeof tt.navigateTo === 'function';
  }
}
