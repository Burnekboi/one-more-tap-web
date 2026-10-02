import { _decorator, Component, Graphics, Color } from 'cc';

const { ccclass } = _decorator;

export interface ParticleItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: Color;
}

@ccclass('ParticleEmitter')
export class ParticleEmitter extends Component {
  private particles: ParticleItem[] = [];
  private graphics: Graphics | null = null;

  public init(graphics: Graphics) {
    this.graphics = graphics;
  }

  public emit(centerX: number, centerY: number, colorOrHex: Color | string = new Color(6, 182, 212, 255), count: number = 16) {
    let finalColor: Color;
    if (typeof colorOrHex === 'string') {
      let clean = colorOrHex.replace('#', '');
      if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
      const num = parseInt(clean, 16) || 0;
      finalColor = new Color((num >> 16) & 255, (num >> 8) & 255, num & 255, 255);
    } else {
      finalColor = colorOrHex;
    }
    this.burst(centerX, centerY, count, finalColor);
  }

  public burst(centerX: number, centerY: number, count: number = 16, color: Color = new Color(6, 182, 212, 255)) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        size: 3 + Math.random() * 5,
        color,
      });
    }
  }

  public updateParticles(dt: number) {
    if (!this.graphics || this.particles.length === 0) return;
    this.graphics.clear();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.alpha -= dt * 2.5;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      } else {
        const c = new Color(p.color.r, p.color.g, p.color.b, Math.floor(p.alpha * 255));
        this.graphics.fillColor = c;
        this.graphics.circle(p.x, p.y, p.size);
        this.graphics.fill();
      }
    }
  }
}
