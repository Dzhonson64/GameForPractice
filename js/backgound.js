import Images from "./images.js";
import * as modules from "./modules.js";

export default class Background{
    constructor(img){
        this.backImg = new Images(img); // создание фона по излбражению
        this.aspect = 1920 / 1200; // соотношение сторон фона
        this.x = 0; this.y = 0; // координаты фона
        this.k = 1; // коэффициент движения фона относительно движения персонажа
        this.endBackgr = false;     //флаг, проверяющий конец фона
    }
}