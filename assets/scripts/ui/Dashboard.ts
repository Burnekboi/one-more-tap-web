import { _decorator, Component, Node, Label, Color } from 'cc';
import { SaveManager } from '../core/SaveManager';
import { Music } from '../core/Music';
const { ccclass, property } = _decorator;

/**
 * Dashboard UI component attached directly to the MainDashboard node.
 * Coordinates all sub-panels, button clicks, and stats displays in Cocos Inspector.
 */
@ccclass('Dashboard')
export class Dashboard extends Component {
  @property(Label)
  public scoreWeirdLabel: Label | null = null;

  @property(Label)
  public scoreCrazyLabel: Label | null = null;

  @property(Label)
  public comboLabel: Label | null = null;

  @property(Label)
  public tapsLabel: Label | null = null;

  @property(Label)
  public weirdLockBadge: Label | null = null;

  @property(Label)
  public crazyLockBadge: Label | null = null;

  onLoad() {
    this.refreshStats();
  }

  public refreshStats() {
    const data = SaveManager.load();

    if (this.scoreWeirdLabel) {
      this.scoreWeirdLabel.string = `${data.bestScoreWeird || 0}`;
    }
    if (this.scoreCrazyLabel) {
      this.scoreCrazyLabel.string = `${data.bestScoreCrazy || 0}`;
    }
    if (this.comboLabel) {
      this.comboLabel.string = `x${data.highestCombo || 0}`;
    }
    if (this.tapsLabel) {
      this.tapsLabel.string = `${data.totalTaps || 0}`;
    }

    if (this.crazyLockBadge) {
      if (data.weirdModeCleared) {
        this.crazyLockBadge.string = 'UNLOCKED (50 Stages)';
        this.crazyLockBadge.color = new Color(244, 63, 94, 255);
      } else {
        this.crazyLockBadge.string = '[LOCKED] CLEAR WEIRD FIRST';
        this.crazyLockBadge.color = new Color(251, 191, 36, 255);
      }
    }
  }
}
