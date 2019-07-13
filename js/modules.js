/* Храннение модулей, который могут понадобится в дргуих файлах (классах) */
/* И чтобы в каждом классе не создавать новый объект, все объекты берутся из этого файла */

import Game from "./game.js";
import Render from "./render.js";
import Hero from "./hero.js";
import ActionsHero from "./actionsHero.js";
import ActionsEvil from "./actionsEvil.js";
import Background from "./background.js";
import Map from "./map.js";

export let game = new Game(210);
export let mapCol = new Map(1);
export let render = new Render();
export let backrg = new Background("../img/test_back.png");
export let hero = new Hero(100, game.floorCoordinate);


export let actHero = new ActionsHero();
export let actEvil = new ActionsEvil();
window.addEventListener("load", function(){
    render.processGame();
})
