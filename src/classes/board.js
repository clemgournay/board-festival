import { Vector3 } from '../vendors/three/build/three.module.js';
import { Space } from './space';
import { Track } from './track';
import { TrackSegment } from './track-segment';

export class Board {

  constructor(game, id) {
    this.game = game;
    this.id = id;
    this.mesh = this.game.assets.boards[id].mesh;
    this.data = this.game.assets.boards[id].data;
    this.bgm = this.game.assets.boards[id].bgm;
    const start = this.data.start;
    const coors = start.split('_');
    this.start = new Vector3(parseInt(coors[0]), parseInt(coors[1]), parseInt(coors[2]));
    
  }

  build() {
    this.tracks = [];
    let trackIndex = 0;
    for (let segments of this.data.tracks) {
      const newSegments = [];
      let segmentIndex = 0;
      for (let segment of segments) {
        const newSpaces = [];
        let spaceIndex = 0;
        for (let space of segment.spaces) {
          const coors = space.coordinates.split('_');
          const x = parseFloat(coors[0]);
          const y = parseFloat(coors[1]);
          const z = parseFloat(coors[2]);
          const newSpace = new Space(this.game, trackIndex, segmentIndex, spaceIndex, x, y, z, space.type);
          newSpaces.push(newSpace);
          spaceIndex++;
        }
        const newSegment = new TrackSegment(this.game, segment.choice, trackIndex, segmentIndex, newSpaces);
        newSegments.push(newSegment);
        segmentIndex++;
      }
      const newTrack = new Track(this.game, trackIndex, newSegments);
      this.tracks.push(newTrack);
      trackIndex++;
    }

    console.log('[BOARD]', this.tracks);


  }

  getSpace(track, segment, space) {
    return this.tracks[track].segments[segment].spaces[space];
  }
}