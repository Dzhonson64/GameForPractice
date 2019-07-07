/* Храннение модулей, который могут понадобится в дргуих файлах (классах) */
/* И чтобы в каждом классе не создавать новый объект, все объекты берутся из этого файла */

import Game from "./game.js";
import Render from "./render.js";
import Hero from "./hero.js";
import ActionsHero from "./actionsHero.js";
import ActionsEvil from "./actionsEvil.js";

export let game = new Game(200);
export let render = new Render();
export let hero = new Hero(200, game.floorCoordinate);
export let actHero = new ActionsHero();
export let actEvil = new ActionsEvil();
render.processGame();