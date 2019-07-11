import Images from "./images.js";
import * as modules from "./modules.js";

export default class Weapon{
    constructor(){
        this.weaponImg = new Images("../img/arrow.png");
        this.width = 80;
        this.width = 20;

        this.dx = 0;        // скорость изменения положения по X
        this.dy = 0;       // скорость изменения положения по Y
    }
}