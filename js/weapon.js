import Images from "./images.js";
import * as modules from "./modules.js";

export default class Weapon{
    constructor(x, y){
        this.weaponImg = new Images("../img/arrow.png");
        this.width = 30;
        this.height = 10;
        this.k;

        this.coordinate = {
            x: x,
            y: y
        }
        this.dx = 1;        // скорость изменения положения по X
        this.dy = 0;       // скорость изменения положения по Y
    }
    move(){
        this.coordinate.x += this.dx;
        this.coordinate.y -= this.k * this.coordinate.x;  
    }
}