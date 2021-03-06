import Images from "./images.js";
import * as modules from "./modules.js";

/* Класс, описывающий стрелу */

export default class Weapon{
    constructor(x, y, sin, cos, angle){
        this.weaponImg = new Images("../img/arrow.png");
        this.width = 30;         
        this.height = 10;
        this.sin = sin;       // синус угла между осью х и положением прямой, проходящей через персонажа и мышку  
        this.cos = cos;       // косинус угла между осью х и положением прямой, проходящей через персонажа и мышку 
        this.widthWithAngle = this.width * this.cos;
        this.heightWithAngle = this.width * this.sin;
        this.dg = 10;   // скорость стрелы в 1 фрейм 
        this.angle = angle; // угол наклона стрелы
        this.upperBorderIsFree = false;
        this.coordinate = {
            x: x,
            y: y
        };
        this.collisions = [0, 0, 0, 0];
    }
    /* Перемещение стрелы */
    move(){
        this.collisions = modules.mapCol.collisWithObj(
            (this.coordinate.x) / 10, 
            (this.coordinate.y) / 10, 
            (this.widthWithAngle) / 10, (this.heightWithAngle) / 10);
        
        this.coordinate.x += this.dg * this.cos; // Получаем составляющую скорости по х и прибавляем к текущему положению стрелю по х
        this.coordinate.y += this.dg * this.sin; // Получаем составляющую скорости по у и прибавляем к текущему положению стрелю по у
    }
    /* Проверка на выход стрелы за границу холста */
    isOutOfBordersCanvas(){
        if (
            this.coordinate.x < 0 ||
            this.coordinate.x > modules.mapCol.widthInTile * 10 ||
            this.coordinate.y < 0 && !this.upperBorderIsFree ||
            this.coordinate.y > modules.game.height
            ){
                // console.log('Arrow out of the border');
                return true;
        }
        return false;
    }

    /* 
        Проверка на попадание по противнику
        objEvil - объект врага (object)
    */
    isHit(objEvil){
        if(this.coordinate.x + modules.backrg.x + this.widthWithAngle >= objEvil.coordinate.x && 
            this.coordinate.x + modules.backrg.x + this.widthWithAngle <= objEvil.coordinate.x + objEvil.width && 
            this.coordinate.y + this.heightWithAngle <= objEvil.coordinate.y + objEvil.height &&
            this.coordinate.y + this.heightWithAngle >= objEvil.coordinate.y
            ){
            /* Произошло попадание */
            // console.log('Arrow hit the enemy');

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
}