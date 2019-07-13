import Images from './images.js';
import * as modules from "./modules.js";
export default class Evil {
     /* Описание врагов игры */

    /*
        startX - начальная координата по X (number),
        startY - начальная координата по Y (number),
    */
    constructor(startY, borderL, borderR){
        this.evilImg = new Images("../img/hero-test.png", 4);   // картинка врага
        this.width = 32;                                        // длина картинки 
        this.height = 48;                                       // высота картинки 
        this.speed = 2;                                         // скорость пермещения врага
    this.dx;                                                    // изменение координаты по X
        this.dy = 2;                                            // изменение координаты по Y
        this.borderMoveR = borderR;                             // прававая границы патрулирования
        this.borderMoveL = borderL;                             // левая границы патрулирования
        this.coordinate = { // начальные координаты персонажа
            x: (borderR + borderL) / 2, // ставим врага в середину патрулироемой зоны
            y: startY
        }
        this.isAttack = false;                              // флага на начало атаки
        this.hp = 200;                                      // ХП
        this.orientation = 1;                               // ориентация персонажа (1 - вправо, -1 - влево)
        this.isAlive = true;                                // флага, указыающий на то, что жив герой или нет
    }
    /* Отображение ХП */
    health(){
        var widthBorder = 45;                       // ширина границы фона ХП
        var heightBorder = 10;                      // высота границы фона ХП
        var xBorder = this.coordinate.x - 5;        // координата X для границы фона ХП
        var yBorder = this.coordinate.y - 12;       // координата y для границы фона ХП
        var widthHP = widthBorder - 1;              // ширина фона ХП
        var heightHP = heightBorder - 1;            // высота фона ХП
        var xHP = xBorder + 0.5;                    // координата X для фона ХП
        var yHP = yBorder + 0.5;                    // координата Y для фона ХП
        var xTextHP = xBorder + widthBorder / 8;    // координата X для текста
        var yTextHP = yBorder + heightBorder - 1;   // координата Y для текста
        
        modules.game.ctx.strokeStyle = "green"; 
        modules.game.ctx.strokeRect(xBorder, yBorder, widthBorder, heightBorder); // отображение границы фона
        modules.game.ctx.fillStyle = "green"; 
        modules.game.ctx.fillRect(xHP, yHP, widthHP, heightHP); // отображение фона
        modules.game.ctx.fillStyle = "white"; 
        modules.game.ctx.font = 'bold 10px sans-serif';
        modules.game.ctx.fillText(this.hp + " HP", xTextHP, yTextHP);   // отображение текста
    }
}