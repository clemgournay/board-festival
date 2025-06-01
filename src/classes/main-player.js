import { Player } from './player.js';

export class MainPlayer extends Player {

  constructor(game, id, name, meshID, x, y, z) {
    super(game, id, name, meshID, x, y, z);
    this.prompt = null;
    this.directionPrompted = false;
  }

  onUpdate() {
    const keys = this.game.inputManager.keys;
    const coor = `${Math.round(this.mesh.position.x)}_${Math.round(this.mesh.position.y-10)}_${Math.round(this.mesh.position.z)-20}`;

    if (this.prompt === 'direction') {
      if (keys['ArrowUp']) {
        this.chooseDirection('up');
        this.game.inputManager.release('ArrowUp');
      } else if (keys['ArrowLeft']) {
        this.chooseDirection('left');
        this.game.inputManager.release('ArrowLeft');
      } else if (keys['ArrowRight']) {
        this.chooseDirection('right');
        this.game.inputManager.release('ArrowRight');
      } else if (keys['ArrowDown']) {
        this.chooseDirection('down');
        this.game.inputManager.release('ArrowDown');
      }
    } else if (this.prompt === 'star') {
      if (keys['ArrowUp']) {
        this.game.gui.move('up');
        this.game.inputManager.release('ArrowUp');
      } else if (keys['ArrowDown']) {
        this.game.gui.move('down');
        this.game.inputManager.release('ArrowDown');
      } else if (keys['Enter']) {
        this.executeStarAction();
        this.game.inputManager.release('Enter');
      }
    } else {
      if (keys['ArrowUp']) {
        console.log('[MAIN CHARACTER] Position', coor);
        this.move('forward');
      } else if (keys['ArrowDown']) {
        console.log('[MAIN CHARACTER] Position', coor);
        this.move('backward');
      }
      
      if (keys['ArrowLeft']) {
        this.turn('left');
      } else if (keys['ArrowRight']) {
        this.turn('right');
      }

      if (keys['Enter']) {
        this.game.inputManager.release('Enter');
        this.game.emitSocket('hit dice');
        this.game.inputManager.lock();
      }

      if (Object.keys(keys).length === 0 && !this.target) this.idle();

    }

  }

  executeStarAction() {
    const action = this.game.gui.getActiveChoiceAction();

    console.log(action);
    switch (action) {
      case 'buy-star': 
        this.game.emitSocket('star decision done', true);
        this.game.gui.closeMessage();
      break;

      case 'close':
        this.game.emitSocket('star decision done', false);
        this.game.gui.closeMessage();
      break;
    }

    this.prompt = null;

  }
  
  onPromptDirection() {
    console.log('[MAIN CHARACTER] Prompt direction');
    this.game.inputManager.unlock();
    this.prompt = 'direction';
  }

  chooseDirection(direction) {
    console.log('[MAIN CHARACTER] Direction choosen', direction);
    this.game.chooseDirection(direction);
    this.prompt = null;
  }

  onPromptStar() {
    console.log('[MAIN CHARACTER] Prompt star');
    this.game.inputManager.unlock();
    this.prompt = 'star';
  }

  onMoved() {
    this.game.sendPosition(this.track, this.segment, this.space);
  }

  onReachedSpace() {
    this.game.emitSocket('reached space');
  }
}