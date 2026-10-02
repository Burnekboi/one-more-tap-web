import { Color } from 'cc';

export class MathUtil {
  public static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  public static randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  public static hexToColor(hex: string): Color {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16) || 0;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return new Color(r, g, b, 255);
  }

  public static percentToCocosPos(percentX: number, percentY: number, width = 392, height = 800): { x: number; y: number } {
    // Cocos coordinate space is centered at (0, 0)
    // percentX: 0 (left) to 100 (right) -> -360 to +360
    // percentY: 0 (top) to 100 (bottom) -> +640 to -640
    const x = (percentX / 100) * width - width / 2;
    const y = height / 2 - (percentY / 100) * height;
    return { x, y };
  }

  public static screenToGame(screenX: number, screenY: number, width = 392, height = 800): { x: number; y: number } {
    // Converts screen/UI touch coordinate to game center-offset space
    // screenX: 0..720 -> -360..+360
    // screenY: 0..1280 -> -640..+640 (Cocos Y is upwards from center)
    return {
      x: screenX - width / 2,
      y: screenY - height / 2,
    };
  }
}
