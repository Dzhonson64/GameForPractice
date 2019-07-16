import Images from "./images.js";
import * as modules from "./modules.js";
export default class Hero{
    /* Описание героя игры */

    /*
        startX - начальная координата по X (number),
        startY - начальная координата по Y (number),
    */
    constructor(startX, startY){
        this.heroImg = new Images("../img/hero.png", 7);
        this.width = 53;    // длина картинки в спрайте
        this.height = 65;   // ширина картинки в спрайте
        this.dx = 5;        // скорость изменения положения по X
        this.dy = 15;       // скорость изменения положения по Y
        this.sizeJump = 50; // макс. высота прыжка
        this.coordinate = { // координаты персонажа
            x: startX,
            y: startY
        }
        this.hp = 100;      // ХП
        this.mp = 200;
        this.maxHp = 100;
        this.maxMp = 200;
        this.orientation;   // ориентация героя (1 - вправо, -1 - влево)
        this.offset = startX ? startX : 0; // начальный отступ от левой границы холста
        this.deltaMana = 20;
        this.deltaHp = 20;
        this.hit = 20;
        this.block = false; // блокирует ли персонаж
    }
}