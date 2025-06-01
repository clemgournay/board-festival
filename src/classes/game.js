import { Clock } from '../vendors/three/build/three.module.js';
import { Scene } from './scene.js';
import { Loader } from './loader.js';
import { Board } from './board.js';
import { MainPlayer } from './main-player.js';
import { InputManager } from './input-manager.js';
import { SocketManager } from './socket-manager.js';
import { FindIndexByPropValue, FindItemByPropValue } from '../utils/array.js';
import { GUI } from './gui.js';
import { Arrow } from './arrow.js';
import { Dice } from './dice.js';
import { Player } from './player.js';

export class Game {
  
  constructor() {
    this.loader = new Loader(this);
    this.scene = new Scene(this);
    this.clock = new Clock(); 
    this.inputManager = new InputManager(this);
    this.socketManager = new SocketManager(this);
    this.gui = new GUI(this);
    this.arrows = [];
    this.assets = {};
    this.players = [];
  }

  async load() {
    this.assets = await this.loader.load([
      {id: 'jungle', type: 'board'},
      {id: 'robot', type: 'mesh'},
      {id: 'arrow', type: 'mesh'},
      {id: 'dice', type: 'mesh'},
      {id: 'dice_roll', type: 'audio'},
    ]);
  }

  init() {
    this.board = new Board(this, 'jungle');
    this.dice = new Dice(this);
    this.gui.init();
    this.initPlayers();
    this.initArrows();
    this.board.build();
    this.scene.init();
    this.inputManager.init();
    this.inputManager.lock();
    this.socketManager.init();
    this.scene.update();
  }

  initPlayers() {
    const id = this.socketManager.socket.id;
    this.mainPlayer = new MainPlayer(this, id, 'Robot', 'robot', this.board.start.x, this.board.start.y, this.board.start.z);
    this.gui.addPlayer(this.mainPlayer);
    this.players = [this.mainPlayer];
    this.emitSocket('join game', 'test');
    this.mainPlayer.init();
  }

  initArrows() {
    this.arrows = [new Arrow(this), new Arrow(this), new Arrow(this)];
  }

  run() {
    this.board.bgm.play();
    this.board.bgm.onended = () => {
      this.board.bgm.currentTime = 2;
      this.board.bgm.play();
    }
    this.update();
  }

  update() {

    for (let player of this.players) {
      player.update();
    }

    for (let arrow of this.arrows) {
      arrow.update();
    }

    this.dice.update();

    this.scene.update();

    requestAnimationFrame(() => {
      this.update();
    });
  }

  emitSocket(message, data) {
    this.socketManager.emit(message, data);
  }

  setCurrentPlayer(playerID) {
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      //this.currentPlayer = player;
      //this.dice.roll(player);
    }
  }

  addPlayers(players) {
    for (let player of players) {
      const playerIndex = FindIndexByPropValue(this.players, 'id', player.id);
      if (player.id !== this.mainPlayer.id && playerIndex === -1) {
        const newPlayer = new Player(this, player.id, 'Robot', 'robot', this.board.start.x, this.board.start.y, this.board.start.z);
        this.players.push(newPlayer);
        this.scene.addPlayer(newPlayer);
        this.gui.addPlayer(newPlayer);
        newPlayer.init();
      }
    }
  }

  addPlayer(playerID) {
    const player = new Player(this, playerID, 'Robot', 'robot', this.board.start.x, this.board.start.y, this.board.start.z);
    this.players.push(player);
    this.scene.addPlayer(player);
    this.gui.addPlayer(player);
    player.init();
  }

  removePlayer(playerID) {
    const index = FindIndexByPropValue(this.players, 'id', playerID);
    this.players.splice(index, 1);
    this.scene.removePlayer(playerID);
    this.gui.removePlayer(playerID);
  }

  rollDice(playerID) {
    console.log(`[GAME] Roll dice on ${playerID}`);
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      this.currentPlayer = player;

      if (playerID === this.mainPlayer.id) {
        this.inputManager.unlock();
        this.gui.showYourTurn();
        this.gui.onYourTurnClick = () => {
          console.log('HERE BABA')
          this.gui.hideYourTurn();
          this.dice.roll(player);
        }
      }
    }
    
  }

  receivedPlayerScore(playerID, score) {
    this.dice.showScore(score);
    this.updatePlayerProperty(playerID, 'score', score);
  }

  updatePlayerProperty(playerID, property, value) {
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      player.updateProperty(property, value);
    }
  }

  movePlayerTo(playerID, x, y, z) {
    console.log(`[Game] player ${playerID} move to: ${x}-${y}-${z}`);
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      player.moveTo(x, y, z);
    }
  }

  promptDirection(playerID, choices) {
    console.log(`[Game] player ${playerID} prompt direction`, choices);
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      player.promptDirection();
      this.scene.showDirectionArrows(player, choices);
    }
  }

  chooseDirection(direction) {
    this.emitSocket('direction choosen', direction);
  }

  directionChoosen() {
    console.log('DIRECTION CHOOSEN');
    for (let arrow of this.arrows) {
      arrow.hide();
    }
  }

  promptStar(playerID, enoughCoins) {
    console.log(`[Game] player ${playerID} prompt star`);
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      if (enoughCoins) {
        this.gui.showMessage(`
          Good job coming here !<br>
          Will you buy a star ?`, 
          [
            {label: 'Yes', action: 'buy-star'}, 
            {label: 'No', action: 'close'}
          ]
        )
      } else {
        this.gui.showMessage(`
          Good job coming here !<br>
          Unfortunately you dont have enough coins do buy the star...`, 
          [
            {label: 'Close', action: 'close'}
          ]
        )
      }
      player.promptStar();
    }
  }
  
  endPlayerTurn(playerID) {
    console.log(`[Game] player ${playerID} turn ended`);
    const player = FindItemByPropValue(this.players, 'id', playerID);
    if (player) {
      player.endTurn();
    }
  }

  showQRCode(qrcodeURL) {
    this.gui.showQRCode(qrcodeURL);
  }
}