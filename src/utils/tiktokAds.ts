// TikTok Mini Game Ads Integration (TikTok Mini / ByteDance Mini Game SDK)
// Supports native `tt.createRewardedVideoAd` on TikTok Mini Game runtime
// and provides rich in-browser simulation for development, testing, and web preview.

declare global {
  interface Window {
    tt?: any;
  }
}

export interface TikTokAdConfig {
  reviveAdUnitId: string;
  doubleRewardAdUnitId: string;
  testMode: boolean;
}

export interface TikTokAdStats {
  impressions: number;
  completedViews: number;
  revivesGranted: number;
  lastAdTimestamp: number | null;
}

const DEFAULT_CONFIG: TikTokAdConfig = {
  reviveAdUnitId: 'tt_rewarded_revive_01',
  doubleRewardAdUnitId: 'tt_rewarded_multiplier_02',
  testMode: true,
};

const STATS_STORAGE_KEY = 'one_more_tap_tiktok_ad_stats';

class TikTokAdsService {
  private config: TikTokAdConfig = { ...DEFAULT_CONFIG };
  private stats: TikTokAdStats = {
    impressions: 0,
    completedViews: 0,
    revivesGranted: 0,
    lastAdTimestamp: null,
  };
  private nativeVideoAd: any = null;
  private isLoaded: boolean = false;

  constructor() {
    this.loadStats();
    this.initNativeAd();
  }

  private loadStats() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STATS_STORAGE_KEY);
        if (stored) {
          this.stats = { ...this.stats, ...JSON.parse(stored) };
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveStats() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.stats));
      }
    } catch {
      // Ignore storage errors
    }
  }

  // Check if running inside TikTok Mini Game native container
  public isTikTokMiniNative(): boolean {
    if (typeof window === 'undefined') return false;
    return typeof (window as any).tt !== 'undefined' && typeof (window as any).tt?.createRewardedVideoAd === 'function';
  }

  // Initialize native TikTok Mini Game rewarded ad instance if available
  private initNativeAd() {
    if (!this.isTikTokMiniNative()) return;

    try {
      const tt = (window as any).tt;
      this.nativeVideoAd = tt.createRewardedVideoAd({
        adUnitId: this.config.reviveAdUnitId,
      });

      if (this.nativeVideoAd) {
        this.nativeVideoAd.onLoad(() => {
          this.isLoaded = true;
          console.log('[TikTok Mini Ads] Rewarded Video loaded successfully');
        });

        this.nativeVideoAd.onError((err: any) => {
          this.isLoaded = false;
          console.warn('[TikTok Mini Ads] Rewarded Video error:', err);
        });
      }
    } catch (err) {
      console.warn('[TikTok Mini Ads] Failed to initialize native ad:', err);
    }
  }

  public getAdUnitId(): string {
    return this.config.reviveAdUnitId;
  }

  public setAdUnitId(newId: string) {
    this.config.reviveAdUnitId = newId;
    if (this.isTikTokMiniNative()) {
      this.initNativeAd();
    }
  }

  public getStats(): TikTokAdStats {
    return { ...this.stats };
  }

  public recordImpression() {
    this.stats.impressions += 1;
    this.stats.lastAdTimestamp = Date.now();
    this.saveStats();
  }

  public recordReviveGranted() {
    this.stats.completedViews += 1;
    this.stats.revivesGranted += 1;
    this.saveStats();
  }

  // TikTok Mini Game platform capability helpers
  public isTikTokMiniNative(): boolean {
    if (typeof window === 'undefined') return false;
    const tt: any = (window as any).tt;
    return typeof tt !== 'undefined' && typeof tt.createRewardedVideoAd === 'function';
  }

  public addToDesktop(): Promise<boolean> {
    if (this.isTikTokMiniNative()) {
      const tt: any = (window as any).tt;
      if (typeof tt.addToDesktop === 'function') {
        return tt
          .addToDesktop()
          .then(() => true)
          .catch(() => false);
      }
      if (typeof tt.showFavoriteGuide === 'function') {
        try {
          tt.showFavoriteGuide();
          return Promise.resolve(true);
        } catch {
          return Promise.resolve(false);
        }
      }
    }
    return Promise.resolve(false);
  }

  public showFavoriteGuide(): void {
    if (this.isTikTokMiniNative()) {
      const tt: any = (window as any).tt;
      if (typeof tt.showFavoriteGuide === 'function') {
        tt.showFavoriteGuide();
        return;
      }
      if (typeof tt.addToDesktop === 'function') {
        tt.addToDesktop().catch(() => {});
        return;
      }
    }
  }

  public openSidebar(): void {
    if (this.isTikTokMiniNative()) {
      const tt: any = (window as any).tt;
      if (typeof tt.openSidebar === 'function') {
        tt.openSidebar();
        return;
      }
      if (typeof tt.navigateTo === 'function') {
        try {
          tt.navigateTo({ url: 'sidebar' });
        } catch {}
        return;
      }
    }
  }

  /**
   * Request to show a native TikTok Mini Rewarded Video Ad.
   * Resolves to true if completed & rewarded, false if cancelled/skipped.
   * If not in native TikTok runtime, returns null so the UI can render the interactive modal.
   */
  public async showNativeRewardedAd(): Promise<boolean | null> {
    if (!this.isTikTokMiniNative() || !this.nativeVideoAd) {
      return null; // Fallback to simulated UI
    }

    return new Promise((resolve) => {
      const tt = (window as any).tt;
      this.recordImpression();

      const onCloseHandler = (res: { isEnded?: boolean }) => {
        // Clean up listener
        try {
          this.nativeVideoAd.offClose(onCloseHandler);
        } catch {
          // ignore
        }

        if (res && (res.isEnded || (res as any).count > 0)) {
          this.recordReviveGranted();
          resolve(true);
        } else {
          resolve(false);
        }
      };

      this.nativeVideoAd.onClose(onCloseHandler);

      this.nativeVideoAd
        .show()
        .then(() => {
          console.log('[TikTok Mini Ads] Native ad displayed');
        })
        .catch(() => {
          // Retry by loading first
          this.nativeVideoAd
            .load()
            .then(() => this.nativeVideoAd.show())
            .catch((err: any) => {
              console.error('[TikTok Mini Ads] Failed to show ad:', err);
              // Fallback to simulated if native ad fails
              resolve(null);
            });
        });
    });
  }
}

export const tikTokAds = new TikTokAdsService();
