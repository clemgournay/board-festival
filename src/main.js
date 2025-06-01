import { Game } from './classes/game';

const run = async () => {
  const game = new Game();
  await game.load();
  game.init();

  let start = document.getElementById('start');
  //game.run();
  //start.remove();
  start.onclick = () => {
    game.run();
    start.remove();
  }
}

run();