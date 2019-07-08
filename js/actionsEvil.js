import * as modules from "./modules.js";
export default class ActionsEvil{
/* Описание действий врагов */

    constructor(){
        this.intervalAnimMoveLeft;  // переменная, хранящая setInterval перемещения влево        
        this.intervalAnimMoveRight; // переменная, хранящая setInterval перемещения вправо
        this.leftMove = false;      // флаг движения влево
        this.rightMove = false;     // флаг движения вправо
    }
    /* Выбор направления движения */
    selectSide(){
        modules.render.evils.forEach((elem) => {
            /* Пробегаемся по каждому врагу */

            if (modules.hero.coordinate.x + modules.hero.width < elem.coordinate.x){
                /* Игрок находится слева */
            
                elem.dx = elem.speed;       // присваиваем скорость пермещения
                elem.evilImg.frameY = 1;    // изменяем положения картинки в спрайте
                this.rightMove = false;     // останавливаем движение вправо
                this.leftMove = true;       // включаем движение влево
                this.movingLeft(elem);      // наинчаем пермещение влево

            }else if (modules.hero.coordinate.x > elem.coordinate.x + elem.width){
                /* Игрок находится справа  */

                elem.dx = elem.speed;
                elem.evilImg.frameY = 2;
                this.rightMove = true;
                this.leftMove = false;
                this.movingRight(elem);
            }else {
                /* Произошло столкновение с игроком */
                elem.dx = 0;
            }
        })
    }
    /* 
        Движения влево
        obj - объект врага (object)
    */
    movingLeft(obj){
        if (this.leftMove){
            if (obj.coordinate.x - obj.dx > 0){
                /* Слева нет границы карты */
                obj.coordinate.x -= obj.dx;
            }

            if (obj.width * (obj.evilImg.frameX + 1) < obj.evilImg.image.width) { //для смены позиции изображения
                obj.evilImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                obj.evilImg.frameX = 0;    // то возвращаемся к началу
            }
        }
        
    }
     /* 
        Движения вправо
        obj - объект врага (object)
    */
    movingRight(obj){
        if (this.rightMove){
            if (obj.coordinate.x + obj.dx + obj.width < modules.game.width){
                /* Справа нет границы карты */
                obj.coordinate.x += obj.dx;
            }

            if (obj.width * (obj.evilImg.frameX + 1) < obj.evilImg.image.width) { //для смены позиции изображения
                obj.evilImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                obj.evilImg.frameX = 0;    // то возвращаемся к началу
            }
        }        
    }
}