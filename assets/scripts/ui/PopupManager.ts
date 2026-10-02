import { _decorator, Component, Node, Label, tween, Vec3 } from 'cc';
import { Music } from '../core/Music';
const { ccclass, property } = _decorator;

/**
 * Native Cocos Popup Manager for modal popups (Settings, Achievements, Rewards, Confirmation)
 */
@ccclass('PopupManager')
export class PopupManager extends Component {
  @property(Node)
  public settingsPopup: Node | null = null;

  @property(Node)
  public achievementsPopup: Node | null = null;

  @property(Node)
  public rewardPopup: Node | null = null;

  @property(Node)
  public confirmationPopup: Node | null = null;

  public showPopup(popupNode: Node | null) {
    if (!popupNode) return;
    popupNode.active = true;
    popupNode.setScale(new Vec3(0.8, 0.8, 1));
    Music.playTap();

    tween(popupNode)
      .to(0.18, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
      .start();
  }

  public hidePopup(popupNode: Node | null) {
    if (!popupNode) return;
    Music.playTap();

    tween(popupNode)
      .to(0.12, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'backIn' })
      .call(() => {
        popupNode.active = false;
      })
      .start();
  }

  public openSettings() {
    this.showPopup(this.settingsPopup);
  }

  public closeSettings() {
    this.hidePopup(this.settingsPopup);
  }

  public openAchievements() {
    this.showPopup(this.achievementsPopup);
  }

  public closeAchievements() {
    this.hidePopup(this.achievementsPopup);
  }

  public openRewards() {
    this.showPopup(this.rewardPopup);
  }

  public closeRewards() {
    this.hidePopup(this.rewardPopup);
  }
}
