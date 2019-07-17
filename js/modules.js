/* Храннение модулей, который могут понадобится в дргуих файлах (классах) */
/* И чтобы в каждом классе не создавать новый объект, все объекты берутся из этого файла */

import Game from "./game.js";
import Render from "./render.js";
import Hero from "./hero.js";
import ActionsHero from "./actionsHero.js";
import ActionsEvil from "./actionsEvil.js";
import Background from "./background.js";
import Bonuses from "./bonuses.js";
import Map from "./map.js";
import Skills from "./skills.js";

export let game = new Game(0);
export let mapCol = new Map(0);
export let backrg = new Background(0);
export let render = new Render();
export let bonuses = new Bonuses();
export let skills = new Skills();
export let hero = new Hero(100, game.floorCoordinate);


export let actHero = new ActionsHero();
export let actEvil = new ActionsEvil();
window.addEventListener("load", function(){
    render.timerGame();
    render.fps();
    render.processGame();
    
    
    
    
});
