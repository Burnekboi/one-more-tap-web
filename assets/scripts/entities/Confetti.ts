import { _decorator, Component, Graphics, Color } from 'cc';

const { ccclass } = _decorator;

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: Color;
  rot: number;
  vrot: number;
  life: number;
  maxLife: number;
  flutter: number;
  flutterPhase: number;
}

const CONFETTI_PALETTE = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#facc15'];

@ccclass('Confetti')
export class Confetti extends Component {
  private pieces: ConfettiPiece[] = [];
  private graphics: Graphics | null = null;

  public init(graphics: Graphics) {
    this.graphics = graphics;
  }

  public burst(count: number = 70) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 160 + Math.random() * 340;
      const hex = CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)];
      const num = parseInt(hex.replace('#', ''), 16);
      const color = new Color((num >> 16) & 255, (num >> 8) & 255, num & 255, 255);
      const life = 1.6 + Math.random() * 1.4;
      this.pieces.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 120,
        w: 5 + Math.random() * 6,
        h: 10 + Math.random() * 8,
        color,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 8,
        life,
        maxLife: life,
        flutter: 2 + Math.random() * 4,
        flutterPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  public clear() {
    this.pieces = [];
    if (this.graphics) this.graphics.clear();
  }

  public updateConfetti(dt: number) {
    if (!this.graphics) return;
    const g = this.graphics;
    g.clear();
    if (this.pieces.length === 0) return;

    for (let i = this.pieces.length - 1; i >= 0; i--) {
      const p = this.pieces[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.pieces.splice(i, 1);
        continue;
      }
      p.vy -= 300 * dt; // gravity pulls pieces back down
      p.x += p.vx * dt;
      p.y += (p.vy + Math.sin(p.flutterPhase) * 30) * dt;
      p.flutterPhase += p.flutter * dt;
      p.rot += p.vrot * dt;

      const fade = Math.min(1, p.life / 0.4);
      const c = new Color(p.color.r, p.color.g, p.color.b, Math.floor(fade * 255));

      // Draw each piece as a rotated rectangle polygon. Only moveTo/lineTo/
      // close/fill are used (no Graphics transforms) so it renders everywhere.
      const cos = Math.cos(p.rot);
      const sin = Math.sin(p.rot);
      const hw = p.w / 2;
      const hh = p.h / 2;

      g.fillColor = c;
      g.moveTo(p.x + (-hw * cos - -hh * sin), p.y + (-hw * sin + -hh * cos));
      g.lineTo(p.x + (hw * cos - -hh * sin), p.y + (hw * sin + -hh * cos));
      g.lineTo(p.x + (hw * cos - hh * sin), p.y + (hw * sin + hh * cos));
      g.lineTo(p.x + (-hw * cos - hh * sin), p.y + (-hw * sin + hh * cos));
      g.close();
      g.fill();
    }
  }
}