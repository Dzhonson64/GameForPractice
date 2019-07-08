import Images from "./images.js";
import * as modules from "./modules.js";
export default class Hero{
    /* Описание героя игры */

    /*
        startX - начальная координата по X (number),
        startY - начальная координата по Y (number),
    */
    constructor(startX, startY){
        this.heroImg = new Images("../img/hero-test.png", 4);
        this.width = 32;    // длина картинки в спрайте
        this.height = 48;   // ширина картинки в спрайте
        this.speedX = 5;
        this.speedY = 15;
        this.dx;        // скорость изменения положения по X
        this.dy;       // скорость изменения положения по Y
        this.sizeJump = 50; // макс. высота прыжка
        this.coordinate = { // координаты персонажа
            x: startX,
            y: startY
        }
        this.hp = 200;      // ХП
    }
   
}