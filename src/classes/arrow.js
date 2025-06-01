import { FindAngle, ParseCoordinates } from '../utils/geometry.js';
import * as SkeletonUtils from '../vendors/three/examples/jsm/utils/SkeletonUtils.js';

export class Arrow {
    
  constructor(game) {
    this.game = game;
    this.mesh = SkeletonUtils.clone(this.game.assets.meshes.arrow);
    this.visible = false;
    this.minScale = 0.9;
    this.maxScale = 1.1;
    this.initScale = 300;
    this.animationSpeed = 2;
    this.animation = 'shrinking';
  }

  update() {
    if (this.visible) {
      let scale = this.mesh.scale.x;
      if (this.animation === 'growing') {

        const limitUp = this.initScale * this.maxScale;
        if (scale <= limitUp) {
          scale += this.animationSpeed;
          this.mesh.scale.set(scale, scale, scale);
        } else {
          this.animation = 'shrinking';
        }
      } else if (this.animation === 'shrinking') {
        const limitDown = this.initScale * this.minScale;
        if (scale >= limitDown) {
          scale -= this.animationSpeed;
          this.mesh.scale.set(scale, scale, scale);
        } else {
          this.animation = 'growing';
        }
      }
      
    }
  }

  hide() {
    this.setVisibility(false);
  }

  show() {
    this.setVisibility(true);
  }

  setVisibility(state) {
    this.visible = state;
    this.mesh.children.forEach(child => (child.visible = state))
  }

  showDirection(player, coordinates) {
    const position = ParseCoordinates(coordinates);
    this.mesh.position.copy(position);
    this.mesh.position.y += 50;
    this.mesh.scale.set(this.initScale, this.initScale, this.initScale);
    const playerRotateY = player.mesh.rotation.y;
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.rotation.x = playerRotateY + Math.PI;

    const angle = FindAngle(player.lastPosition, player.mesh.position, position);
    this.mesh.rotateY(angle);

    this.show();
  }
}