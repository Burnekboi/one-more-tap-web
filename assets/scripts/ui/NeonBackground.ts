import { _decorator, Component, Graphics, Color, input, Input, EventTouch } from 'cc';
import { DESIGN_HEIGHT, DESIGN_WIDTH } from '../template/constants';
const { ccclass } = _decorator;

/**
 * Animated Neon Cyber Grid & Glow background
 * Provides modern ambient visuals without needing external texture assets.
 */
@ccclass('NeonBackground')
export class NeonBackground extends Component {
  private graphics: Graphics | null = null;
  private time: number = 0;
  private rippleX = 0;
  private rippleY = 0;
  private rippleLife = 0;

  onLoad() {
    let g = this.node.getComponent(Graphics);
    if (!g) {
      g = this.node.addComponent(Graphics);
    }
    this.graphics = g;
    input.on(Input.EventType.TOUCH_START, this.onTouch, this);
    this.drawBackground();
  }

  onDestroy() {
    input.off(Input.EventType.TOUCH_START, this.onTouch, this);
  }

  private onTouch(event: EventTouch) {
    const location = event.getUILocation ? event.getUILocation() : event.getLocation();
    this.rippleX = location.x - DESIGN_WIDTH / 2;
    this.rippleY = location.y - DESIGN_HEIGHT / 2;
    this.rippleLife = 1;
  }

  update(dt: number) {
    this.time += dt;
    this.rippleLife = Math.max(0, this.rippleLife - dt * 1.7);
    // Periodic pulse refresh every 50ms for smooth ambient glow + star twinkle
    if (this.time >= 0.05) {
      this.time = 0;
      this.drawBackground();
    }
  }

  private drawBackground() {
    if (!this.graphics) return;
    const g = this.graphics;
    g.clear();

    const w = DESIGN_WIDTH;
    const h = DESIGN_HEIGHT;
    const halfW = w / 2;
    const halfH = h / 2;
    const now = Date.now() / 1000;

    // 1. Deep space backdrop (near-black, not flat gray)
    g.fillColor = new Color(6, 6, 9, 255);
    g.rect(-halfW, -halfH, w, h);
    g.fill();

    // 2. Aurora bands (very subtle vertical falloff toward top/bottom)
    const band = (color: Color, y: number, height: number, alpha: number) => {
      g.fillColor = new Color(color.r, color.g, color.b, alpha);
      g.rect(-halfW, y, w, height);
      g.fill();
    };
    band(new Color(6, 182, 212, 255), halfH - 0, -320, 2);
    band(new Color(6, 182, 212, 255), halfH - 320, -320, 1);
    band(new Color(244, 63, 94, 255), -halfH + 0, 320, 2);
    band(new Color(244, 63, 94, 255), -halfH + 320, 320, 1);

    // 3. Center halo ring behind the content (barely-there breathing light)
    const breathe = 3 + Math.sin(now * 0.8) * 1;
    g.fillColor = new Color(120, 220, 255, Math.floor(breathe));
    g.circle(0, 0, 480);
    g.fill();

    // 4. Starfield (deterministic scatter, gentle twinkle)
    for (let i = 0; i < 72; i++) {
      const px = ((i * 97) % 137 - 68.5) * 5.1;
      const py = ((i * 149) % 255 - 127.5) * 5;
      const tw = (Math.sin(now * 2 + i * 1.7) + 1) / 2;
      const alpha = 26 + Math.floor(tw * 64);
      const cyanStar = i % 5 === 0;
      g.fillColor = new Color(150, 250, 255, alpha);
      g.circle(px, py, 2.1);
      g.fill();
      g.fillColor = new Color(cyanStar ? 150 : 235, cyanStar ? 250 : 245, cyanStar ? 255 : 250, alpha);
      g.circle(px, py, 1.1);
      g.fill();
    }

    // 5. Ambient glow orbs (kept low so UI stays readable)
    const pulseCyan = 11 + Math.sin(now * 1.5) * 3;
    g.fillColor = new Color(6, 182, 212, Math.floor(pulseCyan));
    g.circle(0, 380, 330);
    g.fill();

    const pulseRose = 9 + Math.cos(now * 1.2) * 2;
    g.fillColor = new Color(244, 63, 94, Math.floor(pulseRose));
    g.circle(0, -380, 350);
    g.fill();

    // 6. Cyber perspective grid (fainter than before)
    g.strokeColor = new Color(39, 39, 42, 32);
    g.lineWidth = 1;

    for (let x = -halfW; x <= halfW; x += 96) {
      g.moveTo(x, -halfH);
      g.lineTo(x, halfH);
      g.stroke();
    }

    for (let y = -halfH; y <= halfH; y += 96) {
      g.moveTo(-halfW, y);
      g.lineTo(halfW, y);
      g.stroke();
    }

    // 7. Corner vignette for focus depth
    const vig = (x: number, y: number, ww: number, hh: number) => {
      g.fillColor = new Color(0, 0, 0, 26);
      g.rect(x, y, ww, hh);
      g.fill();
    };
    vig(-halfW, -halfH, 84, h);
    vig(halfW - 84, -halfH, 84, h);
    vig(-halfW, halfH - 84, w, 84);
    vig(-halfW, -halfH, w, 84);

    // Each tap sends a quiet cyan radar ripple through the dashboard/game.
    if (this.rippleLife > 0) {
      const radius = 26 + (1 - this.rippleLife) * 140;
      g.strokeColor = new Color(0, 242, 254, Math.floor(this.rippleLife * 90));
      g.lineWidth = 2;
      g.circle(this.rippleX, this.rippleY, radius);
      g.stroke();
    }
  }
}
