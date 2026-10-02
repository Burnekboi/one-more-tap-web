import { PlayerData, Achievement } from '../template/models';
import { INITIAL_ACHIEVEMENTS } from '../template/achievements';
import { Platform } from './platform';

const STORAGE_KEY = 'ONE_MORE_TAP_SAVE_DATA_V2';

export class SaveManager {
  private static data: PlayerData = {
    bestScore: 0,
    bestScoreWeird: 0,
    bestScoreCrazy: 0,
    highestCombo: 0,
    totalTaps: 0,
    totalRuns: 0,
    weirdModeCleared: false,
    crazyModeCleared: false,
    trophyClaimed: false,
    soundEnabled: true,
  };

  private static achievements: Achievement[] = [...INITIAL_ACHIEVEMENTS];

  public static load(): PlayerData {
    const raw = Platform.getStorage(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      } catch (e) {}
    }
    return this.data;
  }

  public static getData(): PlayerData {
    return this.data;
  }

  public static getAchievements(): Achievement[] {
    return this.achievements;
  }

  public static updateData(partial: Partial<PlayerData>): void {
    this.data = { ...this.data, ...partial };
    Platform.setStorage(STORAGE_KEY, JSON.stringify(this.data));
    this.checkAchievements();
  }

  public static recordTap(): void {
    this.incrementTaps();
  }

  public static incrementTaps(): void {
    this.data.totalTaps++;
    Platform.setStorage(STORAGE_KEY, JSON.stringify(this.data));
    this.checkAchievements();
  }

  private static checkAchievements(): void {
    let changed = false;
    for (const ach of this.achievements) {
      if (ach.unlocked) continue;
      if (ach.id === 'first_tap' && this.data.totalTaps >= 1) {
        ach.unlocked = true;
        ach.progress = 1;
        changed = true;
      } else if (ach.id === 'getting_started' && (this.data.bestScore >= 50 || this.data.bestScoreWeird >= 50 || this.data.bestScoreCrazy >= 50)) {
        ach.unlocked = true;
        ach.progress = 50;
        changed = true;
      } else if (ach.id === 'tap_master' && this.data.totalTaps >= 100) {
        ach.unlocked = true;
        ach.progress = 100;
        changed = true;
      } else if (ach.id === 'combo_king' && this.data.highestCombo >= 25) {
        ach.unlocked = true;
        ach.progress = 25;
        changed = true;
      } else if (ach.id === 'insane' && this.data.highestCombo >= 50) {
        ach.unlocked = true;
        ach.progress = 50;
        changed = true;
      } else if (ach.id === 'weird_master' && this.data.weirdModeCleared) {
        ach.unlocked = true;
        ach.progress = 25;
        changed = true;
      } else if (ach.id === 'crazy_legend' && this.data.crazyModeCleared) {
        ach.unlocked = true;
        ach.progress = 50;
        changed = true;
      }
    }
    if (changed) {
      Platform.setStorage(STORAGE_KEY + '_ACH', JSON.stringify(this.achievements));
    }
  }
}
