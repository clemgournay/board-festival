import { io } from '../../node_modules/socket.io/client-dist/socket.io.esm.min.js';

import { ENV } from '../env.js';

export class SocketManager {

  game;
  socket;

  constructor(game) {
    this.game = game;
    this.socket = io(ENV.apiURL, { transports : ['websocket'] })
    console.log('SOCKET', this.socket)
  }

  init() { 

    this.socket.on('player list', (players) => {
      this.game.addPlayers(players);
    });

    this.socket.on('current player', (playerID) => {
      this.game.setCurrentPlayer(playerID);
    });

    this.socket.on('qrcode', (qrcodeURL) => {
      this.game.showQRCode(qrcodeURL);
    });

    this.socket.on('player joined', (playerID) => {
      this.game.addPlayer(playerID);
    });

    this.socket.on('roll dice', (playerID) => {
      this.game.rollDice(playerID);
    });
    
    this.socket.on('move to', (playerID, x, y, z) => {
      this.game.movePlayerTo(playerID, x, y, z);
    });

    this.socket.on('prompt direction', (playerID, choices) => {
      this.game.promptDirection(playerID, choices);
    });

    this.socket.on('direction choosen', (playerID) => {
      this.game.directionChoosen(playerID);
    });

    this.socket.on('prompt star', (playerID, enoughCoins) => {
      this.game.promptStar(playerID, enoughCoins);
    });

    this.socket.on('turn ended', (playerID) => {
      this.game.endPlayerTurn(playerID);
    });

    this.socket.on('received score', (playerID, score) => {
      this.game.receivedPlayerScore(playerID, score);
    });

    this.socket.on('player property changed', (playerID, property, value) => {
      this.game.updatePlayerProperty(playerID, property, value);
    });

    this.socket.on('player left', (playerID) => {
      this.game.removePlayer(playerID);
    });

  }

  sendPosition(track, segment, space) {
    this.socket.emit('sent position', track, segment, space);
  }

  emit(message, data) {
    this.socket.emit(message, data);
  }

}