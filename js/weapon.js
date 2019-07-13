import Images from "./images.js";
import * as modules from "./modules.js";

/* Класс, описывающий стрелу */

export default class Weapon{
    constructor(x, y){
        this.weaponImg = new Images("../img/arrow.png");
        this.width = 30;         
        this.height = 10;
        this.k; // коэффиуиент угла наклона  

        this.coordinate = {
            x: x,
            y: y
        }
        this.dx = 2;            // скорость изменения положения по X
        this.coefficient = 1;   /* коэффициент, который небходим для правильного направления, 
                                    т.к. у нас не правильня декартовая система, т.к. положительный Y идёт вниз*/
    }
    /* Перемещение стрелы */
    move(){
        this.coordinate.x += this.dx * this.coefficient;
        this.coordinate.y -= this.k * this.dx * this.coefficient;
    }
    /* Проверка на выход стрелы за границу холста */
    isOutOfBordersCanvas(){
        if (
            this.coordinate.x + this.width < 0 ||
            this.coordinate.x > modules.game.width ||
            this.coordinate.y + this.height < 0 ||
            this.coordinate.y > modules.game.height
            ){
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
        // context.save();
        // context.translate(x + image.width / 2, y + image.height / 2);
        // context.rotate(rotation * Math.PI / 180);
        // context.drawImage(this.weaponImg, -image.width / 2, -image.height / 2);
        // context.restore();

        modules.game.ctx.save();
        modules.game.ctx.translate(offsetX, oofsetY);
        modules.game.ctx.rotate(angel);
        modules.game.ctx.drawImage(this.weaponImg.image,x, y);
        modules.game.ctx.restore();
      }
}