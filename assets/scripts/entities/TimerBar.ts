import { _decorator, Component, Graphics, Label, Color } from 'cc';
import { MAX_TIMER_BANK_SEC } from '../template/constants';

const { ccclass } = _decorator;

@ccclass('TimerBar')
export class TimerBar extends Component {
  private graphics: Graphics | null = null;
  private label: Label | null = null;

  public init(graphics: Graphics, label: Label) {
    this.graphics = graphics;
    this.label = label;
  }

  public updateTimer(currentSec: number, maxSec: number = MAX_TIMER_BANK_SEC) {
    this.render(currentSec, maxSec);
  }

  public render(currentSec: number, maxSec: number = MAX_TIMER_BANK_SEC) {
    if (this.label) {
      this.label.string = `${Math.max(0, currentSec).toFixed(1)}s`;
    }

    if (!this.graphics) return;
    this.graphics.clear();

    const barWidth = 348;
    const barHeight = 18;
    const radius = 9;

    // Background track with subtle border
    this.graphics.fillColor = new Color(24, 24, 27, 230);
    this.graphics.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, radius);
    this.graphics.fill();

    this.graphics.strokeColor = new Color(39, 39, 42, 255);
    this.graphics.lineWidth = 2;
    this.graphics.stroke();

    // Fill percent
    const pct = Math.max(0, Math.min(1, currentSec / maxSec));
    if (pct > 0.01) {
      if (pct <= 0.25) {
        const pulse = 190 + Math.round((Math.sin(Date.now() / 90) + 1) * 32);
        this.graphics.fillColor = new Color(pulse, 68, 68, 255); // Pulsing crimson
      } else if (pct <= 0.5) {
        this.graphics.fillColor = new Color(245, 158, 11, 255); // Amber
      } else {
        this.graphics.fillColor = new Color(16, 185, 129, 255); // Neon mint active
      }
      this.graphics.roundRect(-barWidth / 2, -barHeight / 2, barWidth * pct, barHeight, radius);
      this.graphics.fill();
    }
  }
}
