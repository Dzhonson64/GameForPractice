import Images from "./images.js";
import * as modules from "./modules.js";

/* Класс, описывающий стрелу */

export default class Weapon{
    constructor(x, y){
        this.weaponImg = new Images("../img/arrow.png");
        this.width = 30;         
        this.height = 10;
        this.sin;       // синус угла между осью х и положением прямой, проходящей через персонажа и мышку  
        this.cos;       // косинус угла между осью х и положением прямой, проходящей через персонажа и мышку 
        this.cos2;
        this.sin2;
        this.cos3;
        this.sin3;
        this.dg = 10;   // скорость стрелы в 1 фрейм 
        this.angle = 0; // угол наклона стрелы
        this.coordinate = {
            x: x,
            y: y
        };
    }
    /* Перемещение стрелы */
    move(){
        
        this.coordinate.x += this.dg * this.cos; // Получаем составляющую скорости по х и прибавляем к текущему положению стрелю по х
        this.coordinate.y += this.dg * this.sin; // Получаем составляющую скорости по у и прибавляем к текущему положению стрелю по у
        // console.log('---- x:', this.coordinate.x, "y:", this.coordinate.y, "----");
    }
    /* Проверка на выход стрелы за границу холста */
    isOutOfBordersCanvas(){
        // console.log("x:", this.coordinate.x, "y:", this.coordinate.y, "; is border ", this.coordinate.x < 0, this.coordinate.x > modules.game.width, this.coordinate.y, this.coordinate.y > modules.game.height);
        if (
            this.coordinate.x < 0 ||
            this.coordinate.x > modules.mapCol.widthInTile * 10 ||
            this.coordinate.y < 0 ||
            this.coordinate.y > modules.game.height
            ){
                console.log('Arrow out of border');
                return true;
        }
        return false;
    }

    /* 
        Проверка на попадание по противнику
        objEvil - объект врага (object)
    */
    isHit(objEvil){
        
        
        if(
            Math.abs(objEvil.coordinate.x + objEvil.width - this.coordinate.x - this.width - modules.backrg.x) < objEvil.width &&  
            Math.abs(objEvil.coordinate.y - this.coordinate.y) < objEvil.height){
            /* Произошло столкновение с врагом */
                
                return true;
        }
        return false;
    }
    /* Отображение стрелы */
    draw(){
        modules.game.ctx.drawImage(
            this.weaponImg.image,
            this.coordinate.x,
            this.coordinate.y,
            this.width,
            this.height,
        )
    }
    drawRotated(offsetX, oofsetY, angel, x, y) {
        modules.game.ctx.save();
        modules.game.ctx.translate(offsetX, oofsetY);
        modules.game.ctx.rotate(angel);
        modules.game.ctx.drawImage(this.weaponImg.image,x, y);
        modules.game.ctx.restore();
      }
}