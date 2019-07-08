import * as modules from "./modules.js";
export default class ActionsEvil{
/* Описание действий врагов */

    constructor(){
        this.intervalAnimMoveLeft;  // переменная, хранящая setInterval перемещения влево        
        this.intervalAnimMoveRight; // переменная, хранящая setInterval перемещения вправо
        this.left = false;          // флаг движения влево
        this.right = false;         // флаг движения вправо
    }
    /* Выбор направления движения */
    selectSide(){
        modules.render.evils.forEach((elem) => {
            /* Пробегаемся по каждому врагу */

            if (modules.hero.coordinate.x + modules.hero.width < elem.coordinate.x){
                /* Игрок находится слева */

                clearInterval(this.intervalAnimMoveRight); // останавливаем анимацию для движения вправо              
                elem.dx = elem.speed;       // присваиваем скорость пермещения
                elem.evilImg.frameY = 1;    // изменяем положения картинки в спрайте
                this.right = false;         // останавливаем движение вправо
                this.left = true;           // включаем движение влево
                this.movingLeft(elem);      // наинчаем пермещение влево

            }else if (modules.hero.coordinate.x > elem.coordinate.x + elem.width){
                /* Игрок находится справа  */

                clearInterval(this.intervalAnimMoveLeft);
                elem.dx = elem.speed;
                elem.evilImg.frameY = 2;
                this.right = true;
                this.left = false;
                this.movingRight(elem);
            }else {
                /* Произошло столкновение с игроком */
                elem.dx = 0;
                
                clearInterval(this.intervalAnimMoveLeft);
                clearInterval(this.intervalAnimMoveRight);
            }
        })
    }
    /* 
        Движения влево
        obj - объект врага (object)
    */
    movingLeft(obj){
        if (this.left){
            this.intervalAnimMoveLeft = setInterval(function() {  //запускаем интервал перемещения 
                
                if (obj.coordinate.x - obj.dx > 0){
                    /* Слева нет границы карты */
                    obj.coordinate.x -= obj.dx;
                }

                if (obj.width * (obj.evilImg.frameX + 1) < obj.evilImg.image.width) { //для смены позиции изображения
                    obj.evilImg.frameX += 1;   // если дошли до конца спрайта
                } else {
                    obj.evilImg.frameX = 0;    // то возвращаемся к началу
                }
            }.bind(this) , 1000/24)
        }
        
    }
     /* 
        Движения вправо
        obj - объект врага (object)
    */
    movingRight(obj){
        if (this.right){
            this.intervalAnimMoveRight = setInterval(function() {  //запускаем интервал перемещения 
                
                if (obj.coordinate.x + obj.dx + obj.width < modules.game.width){
                    /* Справа нет границы карты */
                    obj.coordinate.x += obj.dx;
                }
    
                if (obj.width * (obj.evilImg.frameX + 1) < obj.evilImg.image.width) { //для смены позиции изображения
                    obj.evilImg.frameX += 1;   // если дошли до конца спрайта
                } else {
                    obj.evilImg.frameX = 0;    // то возвращаемся к началу
                }
            }.bind(this) , 1000/24)
        }        
    }
}