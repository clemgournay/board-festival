import * as THREE from '../vendors/three/build/three.module.js';
import { 
  PerspectiveCamera, 
  WebGLRenderer, 
  Vector3,
  SphereGeometry,
  MeshLambertMaterial,
  Mesh,
  AmbientLight,
  DirectionalLight
} from '../vendors/three/build/three.module.js';
import { MainPlayer } from './main-player.js';

export class Scene {

  constructor(game) {
    this.game = game;
    this.el = document.getElementById('scene');
    this.scene = new THREE.Scene();
    this.camera = new PerspectiveCamera(75, this.el.offsetWidth / this.el.offsetHeight, 0.1, 10000);
    this.renderer = new WebGLRenderer();
    this.cameraOffset = new Vector3(0, 280, 300);
  }

  init() {
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
    this.el.appendChild(this.renderer.domElement);
    this.build();
  }

  build() {
    this.buildBoard();
    this.buildMainPlayer();
    this.buildLights();
    this.buildDice();
    this.buildArrows();
  }

  buildBoard() {
    const board = this.game.board;
    const mesh = this.game.board.mesh;
    mesh.scale.set(180, 180, 180);
    this.scene.add(mesh);

    for (let track of board.tracks) {
      for (let segment of track.segments) {
        for (let space of segment.spaces) {
          this.buildSpace(space);
        }
      }
    }
  }

  buildMainPlayer() {
    const mesh = this.game.mainPlayer.mesh;
    mesh.rotation.y = Math.PI;
    mesh.position.copy(this.game.mainPlayer.initPosition);
    this.scene.add(mesh);
  }

  addPlayer(player) {
    let isMain = player instanceof MainPlayer;
    console.log('ADd player to scene PLAYER', player,)
    if (!isMain) {
      console.log('Player no mainplayer', player);
      const mesh = player.mesh;
      mesh.rotation.y = Math.PI;
      mesh.position.copy(player.initPosition);
      mesh.name = player.id;
      console.log(mesh);
      this.scene.add(mesh);
    }
  }

  removePlayer(playerID) {
    const mesh = this.scene.getObjectByName(playerID);
    mesh.geometry.dispose();
    mesh.material.dispose();
    this.scene.remove(mesh);
  }


  buildDice() {
    const player = this.game.players[0];
    const dice = this.game.dice;
    const mesh = dice.mesh;
    mesh.scale.set(40, 40, 40);
    this.scene.add(mesh);
    dice.hide();
  }

  buildArrows() {
    for (let arrow of this.game.arrows) {
      const mesh = arrow.mesh;
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(arrow.initScale, arrow.initScale, arrow.initScale);
      this.scene.add(mesh);
      arrow.hide();
    }
  }

  buildSpace(space) {
    let color = 'lightblue';
    switch (space.type) {
      case 'bonus':
        color = 0x0050ff;
      break;
      case 'malus':
        color = 0xff6060;
      break;
      case 'star':
        color = 0xffd700;
      break;  
    }
    const geo = new SphereGeometry(70, 32, 32);
    const mat = new MeshLambertMaterial({color});
    const mesh = new Mesh(geo, mat);
    mesh.position.copy(space.position);
    mesh.scale.y = 0.2;
    this.scene.add(mesh);
  }

  buildLights() {
    const light = new AmbientLight(0xffffff);  
    this.scene.add(light);

    const directionalLight = new DirectionalLight(0xffffff, 5);
    this.scene.add(directionalLight);

  }

  showDirectionArrows(player, choices) {
    let index = 0;
    for (let choice of choices) {
      this.game.arrows[index].showDirection(player, choice.coordinates);
      index++;
    }
  }

  update() {
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  updateCamera() {
    const player = this.game.currentPlayer;
    if (player && player.mesh) {
      const cameraPosition = player.mesh.position.clone();
      cameraPosition.add(this.cameraOffset);
      this.camera.position.copy(cameraPosition);
      this.camera.lookAt(player.mesh.position);
    } else {
      this.camera.position.set(0, 1200, 0);
      this.camera.lookAt(0, 0, 400);
    }  
  }

}