import { _decorator, Component, Node, Label, Graphics, Color } from 'cc';
import { SaveManager } from '../core/SaveManager';
import { Achievement } from '../template/models';
const { ccclass, property } = _decorator;

/**
 * Achievements Panel UI component: populates and displays achievement trophies in Cocos Creator.
 */
@ccclass('AchievementsPanel')
export class AchievementsPanel extends Component {
  @property(Node)
  public contentContainer: Node | null = null;

  @property(Label)
  public totalUnlockedLabel: Label | null = null;

  onEnable() {
    this.renderAchievements();
  }

  public renderAchievements() {
    const achievements = SaveManager.getAchievements();
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    if (this.totalUnlockedLabel) {
      this.totalUnlockedLabel.string = `${unlockedCount} / ${achievements.length} Unlocked`;
    }
  }
}
