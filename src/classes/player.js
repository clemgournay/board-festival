import { FindAngle } from '../utils/geometry.js';
import { Vector3, AnimationMixer, AnimationClip } from '../vendors/three/build/three.module.js';
import * as SkeletonUtils from '../vendors/three/examples/jsm/utils/SkeletonUtils.js';

export class Player {

  constructor(game, id, name, meshID, x, y, z) {  
    this.game = game;
    this.id = id;
    this.name = name;
    this.meshID = meshID;
    this.mesh = SkeletonUtils.clone(this.game.assets.meshes[meshID]);
    this.initPosition = new Vector3(x, y, z);
    this.coins = 10;
    this.stars = 0;
    this.speed = 10;
    this.score = 0;
    this.turnSpeed = Math.PI/50;
    this.animator = {}; 
    this.currentAnimation;
    this.target = {};
    this.lastPosition = new Vector3(0, 0, 0);
    this.lastPosition.copy(this.initPosition);
  }

  init() {
    this.animator = new AnimationMixer(this.mesh);
    const clip = AnimationClip.findByName(this.mesh.animations, 'Idle|Idle');
    console.log(`[PLAYER] ${this.id} animations`, this.mesh.animations);
    this.currentAnimation = this.animator.clipAction(clip);
    this.currentAnimation.play();
    console.log(`[PLAYER] ${this.id}`, this.currentAnimation._clip.name);
  }

  update() { 
    const delta = this.game.clock.getDelta();
    if (this.target) {
      const diffX = this.target.x - this.mesh.position.x;
      const diffY = this.target.y - this.mesh.position.y;
      const diffZ = this.target.z - this.mesh.position.z;

      if (diffX > 0) {
        this.mesh.position.x += (diffX > this.speed) ? this.speed : diffX;
      } else if (diffX < 0) {
        this.mesh.position.x -= (diffX < this.speed) ? this.speed : diffX;
      }

      if (diffY > 0) {
        this.mesh.position.y += (diffY > this.speed) ? this.speed : diffY;
      } else if (diffY < 0) {
        this.mesh.position.y -= (diffY < this.speed) ? this.speed : diffY;
      }

      if (diffZ > 0) {
        this.mesh.position.z += (diffZ > this.speed) ? this.speed : diffZ;
      } else if (diffZ < 0) {
        this.mesh.position.z -= (diffZ < this.speed) ? this.speed : diffZ;
      }
      
      if (diffX === 0 && diffY === 0 && diffZ === 0) {
        this.target = {};
        this.onReachedSpace();
      }
    }
    if (this.animator) this.animator.update(delta);
    this.onUpdate();
  }

  onUpdate() {}

  onMoved() {}

  onReachedSpace() {}

  move(direction) {
    const forward = new Vector3(0, 0, 0);
    const forwardDir = this.mesh.getWorldDirection(forward);

    switch (direction) {
      case 'forward':
        this.mesh.position.add(forwardDir.multiplyScalar(this.speed));
        this.crossFadeAnimation('Running');
      break;
      case 'backward':
        const backwardDir = forwardDir.negate();
        this.mesh.position.add(backwardDir.multiplyScalar(this.speed));
      break;
    }
  }

  turn(direction) {
    switch (direction) {
      case 'left':
        this.mesh.rotation.y += this.turnSpeed;
      break;
      case 'right':
        this.mesh.rotation.y -= this.turnSpeed;
      break;  
    }
  }

  idle() {
    this.crossFadeAnimation('Idle|Idle');
  }

  crossFadeAnimation(name, duration = 0.3) {
    if (this.currentAnimation._clip.name !== name) {
      console.log(`[PLAYER] ${this.id}: start anim ${name}`);
      const clip = AnimationClip.findByName(this.mesh.animations, name);
      const newAnimation = this.animator.clipAction(clip);    
      newAnimation.reset();
      newAnimation.play();
      this.currentAnimation.crossFadeTo(newAnimation, duration, true);
      this.currentAnimation = newAnimation; 
      console.log(`[PLAYER] ${this.id}: new anim`, this.currentAnimation._clip.name);
    }
  }

  updateProperty(property, value) {
    this[property] = value;
    this.game.gui.updatePlayer(this);
  }

  moveTo(x, y, z) {
    console.log(`Move to ${x}-${y}-${z}`);

    const position = new Vector3(x, y, z);
    const angle = FindAngle(this.lastPosition, this.mesh.position, position);
    const degree = Math.round((angle * 180) / Math.PI);

    if (Math.abs(degree) !== 180) {
      this.mesh.rotateY(angle);
    }

    this.target = position;
    this.lastPosition.copy(this.mesh.position);
    this.crossFadeAnimation('Running');
  }

  promptDirection() {
    console.log(`[PLAYER] ${this.id}: Prompt direction`);
    this.crossFadeAnimation('Idle|Idle');
    this.onPromptDirection();
  }

  onPromptDirection() {}

  promptStar() {
    console.log(`[PLAYER] ${this.id}: Prompt Star`);
    this.crossFadeAnimation('Idle|Idle');
    this.onPromptStar();
  }

  onPromptStar() {}

  endTurn() {
    this.crossFadeAnimation('Idle|Idle');
  }

}