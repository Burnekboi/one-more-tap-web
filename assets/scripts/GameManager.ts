import { _decorator, Component, Node } from 'cc';
import { GameRoot } from './GameRoot';
const { ccclass } = _decorator;

/**
 * GameManager entry point - delegates to GameRoot to maintain backwards compatibility
 * with existing Main.scene node references.
 */
@ccclass('GameManager')
export class GameManager extends Component {
  onLoad() {
    let root = this.node.getComponent(GameRoot);
    if (!root) {
      root = this.node.addComponent(GameRoot);
    }
  }
}
