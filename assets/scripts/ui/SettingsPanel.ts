import { _decorator, Component, Node, Label, Color } from 'cc';
import { Music } from '../core/Music';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
  @property(Label)
  public audioStatusLabel: Label | null = null;

  onEnable() {
    this.updateStatus();
  }

  public toggleMute() {
    Music.setMuted(!Music.isMuted());
    this.updateStatus();
  }

  private updateStatus() {
    if (this.audioStatusLabel) {
      this.audioStatusLabel.string = Music.isMuted() ? 'SOUND: OFF' : 'SOUND: ON';
      this.audioStatusLabel.color = Music.isMuted() ? new Color(239, 68, 68, 255) : new Color(16, 185, 129, 255);
    }
  }
}
