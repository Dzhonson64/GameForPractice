/* Храннение модулей, который могут понадобится в дргуих файлах (классах) */
/* И чтобы в каждом классе не создавать новый объект, все объекты берутся из этого файла */

import OptionsGame from "./optionsGame.js";
import Render from "./render.js";
import Hero from "./hero.js";

export let options = new OptionsGame();
export let render = new Render();
export let hero = new Hero();