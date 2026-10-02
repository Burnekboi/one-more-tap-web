import { _decorator, Component, Node, Label, Graphics, UITransform, Widget, Color, EventTouch, Vec2, Vec3, view, ResolutionPolicy, input, Input, resources, Sprite, SpriteFrame } from 'cc';
import { GameMode, GameState, ActiveChallenge, TargetItem, Achievement, PlayerData } from './template/models';
import { FlowController } from './core/flow';
import { GameContext } from './core/ctx';
import { SaveManager } from './core/SaveManager';
import { Platform } from './core/platform';
import { Music } from './core/Music';
import { MathUtil } from './core/MathUtil';
import { generateStageChallenge } from './challenges/challenges';
import { getTodayDateString } from './challenges/dailySeed';
import { TimerBar } from './entities/TimerBar';
import { ParticleEmitter } from './entities/Particle';
import { Confetti } from './entities/Confetti';
import { Target } from './entities/Target';
import { NeonBackground } from './ui/NeonBackground';
import { WEIRD_STAGE_COUNT, CRAZY_STAGE_COUNT, DESIGN_WIDTH, DESIGN_HEIGHT, INITIAL_TIMER_BANK_SEC, MAX_TIMER_BANK_SEC, TIMER_BONUS_SEC, COMBO_TIMER_BONUS_SEC } from './template/constants';

const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
  private ctx: GameContext = FlowController.createInitialContext('WEIRD');

  // Hierarchy containers
  private canvasNode: Node | null = null;
  private menuNode: Node | null = null;
  private hudNode: Node | null = null;
  private targetsContainer: Node | null = null;
  private gameOverNode: Node | null = null;
  private reviveBtnNode: Node | null = null;
  private victoryNode: Node | null = null;
  private vicTitleLabel: Label | null = null;
  private vicTitleGlowLabel: Label | null = null;
  private vicSubLabel: Label | null = null;
  private trophyNode: Node | null = null;
  private achievementsNode: Node | null = null;

  // HUD elements
  private labelStage: Label | null = null;
  private labelScore: Label | null = null;
  private labelCombo: Label | null = null;
  private labelPrompt: Label | null = null;
  private timerBar: TimerBar | null = null;
  private particleEmitter: ParticleEmitter | null = null;
  private confettiEmitter: Confetti | null = null;
  private weirdOrder: number[] = [];
  private crazyOrder: number[] = [];
  private gameOverFailureLabel: Label | null = null;
  private gameOverScoreLabel: Label | null = null;

  // Active runtime targets
  private activeTargetComponents: Target[] = [];

  // Menu dashboard dynamic state
  private menuZones: { name: string; cx: number; cy: number; w: number; h: number; action: () => void }[] = [];
  private menuCrazySub: Label | null = null;
  private menuCrazyGraphics: Graphics | null = null;
  private menuCrazyW = 0;
  private menuCrazyH = 0;
  private menuBtnW = 0;
  private trophyDisplayCard: Node | null = null;
  private trophyDisplayLabel: Label | null = null;
  private recordsLabel: Label | null = null;
  private menuSoundLabel: Label | null = null;
  private achListContainer: Node | null = null;
  private achCountLabel: Label | null = null;
  private achStatsLabel: Label | null = null;
  private challengeElapsed = 0;
  private expectedSequence = 1;
  private collectRemaining = 0;
  private flashMemoryTriggered = false;
  private stopPauseActive = false;
  private stopPauseTimer = 0;
  private stopPauseTarget: Target | null = null;
  private stopResumeColor = '#f59e0b';
  private stopResumeLabel = '';
  private stopResumePrompt = '';
  private countdownTarget: Target | null = null;
  private countdownRemaining = 0;
  private countdownActive = false;

  onLoad() {
    console.log('[GameRoot] Cocos Creator 3.8.8 Bootstrapping One More Tap Native UI...');
    view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, ResolutionPolicy.SHOW_ALL);
    SaveManager.load();
  }

  start() {
    this.canvasNode = this.node;
    this.bindOrBuildSceneGraph();
    this.registerInput();
    const save = SaveManager.getData();
    Music.setMuted(!(save.soundEnabled ?? true));
    this.showMenu();
    console.log(`[Dashboard] v3 zones ready (${this.menuZones.length} buttons) @ ${Date.now()}`);
  }

  private registerInput() {
    // Graphics-only targets do not participate in Cocos UI hit testing. Listen
    // at the input layer so every physical tap reaches game target detection.
    input.on(Input.EventType.TOUCH_START, this.handleTouch, this);
  }

  onDestroy() {
    input.off(Input.EventType.TOUCH_START, this.handleTouch, this);
  }

  private bindOrBuildSceneGraph() {
    // 0. Ensure Neon Cyber Background
    let bgNode = this.node.children.find(c => c.name === 'Background');
    if (!bgNode) {
      bgNode = new Node('Background');
      bgNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
      this.node.addChild(bgNode);
      bgNode.setSiblingIndex(0);
    }
    if (!bgNode.getComponent(NeonBackground)) {
      bgNode.addComponent(NeonBackground);
    }

    // 1. Connect or create HUD
    // The saved scene's HUD was positioned for 720x1280 and overlays a
    // 392x800 device. Retain it for editor compatibility but never render it.
    const existingHUD = this.node.children.find(c => c.name === 'GameplayHUD');
    if (existingHUD) existingHUD.active = false;
    this.buildHUDGraph();

    // Connect Particles
    let effectsLayer = this.node.children.find(c => c.name === 'EffectsLayer');
    let particleNode = (effectsLayer || this.hudNode)?.children.find(c => c.name === 'ParticleNode');
    if (!particleNode) {
      particleNode = new Node('ParticleNode');
      const gParticle = particleNode.addComponent(Graphics);
      (effectsLayer || this.hudNode)?.addChild(particleNode);
      this.particleEmitter = particleNode.addComponent(ParticleEmitter);
      this.particleEmitter.init(gParticle);
    } else {
      let gParticle = particleNode.getComponent(Graphics) || particleNode.addComponent(Graphics);
      this.particleEmitter = particleNode.getComponent(ParticleEmitter) || particleNode.addComponent(ParticleEmitter);
      this.particleEmitter.init(gParticle);
    }

    // 2. Build the responsive Menu / Dashboard (dynamic scene-graph)
    const existingDashboard = this.node.children.find(c => c.name === 'MainDashboard');
    if (existingDashboard) {
      existingDashboard.active = false;
    }
    this.buildMenuGraph();

    // 3. Build GameOver Screen
    this.buildGameOverGraph();

    // 4. Build Victory Screen
    this.buildVictoryGraph();

    // 5. Build Achievements Screen
    this.buildAchievementsGraph();
    this.buildPlatformButtons();
  }

  private buildHUDGraph() {
    this.hudNode = new Node('GameplayHUD');
    this.hudNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    this.canvasNode!.addChild(this.hudNode);

    const stageNode = new Node('StageLabel');
    stageNode.addComponent(UITransform).setContentSize(340, 24);
    stageNode.setPosition(new Vec3(0, 340, 0));
    this.labelStage = stageNode.addComponent(Label);
    this.labelStage.string = 'WEIRD MODE - STAGE 1/24';
    this.labelStage.fontSize = 15;
    this.labelStage.color = new Color(16, 185, 129, 255);
    this.labelStage.isBold = true;
    this.labelStage.overflow = Label.Overflow.SHRINK;
    this.labelStage.enableWrapText = false;
    this.labelStage.horizontalAlign = Label.HorizontalAlign.CENTER;
    this.labelStage.verticalAlign = Label.VerticalAlign.CENTER;
    this.hudNode.addChild(stageNode);

    const scoreNode = new Node('ScoreLabel');
    scoreNode.setPosition(new Vec3(-105, -350, 0));
    this.labelScore = scoreNode.addComponent(Label);
    this.labelScore.string = 'SCORE: 0';
    this.labelScore.fontSize = 18;
    this.labelScore.color = new Color(255, 255, 255, 255);
    this.hudNode.addChild(scoreNode);

    const comboNode = new Node('ComboLabel');
    comboNode.setPosition(new Vec3(118, -350, 0));
    this.labelCombo = comboNode.addComponent(Label);
    this.labelCombo.string = '';
    this.labelCombo.fontSize = 15;
    this.labelCombo.color = new Color(251, 191, 36, 255);
    this.hudNode.addChild(comboNode);

    const timerBarNode = new Node('TimerBar');
    timerBarNode.setPosition(new Vec3(0, 300, 0));
    const gTimer = timerBarNode.addComponent(Graphics);
    const timerTextNode = new Node('TimerText');
    const lTimer = timerTextNode.addComponent(Label);
    lTimer.fontSize = 18;
    lTimer.color = new Color(255, 255, 255, 255);
    timerBarNode.addChild(timerTextNode);
    this.hudNode.addChild(timerBarNode);

    this.timerBar = timerBarNode.addComponent(TimerBar);
    this.timerBar.init(gTimer, lTimer);

    const promptBgNode = new Node('PromptBg');
    promptBgNode.setPosition(new Vec3(0, 240, 0));
    const gPrompt = promptBgNode.addComponent(Graphics);
    gPrompt.fillColor = new Color(24, 24, 27, 230);
    gPrompt.roundRect(-174, -32, 348, 64, 16);
    gPrompt.fill();
    gPrompt.strokeColor = new Color(39, 39, 42, 255);
    gPrompt.lineWidth = 2;
    gPrompt.stroke();
    this.hudNode.addChild(promptBgNode);

    const promptTextNode = new Node('PromptText');
    promptTextNode.setPosition(new Vec3(0, 240, 0));
    promptTextNode.addComponent(UITransform).setContentSize(336, 60);
    this.labelPrompt = promptTextNode.addComponent(Label);
    this.labelPrompt.string = 'GET READY!';
    this.labelPrompt.fontSize = 18;
    this.labelPrompt.color = new Color(255, 255, 255, 255);
    this.labelPrompt.overflow = Label.Overflow.SHRINK;
    this.labelPrompt.enableWrapText = true;
    this.labelPrompt.horizontalAlign = Label.HorizontalAlign.CENTER;
    this.labelPrompt.verticalAlign = Label.VerticalAlign.CENTER;
    this.hudNode.addChild(promptTextNode);

    this.targetsContainer = new Node('TargetsContainer');
    this.hudNode.addChild(this.targetsContainer);
  }

  private menuLabel(parent: Node, name: string, text: string, fontSize: number, color: Color, width?: number): Label {
    const node = new Node(name);
    const ut = node.addComponent(UITransform);
    ut.setContentSize(width || 0, Math.round(fontSize * 1.4));
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.color = color;
    label.overflow = Label.Overflow.SHRINK;
    label.enableWrapText = false;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.isBold = true;
    parent.addChild(node);
    return label;
  }

  private menuButton(parent: Node, name: string, w: number, h: number, radius: number, fill: Color, accent?: Color): Node {
    const node = new Node(name);
    node.addComponent(UITransform).setContentSize(w, h);
    const g = node.addComponent(Graphics);
    this.drawPanel(g, w, h, radius, fill, accent);
    parent.addChild(node);
    return node;
  }

  private registerMenuZone(node: Node, action: () => void) {
    const p = node.position;
    const ut = node.getComponent(UITransform);
    this.menuZones.push({
      name: node.name,
      cx: p.x,
      cy: p.y,
      w: ut ? ut.width : 0,
      h: ut ? ut.height : 0,
      action,
    });
  }

  private drawPanel(g: Graphics, w: number, h: number, radius: number, fill: Color, accent?: Color) {
    g.clear();

    for (let i = 1; i <= 3; i++) {
      const ex = i * 7;
      g.fillColor = new Color(fill.r, fill.g, fill.b, Math.max(4, Math.floor(fill.a * 0.05 * (4 - i))));
      g.roundRect(-w / 2 - ex, -h / 2 - ex, w + ex * 2, h + ex * 2, radius + ex);
      g.fill();
    }

    g.fillColor = fill;
    g.roundRect(-w / 2, -h / 2, w, h, radius);
    g.fill();

    if (accent) {
      g.fillColor = accent;
      g.roundRect(-w / 2 + 10, -h / 2 + h * 0.16, 5, h * 0.68, 2.5);
      g.fill();
    }

    // Top sheen + bottom shade give each card a tactile, arcade-control feel.
    g.fillColor = new Color(255, 255, 255, Math.min(32, Math.floor(fill.a * 0.13)));
    g.roundRect(-w / 2 + 2, h * 0.08, w - 4, h * 0.40, Math.max(5, radius - 2));
    g.fill();
    g.fillColor = new Color(0, 0, 0, Math.floor(fill.a * 0.20));
    g.roundRect(-w / 2, -h / 2, w, h * 0.46, radius);
    g.fill();

    g.strokeColor = new Color(255, 255, 255, 26);
    g.lineWidth = 1.5;
    g.roundRect(-w / 2 + 1.5, -h / 2 + 1.5, w - 3, h - 3, radius);
    g.stroke();

    // Fine scan line: subtle visual motion is supplied by the background.
    g.fillColor = new Color(255, 255, 255, 18);
    g.rect(-w / 2 + 16, -2, w - 32, 1);
    g.fill();
  }

  private buildMenuGraph() {
    const canvasTransform = this.canvasNode!.getComponent(UITransform);
    const W = canvasTransform ? canvasTransform.width : DESIGN_WIDTH;
    const H = canvasTransform ? canvasTransform.height : DESIGN_HEIGHT;
    const safeTop = Math.round(H * 0.05);
    const safeBottom = Math.round(H * 0.05);
    const safeLeft = Math.round(W * 0.04);
    const safeRight = Math.round(W * 0.04);
    const innerW = W - safeLeft - safeRight;
    const gap = Math.round(H * 0.012);
    const padTop = Math.round(H * 0.015);
    const padBottom = Math.round(H * 0.015);
    const fsH = (fs: number) => Math.round(fs * 1.4);

    this.menuNode = new Node('MenuScreen');
    this.menuNode.addComponent(UITransform).setContentSize(W, H);
    this.canvasNode!.addChild(this.menuNode);

    this.buildDashboardAtmosphere(W, H);

    // Safe-area root pinned to the canvas edges
    const safeArea = new Node('SafeArea');
    safeArea.addComponent(UITransform).setContentSize(W, H);
    const safeWidget = safeArea.addComponent(Widget);
    safeWidget.isAlignTop = true;
    safeWidget.isAlignBottom = true;
    safeWidget.isAlignLeft = true;
    safeWidget.isAlignRight = true;
    safeWidget.top = safeTop;
    safeWidget.bottom = safeBottom;
    safeWidget.left = safeLeft;
    safeWidget.right = safeRight;
    safeWidget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
    safeWidget.updateAlignment();
    this.menuNode.addChild(safeArea);

    const soundOn = SaveManager.getData().soundEnabled ?? true;
    const soundW = Math.round(innerW * 0.45);
    const soundBtn = this.menuButton(safeArea, 'SoundToggle', soundW, 54, 27, new Color(24, 24, 27, 245), new Color(96, 235, 255, 220));
    soundBtn.setPosition(new Vec3(innerW / 2 - Math.round(innerW * 0.26), H / 2 - safeTop - 27, 0));
    this.registerMenuZone(soundBtn, () => this.toggleSound());
    this.menuSoundLabel = this.menuLabel(soundBtn, 'LblSound', soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF', 21, soundOn ? new Color(96, 235, 255, 255) : new Color(244, 63, 94, 255), Math.round(innerW * 0.42));
    this.menuSoundLabel.node.setPosition(Vec3.ZERO);

    // Compute every block height up front, then stack top-down inside a centered column
    const brandGap = Math.round(H * 0.008);
    const titleFont = Math.min(40, Math.floor(innerW / 9.5));
    const subFont = Math.min(18, Math.floor(innerW / 18));
    const titleH = fsH(titleFont);
    const subH = fsH(subFont);
    const brandH = padTop + titleH + brandGap + subH + padBottom + 80;
    const btnH = Math.round(H * 0.095);
    const achH = Math.round(H * 0.065);
    const trophyH = Math.round(H * 0.08);
    // Tappable cards are slightly narrower than the full safe area so dashboard
    // background taps are dead zones and only the intended buttons start a game.
    const btnW = Math.round(innerW * 0.9);
    this.menuBtnW = btnW;
    const totalH = brandH + btnH * 3 + achH + trophyH + gap * 6;

    const column = new Node('MenuColumn');
    column.addComponent(UITransform).setContentSize(innerW, totalH);
    const colWidget = column.addComponent(Widget);
    colWidget.isAlignHorizontalCenter = true;
    colWidget.isAlignVerticalCenter = true;
    colWidget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
    colWidget.updateAlignment();
    safeArea.addChild(column);

    let cursor = totalH / 2;
    const placeBlock = (node: Node, h: number) => {
      cursor -= h;
      node.setPosition(new Vec3(0, cursor + h / 2, 0));
      cursor -= gap;
    };

    // Brand header: title, underline, tagline (TikTok Mini Game badge pill removed)
    const brandBlock = new Node('BrandBlock');
    brandBlock.addComponent(UITransform).setContentSize(innerW, brandH);
    column.addChild(brandBlock);
    placeBlock(brandBlock, brandH);

    let brandY = brandH / 2 - padTop;
    brandY -= titleH / 2;
    const titleY = brandY;
    const titleW = Math.round(innerW * 0.98);
    // Cool neon title: cyan glow halo layer + outlined, shadowed bold main label
    const titleGlow = this.menuLabel(brandBlock, 'TitleGlow', 'ONE MORE TAP', titleFont + 6, new Color(6, 182, 212, 110), titleW);
    titleGlow.node.setPosition(new Vec3(0, titleY - 1, 0));
    const title = this.menuLabel(brandBlock, 'Title', 'ONE MORE TAP', titleFont, new Color(255, 255, 255, 255), titleW);
    title.isBold = true;
    title.enableOutline = true;
    title.outlineColor = new Color(6, 182, 212, 255);
    title.outlineWidth = 1;
    title.enableShadow = true;
    title.shadowColor = new Color(0, 0, 0, 220);
    title.shadowOffset = new Vec2(0, -4);
    title.shadowBlur = 6;
    title.node.setPosition(new Vec3(0, titleY, 0));

    // Flanking accent ticks give the title a curated, arcade-loading-frame feel
    const titleFlank = (x: number, flip: number) => {
      const fnode = new Node(flip > 0 ? 'AccentR' : 'AccentL');
      const gf = fnode.addComponent(Graphics);
      gf.strokeColor = new Color(6, 182, 212, 200);
      gf.lineWidth = 2;
      gf.moveTo(0, 8);
      gf.lineTo(flip * 11, 0);
      gf.lineTo(0, -8);
      gf.stroke();
      fnode.setPosition(new Vec3(x, titleY, 0));
      brandBlock.addChild(fnode);
    };
    titleFlank(-Math.round(W * 0.34), 1);
    titleFlank(Math.round(W * 0.34), -1);

    const underline = new Node('TitleUnderline');
    underline.addComponent(UITransform).setContentSize(Math.round(W * 0.4), 12);
    const gu = underline.addComponent(Graphics);
    gu.fillColor = new Color(6, 182, 212, 38);
    gu.roundRect(-Math.round(W * 0.2), -6, Math.round(W * 0.4), 12, 6);
    gu.fill();
    gu.fillColor = new Color(6, 182, 212, 150);
    gu.roundRect(-Math.round(W * 0.2), -1.5, Math.round(W * 0.4), 3, 1.5);
    gu.fill();
    underline.setPosition(new Vec3(0, titleY - titleH / 2 - Math.round(H * 0.013), 0));
    brandBlock.addChild(underline);

    brandY -= titleH / 2 + brandGap;

    brandY -= subH / 2;
    const sub = this.menuLabel(brandBlock, 'Sub', '⚡ Continuous 10s Reflex Gauntlet ⚡', subFont, new Color(161, 161, 170, 255), innerW);
    sub.node.setPosition(new Vec3(0, brandY, 0));

    // Personal-record bento card: larger font (3x style) and stylish UI backplate
    const records = this.menuButton(brandBlock, 'PersonalRecords', innerW, 72, 16, new Color(24, 24, 27, 245), new Color(251, 191, 36, 220));
    records.setPosition(new Vec3(0, -brandH / 2 + 36, 0));
    const recordData = SaveManager.getData();
    const recordText = this.buildRecordText(recordData);
    const recordsLabel = this.menuLabel(records, 'RecordText', recordText, 18, new Color(251, 191, 36, 255), Math.round(innerW * 0.95));
    recordsLabel.node.setPosition(Vec3.ZERO);
    this.recordsLabel = recordsLabel;

    // Play buttons (full-width, equal height)
    const weirdBtn = this.menuButton(column, 'WeirdModeCard', btnW, btnH, 22, new Color(16, 185, 129, 255), new Color(6, 182, 212, 235));
    placeBlock(weirdBtn, btnH);
    this.registerMenuZone(weirdBtn, () => this.startMode('WEIRD'));
    const lblWeird = this.menuLabel(weirdBtn, 'LblWeird', 'WEIRD MODE  •  25 STAGES', 24, new Color(0, 0, 0, 255), Math.round(btnW * 0.9));
    lblWeird.node.setPosition(Vec3.ZERO);

    this.menuCrazyW = btnW;
    this.menuCrazyH = btnH;
    const data = SaveManager.getData();
    const crazyFill = data.weirdModeCleared ? new Color(244, 63, 94, 255) : new Color(24, 24, 27, 255);
    const crazyAccent = data.weirdModeCleared ? new Color(255, 255, 255, 210) : new Color(251, 191, 36, 255);
    const crazyBtn = this.menuButton(column, 'CrazyModeCard', btnW, btnH, 22, crazyFill, crazyAccent);
    placeBlock(crazyBtn, btnH);
    this.registerMenuZone(crazyBtn, () => {
      if (!SaveManager.getData().weirdModeCleared) {
        Music.playMiss();
        return;
      }
      this.startMode('CRAZY');
    });
    this.menuCrazyGraphics = crazyBtn.getComponent(Graphics)!;
    this.menuCrazySub = this.menuLabel(crazyBtn, 'LblCrazy', data.weirdModeCleared ? 'CRAZY MODE  •  50 STAGES' : '[LOCKED] CRAZY MODE (CLEAR WEIRD)', 22, data.weirdModeCleared ? new Color(255, 255, 255, 255) : new Color(251, 191, 36, 255), Math.round(btnW * 0.9));
    this.menuCrazySub.node.setPosition(Vec3.ZERO);

    const dailyBtn = this.menuButton(column, 'DailyChallengeCard', btnW, btnH, 22, new Color(6, 78, 112, 255), new Color(96, 235, 255, 230));
    placeBlock(dailyBtn, btnH);
    this.registerMenuZone(dailyBtn, () => this.startMode('DAILY'));
    const lblDaily = this.menuLabel(dailyBtn, 'LblDaily', 'DAILY SEED  •  10 STAGES', 22, new Color(255, 255, 255, 255), Math.round(btnW * 0.9));
    lblDaily.node.setPosition(Vec3.ZERO);

    // Achievements button
    const achBtn = this.menuButton(column, 'AchievementsButton', btnW, achH, 16, new Color(39, 39, 42, 255), new Color(251, 191, 36, 200));
    placeBlock(achBtn, achH);
    this.registerMenuZone(achBtn, () => this.showAchievements());
    const lblAch = this.menuLabel(achBtn, 'LblAch', 'ACHIEVEMENTS', 22, new Color(251, 191, 36, 255), Math.round(btnW * 0.9));
    lblAch.node.setPosition(Vec3.ZERO);

    // Trophy display showcase below achievements button (non-button display)
    const trophyCard = new Node('TrophyDisplayCard');
    trophyCard.addComponent(UITransform).setContentSize(btnW, trophyH);
    const gT = trophyCard.addComponent(Graphics);
    const dataNow = SaveManager.getData();
    const hasTrophy = dataNow.trophyClaimed === true;
    gT.fillColor = hasTrophy ? new Color(24, 24, 27, 245) : new Color(18, 18, 20, 140);
    gT.strokeColor = hasTrophy ? new Color(251, 191, 36, 220) : new Color(63, 63, 70, 90);
    gT.lineWidth = 1.5;
    gT.roundRect(-btnW / 2, -trophyH / 2, btnW, trophyH, 16);
    gT.fill();
    gT.stroke();
    column.addChild(trophyCard);
    placeBlock(trophyCard, trophyH);

    this.trophyDisplayLabel = this.menuLabel(trophyCard, 'LblTrophyCard', hasTrophy ? '🏆 CRAZY MODE TROPHY CLAIMED' : '🔒 CRAZY TROPHY (LOCKED)', 18, hasTrophy ? new Color(251, 191, 36, 255) : new Color(113, 113, 122, 255), Math.round(btnW * 0.85));
    this.trophyDisplayLabel.node.setPosition(new Vec3(hasTrophy ? 20 : 0, 0, 0));

    if (hasTrophy) {
      const thumb = new Node('TrophyThumb');
      thumb.setPosition(new Vec3(-btnW / 2 + 36, 0, 0));
      thumb.addComponent(UITransform).setContentSize(42, 42);
      const sprite = thumb.addComponent(Sprite);
      sprite.sizeMode = Sprite.SizeMode.CUSTOM;
      trophyCard.addChild(thumb);

      const gThumb = thumb.addComponent(Graphics);
      gThumb.fillColor = new Color(251, 191, 36, 255);
      gThumb.roundRect(-12, -16, 24, 20, 4);
      gThumb.fill();
      gThumb.fillColor = new Color(245, 158, 11, 255);
      gThumb.rect(-3, -20, 6, 6);
      gThumb.fill();
      gThumb.rect(-16, -22, 32, 4);
      gThumb.fill();

      resources.load('fuckyoutrophy/spriteFrame', SpriteFrame, (err, frame) => {
        if (!err && frame && sprite.isValid) {
          sprite.spriteFrame = frame;
          gThumb.clear();
        }
      });
    }
    this.trophyDisplayCard = trophyCard;
    this.buildPlatformButtons();
  }

  private buildDashboardAtmosphere(width: number, height: number) {
    const atmosphere = new Node('DashboardAtmosphere');
    atmosphere.addComponent(UITransform).setContentSize(width, height);
    const g = atmosphere.addComponent(Graphics);
    g.fillColor = new Color(4, 8, 14, 118);
    g.rect(-width / 2, -height / 2, width, height);
    g.fill();

    // Soft, nested neon rings frame the menu without competing with labels.
    g.strokeColor = new Color(0, 242, 254, 28);
    g.lineWidth = 1;
    for (let radius = 54; radius <= 240; radius += 46) {
      g.circle(-width * 0.36, height * 0.31, radius);
      g.stroke();
    }
    g.strokeColor = new Color(244, 63, 94, 24);
    for (let radius = 68; radius <= 250; radius += 58) {
      g.circle(width * 0.43, -height * 0.36, radius);
      g.stroke();
    }

    // Pixel stars and signal rails make the dashboard feel like a live arcade.
    for (let i = 0; i < 26; i++) {
      const x = ((i * 83) % 337) - 168;
      const y = ((i * 137) % 731) - 365;
      g.fillColor = new Color(i % 3 === 0 ? 0 : 255, i % 3 === 0 ? 242 : 255, i % 3 === 0 ? 254 : 255, 34 + (i % 4) * 12);
      g.rect(x, y, 2, 2);
      g.fill();
    }
    this.menuNode!.addChild(atmosphere);
    atmosphere.setSiblingIndex(0);
  }

  private buildRecordText(recordData: PlayerData): string {
    return `🏆 BEST: ${Math.max(recordData.bestScoreWeird, recordData.bestScoreCrazy)}   ⭐ STAGE: ${Math.max(recordData.bestStageWeird || 0, recordData.bestStageCrazy || 0)}   🔥 COMBO: x${recordData.highestCombo}`;
  }

  private refreshPersonalRecords() {
    if (!this.recordsLabel) return;
    this.recordsLabel.string = this.buildRecordText(SaveManager.getData());
  }

  private refreshMenuCrazy() {
    if (!this.menuCrazyGraphics || !this.menuCrazySub) return;
    const data = SaveManager.getData();
    if (data.weirdModeCleared) {
      this.drawPanel(this.menuCrazyGraphics, this.menuCrazyW, this.menuCrazyH, 22, new Color(244, 63, 94, 255), new Color(255, 255, 255, 210));
      this.menuCrazySub.string = 'PLAY CRAZY MODE (50 Stages)';
      this.menuCrazySub.color = new Color(255, 255, 255, 255);
    } else {
      this.drawPanel(this.menuCrazyGraphics, this.menuCrazyW, this.menuCrazyH, 22, new Color(24, 24, 27, 255), new Color(251, 191, 36, 255));
      this.menuCrazySub.string = '[LOCKED] CRAZY MODE (Clear Weird First)';
      this.menuCrazySub.color = new Color(251, 191, 36, 255);
    }
  }

  private buildGameOverGraph() {
    this.gameOverNode = new Node('GameOverScreen');
    this.gameOverNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    this.gameOverNode.active = false;
    this.canvasNode!.addChild(this.gameOverNode);

    const overlay = new Node('Overlay');
    const gOver = overlay.addComponent(Graphics);
    gOver.fillColor = new Color(0, 0, 0, 220);
    gOver.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
    gOver.fill();
    this.gameOverNode.addChild(overlay);

    const title = new Node('GOTitle');
    title.setPosition(new Vec3(0, 220, 0));
    const lt = title.addComponent(Label);
    lt.string = 'TIME OUT!';
    lt.fontSize = 64;
    lt.color = new Color(244, 63, 94, 255);
    this.gameOverNode.addChild(title);

    const failBlurb = new Node('FailBlurb');
    failBlurb.setPosition(new Vec3(0, 140, 0));
    const lf = failBlurb.addComponent(Label);
    lf.string = 'Time expired.';
    lf.fontSize = 24;
    lf.color = new Color(161, 161, 170, 255);
    this.gameOverFailureLabel = lf;
    this.gameOverNode.addChild(failBlurb);

    const score = new Node('GOScore');
    score.setPosition(new Vec3(0, 72, 0));
    const scoreLabel = score.addComponent(Label);
    scoreLabel.fontSize = 34;
    scoreLabel.color = new Color(255, 255, 255, 255);
    this.gameOverScoreLabel = scoreLabel;
    this.gameOverNode.addChild(score);

    const btnRevive = new Node('BtnRevive');
    btnRevive.setPosition(new Vec3(0, 0, 0));
    btnRevive.addComponent(UITransform).setContentSize(344, 70);
    const gRev = btnRevive.addComponent(Graphics);
    gRev.fillColor = new Color(6, 182, 212, 255);
    gRev.roundRect(-172, -35, 344, 70, 20);
    gRev.fill();

    const lblRev = new Node('LblRev');
    const lr = lblRev.addComponent(Label);
    lr.string = 'REVIVE (watch ad)';
    lr.fontSize = 24;
    lr.color = new Color(0, 0, 0, 255);
    btnRevive.addChild(lblRev);
    this.gameOverNode.addChild(btnRevive);
    this.reviveBtnNode = btnRevive;

    const btnRetry = new Node('BtnRetry');
    btnRetry.setPosition(new Vec3(0, -110, 0));
    btnRetry.addComponent(UITransform).setContentSize(344, 70);
    const gRet = btnRetry.addComponent(Graphics);
    gRet.fillColor = new Color(39, 39, 42, 255);
    gRet.roundRect(-172, -35, 344, 70, 20);
    gRet.fill();

    const lblRet = new Node('LblRet');
    const lrt = lblRet.addComponent(Label);
    lrt.string = 'TRY AGAIN';
    lrt.fontSize = 26;
    lrt.color = new Color(255, 255, 255, 255);
    btnRetry.addChild(lblRet);
    this.gameOverNode.addChild(btnRetry);

    const btnHome = new Node('BtnHome');
    btnHome.setPosition(new Vec3(0, -210, 0));
    btnHome.addComponent(UITransform).setContentSize(344, 64);
    const gHm = btnHome.addComponent(Graphics);
    gHm.fillColor = new Color(24, 24, 27, 255);
    gHm.roundRect(-172, -32, 344, 64, 18);
    gHm.fill();

    const lblHome = new Node('LblHome');
    const lh = lblHome.addComponent(Label);
    lh.string = 'MAIN MENU';
    lh.fontSize = 22;
    lh.color = new Color(161, 161, 170, 255);
    btnHome.addChild(lblHome);
    this.gameOverNode.addChild(btnHome);
  }

  private buildVictoryGraph() {
    this.victoryNode = new Node('VictoryScreen');
    this.victoryNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    this.victoryNode.active = false;
    this.canvasNode!.addChild(this.victoryNode);

    const overlay = new Node('OverlayVic');
    const gVic = overlay.addComponent(Graphics);
    gVic.fillColor = new Color(0, 0, 0, 230);
    gVic.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
    gVic.fill();
    this.victoryNode.addChild(overlay);

    const titleGlow = new Node('VicTitleGlow');
    titleGlow.setPosition(new Vec3(0, 200, 0));
    const ltg = titleGlow.addComponent(Label);
    this.vicTitleGlowLabel = ltg;
    ltg.string = 'WEIRD MODE COMPLETE';
    ltg.fontSize = 36;
    ltg.color = new Color(16, 185, 129, 70);
    this.victoryNode.addChild(titleGlow);

    const title = new Node('VicTitle');
    title.setPosition(new Vec3(0, 200, 0));
    const lt = title.addComponent(Label);
    this.vicTitleLabel = lt;
    lt.string = 'WEIRD MODE COMPLETE';
    lt.fontSize = 30;
    lt.isBold = true;
    lt.color = new Color(255, 255, 255, 255);
    lt.enableOutline = true;
    lt.outlineColor = new Color(6, 182, 212, 255);
    lt.outlineWidth = 1;
    lt.enableShadow = true;
    lt.shadowColor = new Color(0, 0, 0, 220);
    lt.shadowOffset = new Vec2(0, -4);
    lt.shadowBlur = 6;
    this.victoryNode.addChild(title);

    const sub = new Node('VicSub');
    sub.setPosition(new Vec3(0, 120, 0));
    const ls = sub.addComponent(Label);
    this.vicSubLabel = ls;
    ls.string = "Congratulations! You're weirder than I thought.";
    ls.fontSize = 20;
    ls.lineHeight = 24;
    ls.color = new Color(255, 255, 255, 255);
    ls.enableOutline = true;
    ls.outlineColor = new Color(0, 0, 0, 180);
    ls.outlineWidth = 1;
    ls.enableWrapText = true;
    ls.overflow = Label.Overflow.SHRINK;
    sub.addComponent(UITransform).setContentSize(360, 56);
    this.victoryNode.addChild(sub);

    const btnNext = new Node('BtnNext');
    btnNext.setPosition(new Vec3(0, -30, 0));
    btnNext.addComponent(UITransform).setContentSize(344, 70);
    const gN = btnNext.addComponent(Graphics);
    gN.fillColor = new Color(244, 63, 94, 255);
    gN.roundRect(-172, -35, 344, 70, 20);
    gN.fill();

    const lblNext = new Node('LblNext');
    const ln = lblNext.addComponent(Label);
    ln.string = 'CLAIM TROPHY';
    ln.fontSize = 21;
    ln.isBold = true;
    ln.color = new Color(255, 255, 255, 255);
    ln.overflow = Label.Overflow.SHRINK;
    lblNext.addComponent(UITransform).setContentSize(330, 30);
    btnNext.addChild(lblNext);
    this.victoryNode.addChild(btnNext);

    this.buildTrophyGraph();

    const btnHome = new Node('BtnHomeVic');
    btnHome.setPosition(new Vec3(0, -140, 0));
    btnHome.addComponent(UITransform).setContentSize(344, 64);
    const gH = btnHome.addComponent(Graphics);
    gH.fillColor = new Color(39, 39, 42, 255);
    gH.roundRect(-172, -32, 344, 64, 18);
    gH.fill();

    const lblHome = new Node('LblHomeVic');
    const lh = lblHome.addComponent(Label);
    lh.string = 'MAIN MENU';
    lh.fontSize = 22;
    lh.color = new Color(161, 161, 170, 255);
    btnHome.addChild(lblHome);
    this.victoryNode.addChild(btnHome);

    // Confetti layer on top of everything, pops from screen center.
    const confettiNode = new Node('VictoryConfetti');
    confettiNode.setPosition(new Vec3(0, 0, 0));
    confettiNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    const gC = confettiNode.addComponent(Graphics);
    const confetti = confettiNode.addComponent(Confetti);
    confetti.init(gC);
    this.victoryNode.addChild(confettiNode);
    this.confettiEmitter = confetti;
  }

  // Trophy claim overlay shown after CRAZY victory. The "fuckyoutrophy" image
  // is loaded from the resources folder and scaled to fit the panel.
  private buildTrophyGraph() {
    this.trophyNode = new Node('TrophyClaim');
    this.trophyNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    this.trophyNode.active = false;
    this.victoryNode!.addChild(this.trophyNode);

    const overlay = new Node('TrophyOverlay');
    const gOv = overlay.addComponent(Graphics);
    gOv.fillColor = new Color(9, 9, 11, 250);
    gOv.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
    gOv.fill();
    this.trophyNode.addChild(overlay);

    const title = new Node('TrophyTitle');
    title.setPosition(new Vec3(0, 230, 0));
    title.addComponent(UITransform).setContentSize(360, 60);
    const lt = title.addComponent(Label);
    lt.string = "HERE'S FOR BEING DEFINITELY CRAZY!\nCONGRATULATIONS!";
    lt.fontSize = 22;
    lt.isBold = true;
    lt.lineHeight = 28;
    lt.enableOutline = true;
    lt.outlineColor = new Color(244, 63, 94, 255);
    lt.outlineWidth = 1;
    lt.enableShadow = true;
    lt.shadowColor = new Color(0, 0, 0, 220);
    lt.shadowOffset = new Vec2(0, -4);
    lt.shadowBlur = 6;
    lt.horizontalAlign = Label.HorizontalAlign.CENTER;
    lt.verticalAlign = Label.VerticalAlign.CENTER;
    lt.overflow = Label.Overflow.SHRINK;
    lt.enableWrapText = true;
    this.trophyNode.addChild(title);

    const imageContainer = new Node('TrophyImage');
    imageContainer.addComponent(UITransform).setContentSize(300, 300);
    imageContainer.setPosition(new Vec3(0, 10, 0));
    const sprite = imageContainer.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.trim = false;
    this.trophyNode.addChild(imageContainer);

    // Only load once the file has been imported by the editor.
    resources.load('fuckyoutrophy/spriteFrame', SpriteFrame, (err, frame) => {
      if (err || !frame || !sprite.isValid) {
        console.warn('[Trophy] fuckyoutrophy spriteFrame not loaded:', err);
        return;
      }
      sprite.spriteFrame = frame;
      const ratio = frame.width / Math.max(1, frame.height);
      let w = 300;
      let h = 300;
      if (ratio >= 1) {
        h = w / ratio;
      } else {
        w = h * ratio;
      }
      const ui = imageContainer.getComponent(UITransform);
      if (ui) ui.setContentSize(w, h);
    });

    const btnMenu = new Node('BtnTrophyMenu');
    btnMenu.setPosition(new Vec3(0, -210, 0));
    btnMenu.addComponent(UITransform).setContentSize(344, 64);
    const gM = btnMenu.addComponent(Graphics);
    gM.fillColor = new Color(24, 24, 27, 255);
    gM.roundRect(-172, -32, 344, 64, 18);
    gM.fill();

    const lblMenu = new Node('LblTrophyMenu');
    const lm = lblMenu.addComponent(Label);
    lm.string = 'MAIN MENU';
    lm.fontSize = 22;
    lm.color = new Color(161, 161, 170, 255);
    btnMenu.addChild(lblMenu);
    this.trophyNode.addChild(btnMenu);
  }

  private buildAchievementsGraph() {
    this.achievementsNode = new Node('AchievementsScreen');
    this.achievementsNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    this.achievementsNode.active = false;
    this.canvasNode!.addChild(this.achievementsNode);

    const overlay = new Node('OverlayAch');
    const g = overlay.addComponent(Graphics);
    g.fillColor = new Color(9, 9, 11, 246);
    g.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
    g.fill();
    this.achievementsNode.addChild(overlay);

    // Soft top vignette so the header badge visually locks into the frame.
    const vignette = new Node('AchVignette');
    const gv = vignette.addComponent(Graphics);
    gv.fillColor = new Color(0, 242, 254, 12);
    gv.roundRect(-180, 300, 360, 84, 24);
    gv.fill();
    this.achievementsNode.addChild(vignette);

    // Header: ACHIEVEMENTS with neon glow + outline, mirroring the dashboard title.
    const headerGlow = new Node('AchTitleGlow');
    const lg = headerGlow.addComponent(Label);
    lg.string = 'ACHIEVEMENTS';
    lg.fontSize = 34;
    lg.color = new Color(6, 182, 212, 90);
    headerGlow.setPosition(new Vec3(0, 351, 0));
    this.achievementsNode.addChild(headerGlow);

    const header = new Node('AchTitle');
    const lh = header.addComponent(Label);
    lh.string = 'ACHIEVEMENTS';
    lh.fontSize = 30;
    lh.isBold = true;
    lh.color = new Color(255, 255, 255, 255);
    lh.enableOutline = true;
    lh.outlineColor = new Color(6, 182, 212, 255);
    lh.outlineWidth = 1;
    lh.enableShadow = true;
    lh.shadowColor = new Color(0, 0, 0, 220);
    lh.shadowOffset = new Vec2(0, -4);
    lh.shadowBlur = 6;
    header.setPosition(new Vec3(0, 344, 0));
    this.achievementsNode.addChild(header);

    const underline = new Node('AchUnderline');
    const gu = underline.addComponent(Graphics);
    gu.fillColor = new Color(6, 182, 212, 180);
    gu.roundRect(-82, -4, 164, 4, 2);
    gu.fill();
    underline.setPosition(new Vec3(0, 322, 0));
    this.achievementsNode.addChild(underline);

    // Unlock count pill
    const pill = new Node('AchCountPill');
    const gp = pill.addComponent(Graphics);
    gp.fillColor = new Color(24, 24, 27, 240);
    gp.roundRect(-78, -15, 156, 30, 15);
    gp.fill();
    gp.strokeColor = new Color(251, 191, 36, 70);
    gp.lineWidth = 1.5;
    gp.roundRect(-77.5, -14.5, 155, 29, 14);
    gp.stroke();
    pill.setPosition(new Vec3(0, 292, 0));
    this.achievementsNode.addChild(pill);

    const pillLabel = new Node('LblAchCount');
    this.achCountLabel = pillLabel.addComponent(Label);
    this.achCountLabel.fontSize = 13;
    this.achCountLabel.isBold = true;
    this.achCountLabel.color = new Color(251, 191, 36, 255);
    this.achCountLabel.string = '0 / 7 UNLOCKED';
    pillLabel.addComponent(UITransform).setContentSize(160, 22);
    pill.addChild(pillLabel);

    // Lifetime stats strip
    const stats = new Node('AchStatsStrip');
    const lst = stats.addComponent(Label);
    lst.fontSize = 11;
    lst.color = new Color(161, 161, 170, 255);
    lst.string = 'BEST 0 · COMBO x0 · TAPS 0';
    stats.setPosition(new Vec3(0, 270, 0));
    stats.addComponent(UITransform).setContentSize(340, 18);
    this.achievementsNode.addChild(stats);
    this.achStatsLabel = lst;

    // Scroll area for the real unlockables
    this.achListContainer = new Node('AchList');
    this.achListContainer.addComponent(UITransform).setContentSize(DESIGN_WIDTH - 32, 460);
    this.achListContainer.setPosition(new Vec3(0, 28, 0));
    this.achievementsNode.addChild(this.achListContainer);

    const btnBack = new Node('BtnBackAch');
    btnBack.setPosition(new Vec3(0, -300, 0));
    btnBack.addComponent(UITransform).setContentSize(344, 56);
    const gB = btnBack.addComponent(Graphics);
    gB.fillColor = new Color(39, 39, 42, 255);
    gB.roundRect(-172, -28, 344, 56, 18);
    gB.fill();
    gB.strokeColor = new Color(255, 255, 255, 22);
    gB.lineWidth = 1.5;
    gB.roundRect(-171.5, -27.5, 343, 55, 17);
    gB.stroke();

    const lblBack = new Node('LblBackAch');
    const lb = lblBack.addComponent(Label);
    lb.string = '←  BACK TO MENU';
    lb.fontSize = 20;
    lb.isBold = true;
    lb.color = new Color(255, 255, 255, 255);
    btnBack.addChild(lblBack);
    this.achievementsNode.addChild(btnBack);

    this.refreshAchievementsUI();
  }

  private achievementProgress(a: Achievement): number {
    const d = SaveManager.getData();
    switch (a.id) {
      case 'first_tap': return Math.min(1, d.totalTaps);
      case 'getting_started': return Math.min(50, Math.max(d.bestScore, d.bestScoreWeird, d.bestScoreCrazy));
      case 'tap_master': return Math.min(100, d.totalTaps);
      case 'combo_king': return Math.min(25, d.highestCombo);
      case 'insane': return Math.min(50, d.highestCombo);
      case 'weird_master': return Math.min(25, d.bestStageWeird || 0);
      case 'crazy_legend': return Math.min(50, d.bestStageCrazy || 0);
      default: return a.progress || 0;
    }
  }

  private buildAchCard(parent: Node, a: Achievement, index: number) {
    const prog = this.achievementProgress(a);
    const max = a.id === 'crazy_legend' ? 500 : a.maxProgress;
    const pct = Math.max(0, Math.min(1, prog / max));
    const unlocked = a.unlocked;
    const gold = new Color(251, 191, 36, 255);
    const gray = new Color(63, 63, 70, 255);

    const card = new Node(a.id);
    card.setPosition(new Vec3(0, 196 - index * 65, 0));
    card.addComponent(UITransform).setContentSize(360, 58);
    const g = card.addComponent(Graphics);
    g.fillColor = new Color(24, 24, 27, 242);
    g.roundRect(-180, -29, 360, 58, 14);
    g.fill();
    g.strokeColor = unlocked ? new Color(251, 191, 36, 90) : new Color(255, 255, 255, 18);
    g.lineWidth = 1.5;
    g.roundRect(-179.5, -28.5, 359, 57, 13);
    g.stroke();
    g.fillColor = unlocked ? gold : gray;
    g.roundRect(-170, -19, 4, 38, 2);
    g.fill();
    parent.addChild(card);

    const icon = new Node('IconAch');
    const li = icon.addComponent(Label);
    li.string = unlocked ? '🏆' : '🔒';
    li.fontSize = 20;
    icon.setPosition(new Vec3(-150, 0, 0));
    card.addChild(icon);

    const title = new Node('TitleAch');
    const lt = title.addComponent(Label);
    lt.string = a.title;
    lt.fontSize = 16;
    lt.isBold = true;
    lt.color = unlocked ? new Color(255, 255, 255, 255) : new Color(161, 161, 170, 255);
    lt.overflow = Label.Overflow.SHRINK;
    lt.enableWrapText = false;
    lt.horizontalAlign = Label.HorizontalAlign.LEFT;
    lt.verticalAlign = Label.VerticalAlign.CENTER;
    title.addComponent(UITransform).setContentSize(196, 22);
    title.setPosition(new Vec3(-82, 13, 0));
    card.addChild(title);

    const desc = new Node('DescAch');
    const ld = desc.addComponent(Label);
    ld.string = a.description;
    ld.fontSize = 11;
    ld.color = new Color(113, 113, 122, 255);
    ld.overflow = Label.Overflow.SHRINK;
    ld.enableWrapText = false;
    ld.horizontalAlign = Label.HorizontalAlign.LEFT;
    ld.verticalAlign = Label.VerticalAlign.CENTER;
    desc.addComponent(UITransform).setContentSize(210, 16);
    desc.setPosition(new Vec3(-82, -13, 0));
    card.addChild(desc);

    const status = new Node('StatusAch');
    const ls = status.addComponent(Label);
    ls.string = unlocked ? 'UNLOCKED' : 'LOCKED';
    ls.fontSize = 10;
    ls.isBold = true;
    ls.color = unlocked ? gold : new Color(82, 82, 91, 255);
    status.setPosition(new Vec3(146, 15, 0));
    card.addChild(status);

    const bar = new Node('BarAch');
    bar.addComponent(UITransform).setContentSize(72, 6);
    const gb = bar.addComponent(Graphics);
    gb.fillColor = new Color(63, 63, 70, 255);
    gb.roundRect(-36, -3, 72, 6, 3);
    gb.fill();
    if (pct > 0) {
      gb.fillColor = unlocked ? gold : new Color(96, 235, 255, 210);
      gb.roundRect(-36, -3, Math.max(4, 72 * pct), 6, 3);
      gb.fill();
    }
    bar.setPosition(new Vec3(90, -15, 0));
    card.addChild(bar);

    const progText = a.id === 'crazy_legend' ? `${prog}` : `${prog} / ${max}`;
    const pctLabel = new Node('PctAch');
    const lp = pctLabel.addComponent(Label);
    lp.string = progText;
    lp.fontSize = 10;
    lp.color = new Color(161, 161, 170, 255);
    lp.overflow = Label.Overflow.SHRINK;
    lp.enableWrapText = false;
    lp.horizontalAlign = Label.HorizontalAlign.LEFT;
    pctLabel.addComponent(UITransform).setContentSize(52, 14);
    pctLabel.setPosition(new Vec3(144, -15, 0));
    card.addChild(pctLabel);
  }

  private refreshAchievementsUI() {
    const achievements = SaveManager.getAchievements();
    const count = achievements.filter(a => a.unlocked).length;
    if (this.achCountLabel) {
      this.achCountLabel.string = `${count} / ${achievements.length} UNLOCKED`;
    }
    const d = SaveManager.getData();
    if (this.achStatsLabel) {
      this.achStatsLabel.string = `BEST ${Math.max(d.bestScoreWeird, d.bestScoreCrazy)} · COMBO x${d.highestCombo} · TAPS ${d.totalTaps}`;
    }
    if (this.achListContainer) {
      this.achListContainer.destroyAllChildren();
      achievements.forEach((a, i) => this.buildAchCard(this.achListContainer!, a, i));
    }
  }

  public toggleSound() {
    Music.playTap();
    const enable = !(SaveManager.getData().soundEnabled ?? true);
    SaveManager.updateData({ soundEnabled: enable });
    Music.setMuted(!enable);
    if (enable && this.ctx.state === GameState.MENU) {
      Music.startMenuMusic();
    }
    if (this.menuSoundLabel) {
      this.menuSoundLabel.string = enable ? '🔊 SOUND ON' : '🔇 SOUND OFF';
      this.menuSoundLabel.color = enable ? new Color(96, 235, 255, 255) : new Color(244, 63, 94, 255);
    }
  }

  public showMenu() {
    this.ctx.state = GameState.MENU;
    if (this.hudNode) this.hudNode.active = false;
    if (this.gameOverNode) this.gameOverNode.active = false;
    if (this.victoryNode) this.victoryNode.active = false;
    if (this.achievementsNode) this.achievementsNode.active = false;
    if (this.menuNode) this.menuNode.active = true;
    this.refreshMenuCrazy();
    this.refreshPersonalRecords();
    this.refreshTrophyDisplay();
    Music.startMenuMusic();
  }

  private refreshTrophyDisplay() {
    const data = SaveManager.getData();
    const hasTrophy = data.trophyClaimed === true;
    if (this.trophyDisplayLabel) {
      this.trophyDisplayLabel.string = hasTrophy ? '🏆 CRAZY MODE TROPHY CLAIMED' : '🔒 CRAZY TROPHY (LOCKED)';
      this.trophyDisplayLabel.color = hasTrophy ? new Color(251, 191, 36, 255) : new Color(113, 113, 122, 255);
      this.trophyDisplayLabel.node.setPosition(new Vec3(hasTrophy ? 20 : 0, 0, 0));
    }
    if (this.trophyDisplayCard) {
      const gT = this.trophyDisplayCard.getComponent(Graphics);
      if (gT) {
        const h = Math.round(800 * 0.08);
        gT.clear();
        gT.fillColor = hasTrophy ? new Color(24, 24, 27, 245) : new Color(18, 18, 20, 140);
        gT.strokeColor = hasTrophy ? new Color(251, 191, 36, 220) : new Color(63, 63, 70, 90);
        gT.lineWidth = 1.5;
        gT.roundRect(-this.menuBtnW / 2, -h / 2, this.menuBtnW, h, 16);
        gT.fill();
        gT.stroke();
      }
      if (hasTrophy && !this.trophyDisplayCard.getChildByName('TrophyThumb')) {
        const thumb = new Node('TrophyThumb');
        thumb.setPosition(new Vec3(-this.menuBtnW / 2 + 36, 0, 0));
        thumb.addComponent(UITransform).setContentSize(42, 42);
        const sprite = thumb.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        this.trophyDisplayCard.addChild(thumb);

        const gThumb = thumb.addComponent(Graphics);
        gThumb.fillColor = new Color(251, 191, 36, 255);
        gThumb.roundRect(-12, -16, 24, 20, 4);
        gThumb.fill();
        gThumb.fillColor = new Color(245, 158, 11, 255);
        gThumb.rect(-3, -20, 6, 6);
        gThumb.fill();
        gThumb.rect(-16, -22, 32, 4);
        gThumb.fill();

        resources.load('fuckyoutrophy/spriteFrame', SpriteFrame, (err, frame) => {
          if (!err && frame && sprite.isValid) {
            sprite.spriteFrame = frame;
            gThumb.clear();
          }
        });
      }
    }
  }

  public showAchievements() {
    Music.playTap();
    this.ctx.state = GameState.ACHIEVEMENTS;
    if (this.hudNode) this.hudNode.active = false;
    if (this.gameOverNode) this.gameOverNode.active = false;
    if (this.victoryNode) this.victoryNode.active = false;
    if (this.menuNode) this.menuNode.active = false;
    if (this.achievementsNode) this.achievementsNode.active = true;
    this.refreshAchievementsUI();
  }

  public startMode(mode: GameMode) {
    Music.stopMenuMusic();
    this.ctx = FlowController.createInitialContext(mode);
    this.ctx.state = GameState.PLAYING;

    // Weird Mode plays all 25 challenges in a random order every run.
    if (mode === 'WEIRD') {
      this.weirdOrder = this.shuffledStageOrder(WEIRD_STAGE_COUNT);
    }

    // Crazy Mode shuffles stages inside each of its 5 difficulty tiers every
    // run; stage 50 (Marathon Apex) stays locked as the finale.
    if (mode === 'CRAZY') {
      this.crazyOrder = this.buildCrazyOrder();
    }

    if (this.menuNode) this.menuNode.active = false;
    if (this.gameOverNode) this.gameOverNode.active = false;
    if (this.victoryNode) this.victoryNode.active = false;
    if (this.achievementsNode) this.achievementsNode.active = false;
    if (this.hudNode) this.hudNode.active = true;

    Music.playTap();
    this.loadStage(this.ctx.stageIndex);
  }

  private loadStage(index: number, timeOverrideSec?: number) {
    const maxStages = this.getStageCount();
    let challenge: ActiveChallenge;
    if (this.ctx.mode === 'WEIRD') {
      const stageNumber = this.weirdOrder[index] ?? index + 1;
      challenge = generateStageChallenge(stageNumber - 1, this.ctx.mode);
    } else if (this.ctx.mode === 'CRAZY') {
      const stageNumber = this.crazyOrder[index] ?? index + 1;
      challenge = generateStageChallenge(stageNumber - 1, this.ctx.mode);
    } else {
      challenge = generateStageChallenge(index, this.ctx.mode);
    }
    this.ctx.activeChallenge = challenge;
    this.challengeElapsed = 0;
    this.expectedSequence = 1;
    this.collectRemaining = challenge.collectAllCorrect ? challenge.targets.filter(t => t.isCorrect).length : 0;
    this.flashMemoryTriggered = false;
    this.stopPauseActive = false;
    this.stopPauseTimer = 0;
    this.stopPauseTarget = null;
    this.countdownActive = false;
    this.countdownRemaining = 0;
    this.countdownTarget = null;
    this.ctx.stageTimeLimitSec = timeOverrideSec || challenge.timeLimitSec || FlowController.getStageTimeLimit(this.ctx.mode, index);
    if (timeOverrideSec !== undefined) {
      this.ctx.timerBankSec = timeOverrideSec;
    } else if (index === 0) {
      this.ctx.timerBankSec = INITIAL_TIMER_BANK_SEC;
    }

    if (this.labelStage) {
      this.labelStage.string = `${this.ctx.mode} MODE - STAGE ${index + 1}/${maxStages}`;
      this.labelStage.color = this.ctx.mode === 'WEIRD' ? new Color(16, 185, 129, 255) : new Color(244, 63, 94, 255);
    }
    if (this.labelScore) {
      this.labelScore.string = `SCORE: ${this.ctx.score}`;
    }
    if (this.labelCombo) {
      this.labelCombo.string = this.ctx.combo > 1 ? `COMBO x${this.ctx.combo}` : '';
    }
    if (this.labelPrompt) {
      this.labelPrompt.string = challenge.instruction;
    }

    if (this.targetsContainer) {
      this.targetsContainer.destroyAllChildren();
    }
    this.activeTargetComponents = [];

    challenge.targets.forEach((targetData: TargetItem, i: number) => {
      const targetNode = new Node(`Target_${i}`);
      // If coordinates are in percent (0..100), convert to Cocos center-based coordinates
      let posX = targetData.x;
      let posY = targetData.y;
      if (posX >= 0 && posX <= 100 && posY >= 0 && posY <= 100) {
        const cocosPos = MathUtil.percentToCocosPos(posX, posY, DESIGN_WIDTH, DESIGN_HEIGHT);
        posX = cocosPos.x;
        posY = cocosPos.y;
      }
      targetNode.setPosition(new Vec3(posX, posY, 0));
      const g = targetNode.addComponent(Graphics);

      const targetComp = targetNode.addComponent(Target);
      targetComp.init(targetData, g, () => {
        this.resolveTargetHit(targetData, targetComp);
      });
      if (challenge.type === 'SHRINKING_TARGET' || targetData.shrink) targetComp.enableShrink();
      if (targetData.expand) targetComp.enableExpand();

      this.targetsContainer?.addChild(targetNode);
      this.activeTargetComponents.push(targetComp);
    });

    // Countdown stages (e.g. Microwave Stop / Patience) tick on the orb and
    // only accept the tap during the final second. Optional countdownSteps
    // drive per-second colour + label (3 red, 2 green, 1 blue, etc).
    if (challenge.countdownSec) {
      this.countdownActive = true;
      this.countdownRemaining = challenge.countdownSec;
      if (this.activeTargetComponents.length > 0) {
        this.countdownTarget = this.activeTargetComponents[0];
        const total = Math.ceil(challenge.countdownSec);
        const initialStep = challenge.countdownSteps ? challenge.countdownSteps[total - 1] : null;
        if (initialStep) {
          this.countdownTarget.setLabel(initialStep.label);
        } else {
          this.countdownTarget.setLabel(`${total}`);
        }
      }
    }
  }

  update(dt: number) {
    if (this.ctx.state === GameState.VICTORY) {
      if (this.confettiEmitter) this.confettiEmitter.updateConfetti(dt);
      return;
    }
    if (this.ctx.state !== GameState.PLAYING) return;

    this.ctx.timerBankSec = Math.max(0, this.ctx.timerBankSec - dt);
    if (this.timerBar) {
      this.timerBar.updateTimer(this.ctx.timerBankSec, this.ctx.stageTimeLimitSec);
    }

    if (this.ctx.timerBankSec <= 0) {
      this.handleGameOver('Time expired.');
      return;
    }

    this.challengeElapsed += dt;
    const challenge = this.ctx.activeChallenge;
    if (challenge?.isSurvivalHold && challenge.waitDurationSec && this.challengeElapsed >= challenge.waitDurationSec) {
      this.completeStage();
      return;
    }

    if (this.stopPauseActive) {
      this.stopPauseTimer -= dt;
      if (this.stopPauseTimer <= 0) {
        this.stopPauseActive = false;
        const comp = this.stopPauseTarget;
        if (comp && comp.data) {
          comp.setActiveColor(this.stopResumeColor, true);
          comp.setLabel(this.stopResumeLabel);
        }
        if (this.labelPrompt) this.labelPrompt.string = this.stopResumePrompt;
      }
    }

    // Countdown target: ticks 3 -> 2 -> 1 (or per-step colours/labels); running
    // out means the window closed (microwave beeped / impatience check).
    if (challenge?.countdownSec && this.countdownActive && this.countdownTarget) {
      const prev = this.countdownRemaining;
      this.countdownRemaining -= dt;
      const shown = Math.ceil(Math.max(0, this.countdownRemaining));
      if (shown !== Math.ceil(Math.max(0, prev))) {
        const step = challenge.countdownSteps && challenge.countdownSteps[shown - 1];
        if (step) {
          this.countdownTarget.setLabel(step.label);
          this.countdownTarget.setActiveColor(step.color, true);
        } else {
          this.countdownTarget.setLabel(`${shown}`);
          if (shown === 1) this.countdownTarget.setActiveColor('#22c55e', true);
        }
      }
      if (this.countdownRemaining <= 0) {
        this.handleGameOver(challenge.failBlurb || 'Time expired.');
        return;
      }
    }

    // Reaction stages intentionally reject early taps, then turn the target
    // green after a short, deterministic cue.
    if (challenge?.type === 'REACTION' && challenge.subState === 'WAIT' && this.challengeElapsed >= 1.1) {
      challenge.subState = 'GO';
      this.activeTargetComponents[0]?.setActiveColor('#22c55e', true);
      if (this.labelPrompt) this.labelPrompt.string = 'GO! TAP THE GREEN ORB';
    }

    if (challenge?.type === 'FLASH_MEMORY' && !this.flashMemoryTriggered && this.challengeElapsed >= 0.6) {
      this.flashMemoryTriggered = true;
      for (let i = 0; i < this.activeTargetComponents.length; i++) {
        const comp = this.activeTargetComponents[i];
        comp.setActiveColor('#71717a', comp.data?.isCorrect || false);
      }
      if (this.labelPrompt) this.labelPrompt.string = 'NOW TAP THE YELLOW YOU SAW!';
    }

    for (let i = 0; i < this.activeTargetComponents.length; i++) {
      this.activeTargetComponents[i].updateTarget(dt);
    }

    if (this.particleEmitter) {
      this.particleEmitter.updateParticles(dt);
    }
  }

  private handleTouch(event: EventTouch) {
    Music.unlock();
    const loc = event.getUILocation ? event.getUILocation() : event.getLocation();
    const canvasSize = this.canvasNode!.getComponent(UITransform)!.contentSize;
    const gamePos = MathUtil.screenToGame(loc.x, loc.y, canvasSize.width, canvasSize.height);

    // Runtime panels use Graphics, not cc.Button. Route their hit areas here
    // so they work consistently on Creator Preview and mobile builds.
    if (this.ctx.state === GameState.MENU) {
      // Dashboard: ONLY the button zones respond. Empty dashboard space is a
      // dead zone and can never start a game.
      const zones = this.menuZones;
      for (let i = 0; i < zones.length; i++) {
        const z = zones[i];
        if (this.isInRect(gamePos, z.cx, z.cy, z.w, z.h)) {
          console.log('[Dashboard] tap ->', z.name);
          z.action();
          return;
        }
      }
      return;
    }
    if (this.ctx.state === GameState.GAME_OVER) {
      if (this.ctx.canRevive && this.isInRect(gamePos, 0, 0, 344, 70)) this.handleReviveClick();
      else if (this.isInRect(gamePos, 0, -110, 344, 70)) this.startMode(this.ctx.mode);
      else if (this.isInRect(gamePos, 0, -210, 344, 64)) this.showMenu();
      return;
    }
    if (this.ctx.state === GameState.VICTORY) {
      if (this.trophyNode && this.trophyNode.active) {
        if (this.isInRect(gamePos, 0, -210, 344, 64)) this.showMenu();
        return;
      }
      if (this.isInRect(gamePos, 0, -30, 344, 70)) this.showTrophy();
      else if (this.isInRect(gamePos, 0, -140, 344, 64)) this.showMenu();
      return;
    }
    if (this.ctx.state === GameState.ACHIEVEMENTS) {
      if (this.isInRect(gamePos, 0, -300, 344, 64)) this.showMenu();
      return;
    }
    if (this.ctx.state !== GameState.PLAYING) return;

    // The Multi-Tap "Stop!" pause: hands off the screen for 1s. Any tap
    // while the red "Stop!" prompt is up fails the stage.
    if (this.stopPauseActive) {
      this.handleGameOver('You tapped during the Stop!');
      return;
    }

    let hitAnyTarget = false;
    for (let i = 0; i < this.activeTargetComponents.length; i++) {
      const t = this.activeTargetComponents[i];
      if (t.checkHit(gamePos.x, gamePos.y)) {
        hitAnyTarget = true;
        break;
      }
    }

    if (!hitAnyTarget) {
      if (this.ctx.activeChallenge?.type === 'TOUCH_SPACE') {
        this.completeStage();
        return;
      }
      // In-game: tapping empty space is a failed tap. The failure variants rely
      // on this reflex penalty to keep pressure high and punish careless taps.
      if (this.ctx.activeChallenge?.isSurvivalHold) {
        this.handleGameOver('Forbidden touch! Hold still!');
      } else {
        this.handleGameOver('You missed the target!');
      }
      return;
    }
  }

  private isInRect(point: { x: number; y: number }, centerX: number, centerY: number, width: number, height: number): boolean {
    return Math.abs(point.x - centerX) <= width / 2 && Math.abs(point.y - centerY) <= height / 2;
  }

  private resolveTargetHit(target: TargetItem, targetComponent: Target) {
    SaveManager.incrementTaps();

    let targetX = target.x;
    let targetY = target.y;
    if (targetX >= 0 && targetX <= 100 && targetY >= 0 && targetY <= 100) {
      const pos = MathUtil.percentToCocosPos(targetX, targetY, DESIGN_WIDTH, DESIGN_HEIGHT);
      targetX = pos.x;
      targetY = pos.y;
    }

    if (this.particleEmitter) {
      this.particleEmitter.emit(targetX, targetY, target.color, 18);
    }

    const challenge = this.ctx.activeChallenge;
    if (challenge?.isSurvivalHold || (challenge?.type === 'REACTION' && challenge.subState !== 'GO') || target.isDecoy || (target.isCorrect === false && !target.sequenceIndex)) {
      this.handleGameOver(challenge?.isSurvivalHold ? 'You tapped a forbidden target.' : 'Wrong target selected.');
      return;
    }

    // Overlap trap (Skull Dodge, Descending Trio, Weird Stage 18): clearing any
    // real target while a bomb/trap is touching it counts as hitting the bomb.
    if (challenge?.overlapKill && (target.isCorrect || target.sequenceIndex)) {
      const danger = this.isTouchingDanger(targetComponent);
      if (danger) {
        this.handleGameOver(danger.data?.label ? `Touched the ${danger.data.label}!` : 'Touched a danger orb!');
        return;
      }
    }

    // Countdown stages only accept the tap while the orb shows its "go" step.
    if (challenge?.countdownSec && this.countdownActive) {
      if (this.countdownRemaining <= 1.0) {
        this.countdownActive = false;
        this.completeStage();
      } else {
        this.handleGameOver(challenge.failBlurb || 'Too early!');
      }
      return;
    }

    if (challenge?.collectAllCorrect) {
      if (target.isCorrect) {
        target.isCorrect = false;
        targetComponent.setActiveColor('#64748b', false);
        this.collectRemaining -= 1;
        Music.playTap();
        if (this.collectRemaining <= 0) {
          this.completeStage();
        }
        return;
      }
    }

    if (target.requiredTaps && target.requiredTaps > 1) {
      target.requiredTaps -= 1;
      // Multi-Tap "Stop!" cue: after the halfway tap (e.g. 5 of 8), the target
      // turns red with a "Stop!" label for 1s to punish blind spamming.
      if (challenge?.stopAfterTaps && (target.tapsRemaining || 0) - target.requiredTaps === challenge.stopAfterTaps) {
        Music.playTap();
        this.startStopPause(challenge, targetComponent, target);
        return;
      }
      targetComponent.setLabel(`${target.requiredTaps}`);
      Music.playTap();
      return;
    }

    if (target.sequenceIndex && target.sequenceIndex !== this.expectedSequence) {
      this.handleGameOver('Sequence broken.');
      return;
    }
    if (target.sequenceIndex) {
      this.expectedSequence += 1;
      const sequenceLength = challenge?.targets.filter(item => item.sequenceIndex).length || 1;
      if (this.expectedSequence <= sequenceLength) {
        target.isCorrect = false;
        targetComponent.setActiveColor('#64748b', false);
        return;
      }
    }

    this.completeStage();
  }

  private isTouchingDanger(targetComp: Target): Target | null {
    const tappedData = targetComp.data;
    if (!tappedData) return null;
    const tappedPos = targetComp.node.position;
    const tappedR = Math.max(24, Math.round((tappedData.size || 60) * 0.72));
    for (let i = 0; i < this.activeTargetComponents.length; i++) {
      const c = this.activeTargetComponents[i];
      const d = c.data;
      if (!d || d.id === tappedData.id) continue;
      if (d.isCorrect === true || d.sequenceIndex) continue;
      const otherPos = c.node.position;
      const dx = tappedPos.x - otherPos.x;
      const dy = tappedPos.y - otherPos.y;
      const otherR = Math.max(24, Math.round((d.size || 60) * 0.72));
      if (dx * dx + dy * dy <= (tappedR + otherR) * (tappedR + otherR)) return c;
    }
    return null;
  }

  private startStopPause(challenge: ActiveChallenge, targetComponent: Target, target: TargetItem) {
    this.stopPauseTarget = targetComponent;
    this.stopResumeColor = target.color;
    this.stopResumeLabel = `${target.requiredTaps}`;
    this.stopResumePrompt = challenge.instruction;

    targetComponent.setActiveColor('#ef4444', true);
    targetComponent.setLabel(challenge.stopMessage || 'Stop!');
    if (this.labelPrompt) this.labelPrompt.string = challenge.stopPrompt || 'STOP!';

    this.stopPauseTimer = challenge.stopDurationSec || 1.0;
    this.stopPauseActive = true;
  }

  private completeStage() {
    this.ctx.combo += 1;
    this.ctx.score += FlowController.calculateStageScore(this.ctx.combo - 1, this.ctx.timerBankSec, this.ctx.stageTimeLimitSec);
    const timeBonus = this.ctx.combo >= 5 ? 3.0 : 2.0;
    this.ctx.timerBankSec = Math.min(MAX_TIMER_BANK_SEC, this.ctx.timerBankSec + timeBonus);

    Music.playTap();
    Platform.vibrate(true);
    if (this.ctx.combo >= 5) Music.playCombo(this.ctx.combo);

    const nextStage = this.ctx.stageIndex + 1;
    const maxStages = this.getStageCount();

    SaveManager.updateData({
      bestScoreWeird: this.ctx.mode === 'WEIRD' ? Math.max(SaveManager.getData().bestScoreWeird, this.ctx.score) : SaveManager.getData().bestScoreWeird,
      bestScoreCrazy: this.ctx.mode === 'CRAZY' ? Math.max(SaveManager.getData().bestScoreCrazy, this.ctx.score) : SaveManager.getData().bestScoreCrazy,
      highestCombo: Math.max(SaveManager.getData().highestCombo, this.ctx.combo),
      bestStageWeird: this.ctx.mode === 'WEIRD' ? Math.max(SaveManager.getData().bestStageWeird || 0, nextStage) : SaveManager.getData().bestStageWeird,
      bestStageCrazy: this.ctx.mode === 'CRAZY' ? Math.max(SaveManager.getData().bestStageCrazy || 0, nextStage) : SaveManager.getData().bestStageCrazy,
    });

    if (nextStage >= maxStages) {
      this.handleVictory();
    } else {
      this.ctx.stageIndex = nextStage;
      this.loadStage(this.ctx.stageIndex);
    }
  }

  private getStageCount(): number {
    if (this.ctx.mode === 'WEIRD') return WEIRD_STAGE_COUNT;
    if (this.ctx.mode === 'DAILY') return 10;
    return CRAZY_STAGE_COUNT;
  }

  private shuffledStageOrder(count: number): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= count; i++) arr.push(i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  // Crazy Mode plays stages in fixed tier bands (Tier 1 = stages 1-10, up to
  // Tier 5 = 41-49), shuffling the challenges within each tier per run, with
  // the Marathon Apex (stage 50) always last.
  private buildCrazyOrder(): number[] {
    const order: number[] = [];
    const tiers: Array<[number, number]> = [[1, 10], [11, 20], [21, 30], [31, 40], [41, 49]];
    for (const [lo, hi] of tiers) {
      for (const n of this.shuffledStageOrder(hi - lo + 1)) {
        order.push(n + lo - 1);
      }
    }
    order.push(CRAZY_STAGE_COUNT);
    return order;
  }

  private handleGameOver(reason = 'Time expired.') {
    if (this.ctx.state !== GameState.PLAYING) return;
    Music.playMiss();
    Platform.vibrate(false);
    this.ctx.state = GameState.GAME_OVER;
    this.ctx.lastDefeatReason = reason;
    if (this.gameOverFailureLabel) this.gameOverFailureLabel.string = reason;
    if (this.gameOverScoreLabel) this.gameOverScoreLabel.string = `SCORE  ${this.ctx.score}`;
    this.recordDailyScore();

    SaveManager.updateData({
      totalRuns: SaveManager.getData().totalRuns + 1,
    });

    // Revive is one shot per run: once the player watches the ad and comes
    // back, a second game-over no longer shows the REVIVE button.
    if (this.reviveBtnNode) this.reviveBtnNode.active = this.ctx.canRevive;

    if (this.hudNode) this.hudNode.active = false;
    if (this.gameOverNode) this.gameOverNode.active = true;

    // Interstitial ad on every death.
    Platform.showInterstitialAd();
  }

  // Daily Challenge final score is saved locally under daily_YYYY-MM-DD so
  // each calendar day keeps its own personal best on device.
  private recordDailyScore() {
    if (this.ctx.mode !== 'DAILY') return;
    const key = `daily_${getTodayDateString()}`;
    const dailyBest = SaveManager.getData().dailyBest || {};
    if ((dailyBest[key] || 0) < this.ctx.score) {
      SaveManager.updateData({ dailyBest: { ...dailyBest, [key]: this.ctx.score } });
    }
  }

  private handleVictory() {
    Music.playVictoryFanfare();
    this.ctx.state = GameState.VICTORY;

    if (this.ctx.mode === 'WEIRD') {
      SaveManager.updateData({ weirdModeCleared: true });
    } else if (this.ctx.mode === 'CRAZY') {
      SaveManager.updateData({ crazyModeCleared: true });
    }
    this.recordDailyScore();

    const isWeird = this.ctx.mode === 'WEIRD';
    const isDaily = this.ctx.mode === 'DAILY';
    if (this.vicTitleGlowLabel) {
      this.vicTitleGlowLabel.string = isWeird
        ? 'WEIRD MODE COMPLETE'
        : isDaily
          ? 'DAILY CHALLENGE COMPLETE'
          : 'CRAZY MODE COMPLETE';
    }
    if (this.vicTitleLabel) {
      this.vicTitleLabel.string = isWeird
        ? 'WEIRD MODE COMPLETE'
        : isDaily
          ? 'DAILY CHALLENGE COMPLETE'
          : 'CRAZY MODE COMPLETE';
    }
    if (this.vicSubLabel) {
      this.vicSubLabel.string = isWeird
        ? "Congratulations! You're weirder than I thought."
        : isDaily
          ? 'All 10 daily stages done! See you tomorrow.'
          : "I think you're literally crazy!";
    }

    if (this.confettiEmitter) {
      this.confettiEmitter.clear();
      this.confettiEmitter.burst(70);
    }

    if (this.hudNode) this.hudNode.active = false;
    if (this.victoryNode) this.victoryNode.active = true;
  }

  // Opens the "Claim trophy" overlay, hiding the victory buttons underneath.
  private showTrophy() {
    Music.playTap();
    SaveManager.updateData({ trophyClaimed: true });
    if (this.trophyNode) {
      this.trophyNode.active = true;
      if (this.confettiEmitter) {
        this.confettiEmitter.clear();
        this.confettiEmitter.burst(40);
      }
    }
  }

  private handleReviveClick() {
    if (!this.ctx.canRevive) return;

    Platform.showRewardedVideoAd(() => {
      this.ctx.canRevive = false;
      this.ctx.state = GameState.PLAYING;

      if (this.gameOverNode) this.gameOverNode.active = false;
      if (this.hudNode) this.hudNode.active = true;

      this.loadStage(this.ctx.stageIndex, 10.0);
    });
  }

  private buildPlatformButtons() {
    const platNode = new Node('PlatformButtons');
    platNode.addComponent(UITransform).setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
    this.canvasNode!.addChild(platNode);

    const btnW = 280;
    const btnH = 44;
    const radius = 12;
    const yBase = -280;

    const desktopBtn = this.menuButton(platNode, 'AddDesktopBtn', btnW, btnH, radius, new Color(30, 58, 138, 255), new Color(59, 130, 246, 255));
    desktopBtn.setPosition(new Vec3(0, yBase, 0));
    const desktopLabel = this.menuLabel(desktopBtn, 'Label', 'ADD TO DESKTOP', 16, new Color(255, 255, 255, 255));
    desktopLabel.node.setPosition(Vec3.ZERO);
    desktopBtn.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
      e.propagationStopped = true;
      Platform.addToDesktop().then(() => {});
    });

    const favoriteBtn = this.menuButton(platNode, 'FavoriteBtn', btnW, btnH, radius, new Color(14, 116, 144, 255), new Color(34, 211, 238, 255));
    favoriteBtn.setPosition(new Vec3(0, yBase - 50, 0));
    const favLabel = this.menuLabel(favoriteBtn, 'Label', 'ADD TO FAVORITES / SHORTCUT', 14, new Color(255, 255, 255, 255));
    favLabel.node.setPosition(Vec3.ZERO);
    favoriteBtn.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
      e.propagationStopped = true;
      Platform.showFavoriteGuide();
    });

    const sidebarBtn = this.menuButton(platNode, 'SidebarBtn', btnW, btnH, radius, new Color(88, 28, 135, 255), new Color(168, 85, 247, 255));
    sidebarBtn.setPosition(new Vec3(0, yBase - 100, 0));
    const sideLabel = this.menuLabel(sidebarBtn, 'Label', 'OPEN SIDEBAR', 16, new Color(255, 255, 255, 255));
    sideLabel.node.setPosition(Vec3.ZERO);
    sidebarBtn.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
      e.propagationStopped = true;
      Platform.openSidebar();
    });

    platNode.zIndex = 100;
    if (this.menuNode) this.menuNode.addChild(platNode);
  }
}
