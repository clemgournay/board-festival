import { MainPlayer } from './main-player.js';

export class GUI {

  constructor(game) {
    this.game = game;
    this.el = document.getElementById('gui');
    this.yourTurnEl = document.getElementById('your-turn');
    this.messageBoxEl = this.el.querySelector('.message-box');
    this.qrcodeEl = document.getElementById('qrcode');
    this.qrcodeCtx = this.qrcodeEl.getContext('2d');
    this.templates = {};
  }

  init() {
    this.getTemplates();

    this.yourTurnEl.onclick = () => {
      this.onYourTurnClick();
    }
  }

  getTemplates() {
    const templates = this.el.querySelectorAll('[data-template]');
    for (let templateEl of templates) {
      const id = templateEl.dataset.template;
      console.log(id);
      this.templates[id] = templateEl.cloneNode(true);
      this.templates[id].removeAttribute('data-template');
      templateEl.remove();
    }
    console.log('[GUI] Templates', this.templates);
  }

  addPlayer(player) {
    const playerEl = this.templates.player.cloneNode(true);
    if (player instanceof MainPlayer) playerEl.classList.add('main'); 
    const playersEl = this.el.querySelector('.players');
    playerEl.dataset.id = player.id;
    for (let key in player) {
      const el = playerEl.querySelector(`[data-${key}]`);
      if (el) el.innerText = player[key];
    }
    playersEl.append(playerEl);
  }

  removePlayer(playerID) {
    const playerEl = this.el.querySelector(`.players [data-id="${playerID}"]`);
    playerEl.remove();
  }

  updatePlayer(player) {
    const playerEl = this.el.querySelector(`.players .player[data-id="${player.id}"]`);
    for (let key in player) {
      const el = playerEl.querySelector(`[data-${key}]`);
      if (el) el.innerText = player[key];
    }
  }

  closeMessage() {
    this.messageBoxEl.classList.remove('shown');
  }

  showMessage(text, choices = []) {
    this.messageBoxEl.querySelector('[data-message]').innerHTML = text;
    const choicesEl = this.messageBoxEl.querySelector('.choices');
    choicesEl.innerHTML = '';
    let index = 0;
    for (let choice of choices) {
      const choiceEl = this.templates.choice.cloneNode(true);
      choiceEl.dataset.action = choice.action;
      choiceEl.querySelector('[data-label]').innerText = choice.label;
      if (index === 0) choiceEl.classList.add('active');
      choicesEl.append(choiceEl);
      index++;
    }

    this.messageBoxEl.classList.add('shown');

  }

  getActiveChoiceIndex() {
    const choicesEl = this.messageBoxEl.querySelector('.choices');
    const choiceEls = choicesEl.querySelectorAll('.choice');

    let i = 0, found = false;
    while (!found && i < choiceEls.length) {
      const choiceEl = choiceEls[i];
      if (choiceEl.classList.contains('active')) found = true;
      else i++;
    }
    return i;
  }

  move(direction) {
    const choicesEl = this.messageBoxEl.querySelector('.choices');
    const choiceEls = choicesEl.querySelectorAll('.choice');
    let index = this.getActiveChoiceIndex();
    let beforeIndex = this.getActiveChoiceIndex();
    if (direction === 'up') {
      if (index > 0) {
        index--;
      }    
    } else {
      if (index < choiceEls.length - 1) {
        index++;
      }
    }
    if (beforeIndex !== index) {
      for (let i = 0; i < choiceEls.length; i++) {
        let choiceEl = choiceEls[i];
        if (i === index) choiceEl.classList.add('active');
        else choiceEl.classList.remove('active');
      }
    }

  }

  getActiveChoiceAction() {
    const choicesEl = this.messageBoxEl.querySelector('.choices');
    const choiceEls = choicesEl.querySelectorAll('.choice');
    const index = this.getActiveChoiceIndex();
    const choiceEl = choiceEls[index];
    const action = choiceEl.dataset.action;
    return action;
  }

  showYourTurn() {
    this.yourTurnEl.classList.add('shown');
  }

  hideYourTurn() {
    this.yourTurnEl.classList.remove('shown');
  }

  isYourTurnShown() {
    return this.yourTurnEl.classList.contains('shown');
  }

  onYourTurnClick() {};

  async showQRCode(url) {
    console.log(url)
    let img = new Image();
    await new Promise(r => img.onload = r, img.src = url);
    this.qrcodeCtx.drawImage(img, 0, 0, 180, 180);
  }
}