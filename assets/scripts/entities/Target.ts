import { _decorator, Component, Node, Label, Graphics, UITransform, Color } from 'cc';
import { TargetItem, TargetShape } from '../template/models';
import { MathUtil } from '../core/MathUtil';

const { ccclass } = _decorator;

@ccclass('Target')
export class Target extends Component {
  public data: TargetItem | null = null;
  public graphics: Graphics | null = null;
  public label: Label | null = null;
  private currentRadius: number = 60;
  private isShrinking: boolean = false;
  private isExpanding: boolean = false;
  private onHitCallback: (() => void) | null = null;
  private colorElapsed: number = 0;
  private colorIndex: number = 0;
  private orbitAngle: number = 0;

  public init(item: TargetItem, graphics?: Graphics, onHit?: () => void) {
    this.data = item;
    if (item.orbitPhaseDeg !== undefined) {
      this.orbitAngle = item.orbitPhaseDeg;
    }
    this.currentRadius = Math.max(24, Math.round((item.size || 60) * 0.72));
    this.isShrinking = item.size ? false : true;
    this.onHitCallback = onHit || null;

    let transform = this.node.getComponent(UITransform);
    if (!transform) {
      transform = this.node.addComponent(UITransform);
    }
    transform.setContentSize(this.currentRadius * 2, this.currentRadius * 2);

    if (graphics) {
      this.graphics = graphics;
    } else {
      let g = this.node.getComponent(Graphics);
      if (!g) g = this.node.addComponent(Graphics);
      this.graphics = g;
    }

    this.renderCircle();

    if (item.label || item.requiredTaps) {
      const lblNode = new Node('Label');
      lblNode.addComponent(UITransform).setContentSize(Math.max(24, this.currentRadius * 2 - 10), Math.max(16, this.currentRadius * 2 - 10));
      this.label = lblNode.addComponent(Label);
      const rawText = item.requiredTaps ? `${item.tapsRemaining || item.requiredTaps}` : (item.label || '');
      this.label.string = rawText.replace(/[^\x20-\x7E]/g, '');
      this.label.fontSize = Math.max(11, Math.round(this.currentRadius * 0.5));
      this.label.overflow = Label.Overflow.SHRINK;
      this.label.enableWrapText = true;
      this.label.horizontalAlign = Label.HorizontalAlign.CENTER;
      this.label.verticalAlign = Label.VerticalAlign.CENTER;
      this.label.color = item.textColor ? MathUtil.hexToColor(item.textColor) : new Color(255, 255, 255, 255);
      this.node.addChild(lblNode);
    }
  }

  public checkHit(x: number, y: number): boolean {
    const nodePos = this.node.position;
    const distSq = (x - nodePos.x) * (x - nodePos.x) + (y - nodePos.y) * (y - nodePos.y);
    const hit = distSq <= (this.currentRadius * 1.15) * (this.currentRadius * 1.15);
    if (hit && this.onHitCallback) {
      this.onHitCallback();
    }
    return hit;
  }

  public updateTarget(dt: number) {
    this.updateShrink(dt);
    if (!this.data) return;

    // Color alternation logic
    if (this.data.alternatingColors && this.data.alternatingColors.length > 0 && this.data.colorIntervalSec) {
      this.colorElapsed += dt;
      if (this.colorElapsed >= this.data.colorIntervalSec) {
        this.colorElapsed = 0;
        this.colorIndex = (this.colorIndex + 1) % this.data.alternatingColors.length;
        const currentVariant = this.data.alternatingColors[this.colorIndex];
        this.data.color = currentVariant.color;
        this.data.isCorrect = currentVariant.isCorrect;
        if (currentVariant.shape) this.data.shape = currentVariant.shape;
        this.renderCircle();
      }
    }

    // Orbiting logic around center (0,0)
    if (this.data.isOrbiting && this.data.orbitRadius !== undefined && this.data.orbitSpeedDeg !== undefined) {
      this.orbitAngle += this.data.orbitSpeedDeg * dt;
      const rad = (this.orbitAngle * Math.PI) / 180;
      const x = Math.cos(rad) * this.data.orbitRadius;
      const y = Math.sin(rad) * this.data.orbitRadius;
      this.node.setPosition(x, y, 0);
    }

    // Challenge velocities are expressed as a small percentage of the
    // playfield per second. Keep targets inside the playable centre area.
    if (this.data.vx || this.data.vy) {
      const p = this.node.position;
      const nextX = p.x + (this.data.vx || 0) * 42 * dt;
      const nextY = p.y - (this.data.vy || 0) * 42 * dt;
      const limitX = 150;
      const limitY = 210;
      if (Math.abs(nextX) > limitX && this.data.vx) this.data.vx *= -1;
      if (Math.abs(nextY) > limitY && this.data.vy) this.data.vy *= -1;
      this.node.setPosition(nextX, nextY, 0);
    }
  }

  public setLabel(text: string) {
    if (this.label) this.label.string = text;
  }

  public setActiveColor(color: string, isCorrect: boolean) {
    if (!this.data) return;
    this.data.color = color;
    this.data.isCorrect = isCorrect;
    this.renderCircle();
  }

  public enableShrink() {
    this.isShrinking = true;
  }

  public enableExpand() {
    this.isExpanding = true;
  }

  public updateTaps(remaining: number) {
    if (this.label) {
      this.label.string = `${remaining}`;
    }
  }

  public updateShrink(dt: number) {
    if (this.isShrinking && this.currentRadius > 15) {
      this.currentRadius -= dt * 25;
      this.renderCircle();
    } else if (this.isExpanding && this.currentRadius < 170) {
      this.currentRadius += dt * 25;
      this.renderCircle();
    }
  }

  private renderCircle() {
    if (!this.graphics || !this.data) return;
    if (this.data.opacity === 0) {
      this.graphics.clear();
      return;
    }
    this.graphics.clear();

    const color = MathUtil.hexToColor(this.data.color);
    if (this.data.opacity !== undefined) {
      color.a = Math.floor(this.data.opacity * 255);
    }

    const shape = this.data.shape || 'circle';

    // Outer subtle glow ring
    this.graphics.fillColor = new Color(color.r, color.g, color.b, 40);
    this.shapePath(shape, this.currentRadius + 8);
    this.graphics.fill();

    // Main disc
    this.graphics.fillColor = color;
    this.shapePath(shape, this.currentRadius);
    this.graphics.fill();

    // Inner highlight border
    this.graphics.strokeColor = new Color(255, 255, 255, 200);
    this.graphics.lineWidth = 3;
    this.shapePath(shape, this.currentRadius - 2);
    this.graphics.stroke();
  }

  private shapePath(shape: TargetShape, r: number) {
    if (!this.graphics) return;
    if (shape === 'circle') {
      this.graphics.circle(0, 0, r);
    } else if (shape === 'square') {
      this.graphics.roundRect(-r, -r, r * 2, r * 2, Math.max(4, r * 0.2));
    } else if (shape === 'diamond') {
      this.graphics.moveTo(0, r);
      this.graphics.lineTo(r, 0);
      this.graphics.lineTo(0, -r);
      this.graphics.lineTo(-r, 0);
      this.graphics.close();
    } else if (shape === 'triangle') {
      this.graphics.moveTo(0, r);
      this.graphics.lineTo(r * 0.95, -r * 0.65);
      this.graphics.lineTo(-r * 0.95, -r * 0.65);
      this.graphics.close();
    } else if (shape === 'triangle') {
      this.graphics.moveTo(0, r);
      this.graphics.lineTo(r * 0.95, -r * 0.65);
      this.graphics.lineTo(-r * 0.95, -r * 0.65);
      this.graphics.close();
    } else if (shape === 'pentagon') {
      this.regularPolygon(5, r);
    } else if (shape === 'hexagon') {
      this.regularPolygon(6, r);
    } else if (shape === 'octagon') {
      this.regularPolygon(8, r);
    } else if (shape === 'nonagon') {
      this.regularPolygon(9, r);
    }
  }

  // Regular polygon (n >= 3) with flat top, centered at origin.
  private regularPolygon(n: number, r: number) {
    if (!this.graphics) return;
    const step = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++) {
      const angleDeg = i * step - Math.PI / 2;
      const px = Math.cos(angleDeg) * r;
      const py = Math.sin(angleDeg) * r;
      if (i === 0) {
        this.graphics.moveTo(px, py);
      } else {
        this.graphics.lineTo(px, py);
      }
    }
    this.graphics.close();
  }
}
