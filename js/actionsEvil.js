import * as modules from "./modules.js";
export default class ActionsEvil{
/* Описание действий врагов */

    constructor(){
        this.intervalAnimMoveLeft;  // переменная, хранящая setInterval перемещения влево        
        this.intervalAnimMoveRight; // переменная, хранящая setInterval перемещения вправо
        this.leftMove = false;      // флаг движения влево
        this.rightMove = false;     // флаг движения вправо
        this.processJump = false;   // флаг на начало процесса прыжка
        this.jumpCount = 0;
        this.jumpLength = 50;       // высота прыжка
        
    }
    /* Передвижение врага в режиме "атака" */
    attackMove(){
        modules.render.evils.forEach((elem) => {
            /* Пробегаемся по каждому врагу */
            if (modules.hero.coordinate.x + modules.hero.width  < elem.coordinate.x){
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
            }
        })
    }
    /* Передвижение врага в режиме "патрулировния" */
    quiteMove(){
        modules.render.evils.forEach((elem) => {
            
            var coordinateEvilOnMapX = elem.coordinate.x - modules.backrg.x;    // координаты врага относительно всего фона карты (но показыает не точные координаты, если упереться в правую границу)
            
            elem.dx = elem.speed;       // присваиваем скорость пермещения
            if (elem.orientation == 1 && coordinateEvilOnMapX + elem.width < elem.borderMoveR){
                 elem.evilImg.frameY = 2;       // изменяем положения картинки в спрайте
                this.rightMove = true;          // останавливаем движение вправо
                this.leftMove = false;          // включаем движение влево
                this.movingRight(elem);         // включаем пермещение напрво
            }else if (elem.orientation == -1 && coordinateEvilOnMapX > elem.borderMoveL){
                elem.evilImg.frameY = 1;
                this.rightMove = false;
                this.leftMove = true;
                this.movingLeft(elem);
            }else {
                /* Произошло столкновение с игроком */
                elem.dx = 0;
            }

            if (coordinateEvilOnMapX + elem.width * 3/2 == elem.borderMoveR){
                /* Враг ниходится на правой границе патрулирования */
                elem.evilImg.frameY = 1;    // изменяем спрайты на движения в левую сторону
                this.rightMove = false;     // выключаем движение вправо
                this.leftMove = true;       // включаем движение влево
                //elem.coordinate.x -= 10;    
                this.movingLeft(elem);      // ничинаем перемещение влево
            }else if (coordinateEvilOnMapX == elem.borderMoveL){
                elem.evilImg.frameY = 2;    // изменяем спрайты на движения в левую сторону
                this.rightMove = true;      // включаем движение вправо
                this.leftMove = false;      // выключаем движение влево
                //elem.coordinate.x += 10;
                this.movingRight(elem);     // ничинаем перемещение вправо
            }
        })
    }
    /* 
        Движения влево
        obj - объект врага (object)
    */
    movingLeft(obj){
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;  // координаты врага относительно всего фона карты (но показыает не точные координаты, если упереться в правую границу)
        obj.orientation = -1; // ориентация врага на движение влево
        if (this.leftMove){
            /* Разрешено движение влево */
            if (coordinateEvilOnMapX - obj.dx > 0){
                /* Слева нет границы карты */
                if (this.isCollisionWithHero(obj) && !this.processJump){
                    obj.dx = 0;
                }else {
                    obj.dx = obj.speed;
                    obj.coordinate.x -= obj.dx;
                    if (obj.width * (obj.evilImg.frameX + 1) < obj.evilImg.image.width) { //для смены позиции изображения
                        obj.evilImg.frameX += 1;   // если дошли до конца спрайта
                    } else {
                        obj.evilImg.frameX = 0;    // то возвращаемся к началу
                    }
                }
                
            }
        }
        
    }
     /* 
        Движения вправо
        obj - объект врага (object)
    */
    movingRight(obj){
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;
        obj.orientation = 1;
        
        if (this.rightMove){
            if (coordinateEvilOnMapX + obj.dx + 3/2 * obj.width <= modules.backrg.backImg.image.width){
                /* Справа нет границы карты */

                if (this.isCollisionWithHero(obj) && !this.processJump){
                    obj.dx = 0;
                }else{
                    obj.dx = obj.speed;
                    obj.coordinate.x += obj.dx;
                    if (obj.width * (obj.evilImg.frameX + 1) < obj.evilImg.image.width) { //для смены позиции изображения
                        obj.evilImg.frameX += 1;   // если дошли до конца спрайта
                    } else {
                        obj.evilImg.frameX = 0;    // то возвращаемся к началу
                    }
                }
            }

            
       }        
    }
    /* 
         Вычислинеие на столконовение с игроком
        obj - объект врага (object)
    */
    isCollisionWithHero(obj){
        if (obj.orientation == -1 && modules.hero.coordinate.x + modules.hero.width - obj.coordinate.x > 0 && modules.hero.coordinate.x + modules.hero.width - obj.coordinate.x <= obj.width){
            /* Если игрок был справа и разница координат игрока и координта проивника положительна и меньше длины картинки врага */

            return true;
        }else if (obj.orientation == 1 && modules.hero.coordinate.x - (obj.coordinate.x  + obj.width) < 0 && modules.hero.coordinate.x - obj.coordinate.x  + obj.width >= obj.width){
           /* Если игрок был слева и разница координат игрока и координта проивника отрицательна и больше длины картинки врага */
           
            return true;
        }
    }

    /* 
        Прыжок
        obj - объект врага (object)
    */
    jump(obj){
        this.processJump = true;
        this.jumpCount++;
        obj.coordinate.y = -(3 * this.jumpLength * Math.sin(Math.PI * this.jumpCount / this.jumpLength)) +  modules.game.floorCoordinate;
        if(this.jumpCount > this.jumpLength){
            this.jumpCount = 0;
            this.jumpPress = false;
            obj.y = modules.game.floorCoordinate;
            this.processJump = false;
        }
    }
    
}