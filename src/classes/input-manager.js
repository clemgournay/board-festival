export class InputManager {
  
  constructor(game) {
    this.game = game;
    this.keys = {};
    this.locked = false;
  }

  init() {

    document.onkeydown = (e) => {
      if (!this.locked) {
        this.keys[e.key] = true;
      } else {
        console.log(`[INPUT] controls are locked.`);
      }
    }

    document.onkeyup = (e) => {
      delete this.keys[e.key];
    }
  
  }

  release(key) {
    delete this.keys[key];
  }

  lock() {
    console.log(`[INPUT] Lock controls`);
    this.locked = true;
  }

  unlock() {
    console.log(`[INPUT] Unlock controls`);
    this.locked = false;
  }
}