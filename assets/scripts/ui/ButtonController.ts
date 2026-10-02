import { _decorator, Component, Node, Button, Color, tween, Vec3 } from 'cc';
import { Music } from '../core/Music';
const { ccclass, property } = _decorator;

/**
 * Native Cocos Button Controller with haptic/audio feedback and smooth tween animations.
 */
@ccclass('ButtonController')
export class ButtonController extends Component {
  private originalScale: Vec3 = new Vec3(1, 1, 1);
  private isClicking: boolean = false;

  onLoad() {
    this.originalScale = new Vec3(this.node.scale.x, this.node.scale.y, this.node.scale.z);
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  private onTouchStart() {
    this.isClicking = true;
    Music.playTap();
    tween(this.node)
      .to(0.08, { scale: new Vec3(this.originalScale.x * 0.94, this.originalScale.y * 0.94, 1) })
      .start();
  }

  private onTouchEnd() {
    if (!this.isClicking) return;
    this.isClicking = false;
    tween(this.node)
      .to(0.08, { scale: this.originalScale })
      .start();
  }

  private onTouchCancel() {
    this.isClicking = false;
    tween(this.node)
      .to(0.08, { scale: this.originalScale })
      .start();
  }
}
