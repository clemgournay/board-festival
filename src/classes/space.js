import { Vector3 } from '../vendors/three/build/three.module.js';

export class Space {
    
  constructor(game, track, segment, index, x, y, z, type) {
    this.game = game;
    this.index = index;
    this.track = track;
    this.segment = segment;
    this.x = x;
    this.y = y;
    this.z = z;
    this.position = new Vector3(x, y, z);
    this.type = type;
  }

}