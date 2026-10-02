/**
 * Cocos Creator 3.8 TypeScript declarations shim
 * Provides editor type safety and clean IDE support for Cocos Creator APIs.
 */

declare module 'cc' {
  export const _decorator: {
    ccclass: (name?: string) => ClassDecorator;
    property: (options?: any) => PropertyDecorator;
    menu: (path: string) => ClassDecorator;
  };

  export class Vec2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
  }

  export class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z?: number): this;
    static distance(a: Vec3, b: Vec3): number;
  }

  export class Size {
    width: number;
    height: number;
    constructor(w?: number, h?: number);
  }

  export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r?: number, g?: number, b?: number, a?: number);
    static fromHEX(out: Color, hex: string): Color;
  }

  export enum ResolutionPolicy {
    EXACT_FIT = 0,
    NO_BORDER = 1,
    SHOW_ALL = 2,
    FIXED_HEIGHT = 3,
    FIXED_WIDTH = 4,
  }

  export const view: {
    setDesignResolutionSize(width: number, height: number, policy: ResolutionPolicy): void;
    getVisibleSize(): Size;
  };

  export class EventTouch {
    getLocation(): Vec2;
    getUILocation(): Vec2;
    touch: any;
  }

  export const input: {
    on(eventType: string, callback: (event: EventTouch) => void, target?: any): void;
    off(eventType: string, callback: (event: EventTouch) => void, target?: any): void;
  };

  export const Input: {
    EventType: {
      TOUCH_START: string;
      TOUCH_MOVE: string;
      TOUCH_END: string;
      TOUCH_CANCEL: string;
    };
  };

  export class Component {
    node: Node;
    enabled: boolean;
    name: string;
    destroy(): boolean;
  }

  export class Node {
    static EventType: {
      TOUCH_START: string;
      TOUCH_MOVE: string;
      TOUCH_END: string;
      TOUCH_CANCEL: string;
    };

    name: string;
    parent: Node | null;
    children: Node[];
    active: boolean;
    layer: number;
    position: Vec3;
    worldPosition: Vec3;
    scale: Vec3;

    constructor(name?: string);
    addChild(child: Node): void;
    removeChild(child: Node): void;
    destroyAllChildren(): void;
    removeFromParent(): void;
    destroy(): boolean;
    setPosition(pos: Vec3): void;
    setPosition(x: number, y: number, z?: number): void;
    setScale(scale: Vec3): void;
    setScale(x: number, y: number, z?: number): void;
    getComponent<T extends Component>(classType: new () => T | any): T | null;
    addComponent<T extends Component>(classType: new () => T | any): T;
    on(type: string, callback: (...args: any[]) => void, target?: any): void;
    off(type: string, callback?: (...args: any[]) => void, target?: any): void;
  }

  export class UITransform extends Component {
    contentSize: Size;
    anchorPoint: Vec2;
    setContentSize(size: Size): void;
    setContentSize(width: number, height: number): void;
    setAnchorPoint(point: Vec2): void;
    setAnchorPoint(x: number, y: number): void;
  }

  export class Canvas extends Component {
    cameraComponent: Camera;
    alignCanvasWithScreen: boolean;
  }

  export class Camera extends Component {
    priority: number;
    visibility: number;
  }

  export class Label extends Component {
    string: string;
    fontSize: number;
    lineHeight: number;
    color: Color;
    horizontalAlign: number;
    verticalAlign: number;
    overflow: number;
  }

  export class SpriteFrame {
    name: string;
  }

  export class Sprite extends Component {
    spriteFrame: SpriteFrame | null;
    color: Color;
    sizeMode: number;
    type: number;
  }

  export class Button extends Component {
    target: Node;
    interactable: boolean;
    transition: number;
    zoomScale: number;
    duration: number;
  }

  export class Layout extends Component {
    type: number;
    resizeMode: number;
    spacingX: number;
    spacingY: number;
    verticalDirection: number;
    horizontalDirection: number;
  }

  export class Widget extends Component {
    isAlignTop: boolean;
    isAlignBottom: boolean;
    isAlignLeft: boolean;
    isAlignRight: boolean;
    isAlignHorizontalCenter: boolean;
    isAlignVerticalCenter: boolean;
    top: number;
    bottom: number;
    left: number;
    right: number;
    horizontalCenter: number;
    verticalCenter: number;
    alignMode: number;
    updateAlignment(): void;
  }

  export class Graphics extends Component {
    lineWidth: number;
    strokeColor: Color;
    fillColor: Color;
    clear(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    circle(cx: number, cy: number, r: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
    fill(): void;
    stroke(): void;
  }

  export class AudioSource extends Component {
    clip: any;
    play(): void;
    stop(): void;
    pause(): void;
    volume: number;
    loop: boolean;
  }

  export const director: {
    loadScene(sceneName: string): boolean;
    getScene(): any;
  };

  export class Tween<T> {
    constructor(target?: T);
    to(duration: number, props: any, opts?: any): this;
    by(duration: number, props: any, opts?: any): this;
    delay(duration: number): this;
    call(callback: Function): this;
    start(): this;
    stop(): this;
  }

  export function tween<T>(target?: T): Tween<T>;
}

// Global TikTok / ByteDance Mini Game SDK
interface TikTokSDK {
  getSystemInfoSync?: () => any;
  getStorageSync?: (key: string) => any;
  setStorageSync?: (key: string, data: any) => void;
  createRewardedVideoAd?: (params: { adUnitId: string }) => any;
  showToast?: (params: any) => void;
  [key: string]: any;
}

declare const tt: TikTokSDK | undefined;
