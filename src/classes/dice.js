import { Vector3 } from '../vendors/three/build/three.module';

export class Dice {

  constructor(game) {
    this.game = game;
    this.score = null;
    this.animation = 'rolling';
    this.rotationSpeed = 3;
    this.mesh = this.game.assets.meshes.dice;
    this.visible = false;
  }

  hide() {
    this.setVisibility(false);
  }

  setVisibility(state) {
    this.visible = state;
    this.mesh.children.forEach(child => (child.visible = state))
  }

  update() {
    if (this.visible) {
      if (this.animation === 'rolling') {
        const delta = this.game.clock.getDelta();
        this.mesh.rotation.x += (Math.PI * this.rotationSpeed) * 100 * delta;
        this.mesh.rotation.y += (Math.PI * this.rotationSpeed) * 100 * delta;
        this.mesh.rotation.z += (Math.PI * this.rotationSpeed) * 100 * delta;
      }
    }
  }

  roll(player) {
    console.log('ROLL')
    this.game.assets.audios.dice_roll.loop = true;
    this.game.assets.audios.dice_roll.play();
    this.setVisibility(true);
    const position = player.mesh.position.clone();
    position.y += 220;
    this.mesh.position.copy(position);
    this.animation = 'rolling';
  }

  showScore(score) {
    this.game.assets.audios.dice_roll.pause();
    this.animation = 'showing';
    this.mesh.lookAt(this.game.scene.camera.position);
    this.mesh.rotation.set(0, 0, Math.PI);
    switch (score) {
      case 1:
        this.mesh.rotateOnAxis(new Vector3(0, 1, 0), -Math.PI/2);

      break;

      case 2:
        this.mesh.rotateOnAxis(new Vector3(0, 1, 0), -Math.PI/2);
        this.mesh.rotateOnAxis(new Vector3(0, 0, 1), Math.PI/2);
      break;

      case 3:

      break;

      case 4:
        this.mesh.rotateOnAxis(new Vector3(0, 1, 0), Math.PI);
      break;

      case 5:
        this.mesh.rotateOnAxis(new Vector3(0, 1, 0), Math.PI/2);
        this.mesh.rotateOnAxis(new Vector3(0, 0, 1), Math.PI/2);
      break;

      case 6:
        this.mesh.rotateOnAxis(new Vector3(0, 1, 0), Math.PI/2);

      break;
    }
  }

}