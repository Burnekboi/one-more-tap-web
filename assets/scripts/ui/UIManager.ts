import { _decorator, Component, Node } from 'cc';
import { GameMode } from '../template/models';
import { GameRoot } from '../GameRoot';
import { PopupManager } from './PopupManager';
import { Dashboard } from './Dashboard';
const { ccclass, property } = _decorator;

/**
 * Main UIManager orchestrator connecting all native Cocos UI nodes with game state.
 */
@ccclass('UIManager')
export class UIManager extends Component {
  @property(Node)
  public mainDashboard: Node | null = null;

  @property(Node)
  public gameplayHUD: Node | null = null;

  @property(Node)
  public gameOverPanel: Node | null = null;

  @property(Node)
  public victoryPanel: Node | null = null;

  @property(PopupManager)
  public popupManager: PopupManager | null = null;

  @property(Dashboard)
  public dashboard: Dashboard | null = null;

  @property(GameRoot)
  public gameRoot: GameRoot | null = null;

  onLoad() {
    if (!this.gameRoot) {
      this.gameRoot = this.node.getComponent(GameRoot) || this.getComponent(GameRoot) || null;
    }
  }

  private getGameRoot(): GameRoot | null {
    if (!this.gameRoot) {
      this.gameRoot = this.node.getComponent(GameRoot) || this.getComponent(GameRoot) || null;
    }
    return this.gameRoot;
  }

  public onPlayWeirdMode() {
    const root = this.getGameRoot();
    if (root) {
      root.startMode('WEIRD');
    }
  }

  public onPlayCrazyMode() {
    const root = this.getGameRoot();
    if (root) {
      root.startMode('CRAZY');
    }
  }

  public onOpenSettings() {
    this.popupManager?.openSettings();
  }

  public onOpenAchievements() {
    this.popupManager?.openAchievements();
  }

  public onOpenRewards() {
    this.popupManager?.openRewards();
  }

  public onReturnToDashboard() {
    const root = this.getGameRoot();
    if (root) {
      root.showMenu();
    }
    this.dashboard?.refreshStats();
  }
}
