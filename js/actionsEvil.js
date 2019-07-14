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
    attackMove(obj){
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;
        /* Берём отдельного врага */
        if (coordinateEvilOnMapX > obj.borderMoveL){
            /* Игрок находится слева */
            
            obj.dx = obj.speed * obj.orient;       // присваиваем скорость пермещения
            obj.evilImg.frameY = 0;    // изменяем положения картинки в спрайте
            this.rightMove = false;     // останавливаем движение вправо
            this.leftMove = true;       // включаем движение влево
            this.movingLeft(obj);      // наинчаем пермещение влево

        }else if (coordinateEvilOnMapX + obj.width < obj.borderMoveR){
            /* Игрок находится справа  */

            obj.dx = obj.speed * obj.orient;
            obj.evilImg.frameY = 1;
            this.rightMove = true;
            this.leftMove = false;
            this.movingRight(obj);
        }
    }
    /* Передвижение врага в режиме "патрулировния" */
    quiteMove(obj){
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;    // координаты врага относительно всего фона карты (но показыает не точные координаты, если упереться в правую границу)
        
        obj.dx = obj.speed;       // присваиваем скорость пермещения
        if (obj.orientation == 1 && coordinateEvilOnMapX + obj.width < obj.borderMoveR){
            obj.evilImg.frameY = 0;       // изменяем положения картинки в спрайте
            this.rightMove = true;          // останавливаем движение вправо
            this.leftMove = false;          // включаем движение влево
            this.movingRight(obj);         // включаем пермещение напрво
        }else if (obj.orientation == -1 && coordinateEvilOnMapX > obj.borderMoveL){
            obj.evilImg.frameY = 1;
            this.rightMove = false;
            this.leftMove = true;
            this.movingLeft(obj);
        }else {
            /* Произошло столкновение с игроком */
            obj.dx = 0;
        }

        if (coordinateEvilOnMapX + obj.width * 3/2 >= obj.borderMoveR){
            /* Враг ниходится на правой границе патрулирования */
            obj.evilImg.frameY = 1;    // изменяем спрайты на движения в левую сторону
            this.rightMove = false;     // выключаем движение вправо
            this.leftMove = true;       // включаем движение влево
            //elem.coordinate.x -= 10;    
            this.movingLeft(obj);      // ничинаем перемещение влево
        }else if (coordinateEvilOnMapX <= obj.borderMoveL){
            obj.evilImg.frameY = 2;    // изменяем спрайты на движения в левую сторону
            this.rightMove = true;      // включаем движение вправо
            this.leftMove = false;      // выключаем движение влево
            //elem.coordinate.x += 10;
            this.movingRight(obj);     // ничинаем перемещение вправо
        }
        
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
                if (this.isCollisionWithHero(obj) && !this.processJump && obj.orient === 1){
                       this.doDamage(obj);
                }else {
                    obj.dx = obj.speed * obj.orient;
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

    // Функция отнимающая хп у персонажа, согласно атаке врага
    doDamage(obj){
        if(obj.cooldown === 0){ // Если не перезаряжается
            modules.hero.hp -= obj.attackPower;
            obj.cooldown += 1
            // Тут мы можем страдать от скорости обращения к DOM элементам
            modules.game.heroHp.innerHTML = String(modules.hero.hp) + " HP";
            modules.game.heroHp.parentElement.style.width = String(modules.hero.hp / modules.hero.maxHp * 100) + "%";
            obj.orient = -0.5; // Тупо стоять вплотную с персонажем, поэтому он будет двигаться назад с меньшей скоростью
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

                if (this.isCollisionWithHero(obj) && !this.processJump && obj.orient === 1){
                    this.doDamage(obj);
                }else{
                    obj.dx = obj.speed * obj.orient;
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

        if (obj.orientation == -1 && modules.hero.coordinate.x + modules.hero.width - obj.coordinate.x > 0 && modules.hero.coordinate.x + modules.hero.width - obj.coordinate.x <= obj.width && 
            modules.hero.coordinate.y + modules.hero.height >= obj.coordinate.y &&
            modules.hero.coordinate.y <= obj.coordinate.y + obj.height){
            /* Если игрок был справа и разница координат игрока и координта проивника положительна и меньше длины картинки врага */

            return true;
        }else if (obj.orientation == 1 && modules.hero.coordinate.x - (obj.coordinate.x  + obj.width) < 0 && modules.hero.coordinate.x - obj.coordinate.x  + obj.width >= obj.width && 
            modules.hero.coordinate.y + modules.hero.height >= obj.coordinate.y &&
            modules.hero.coordinate.y <= obj.coordinate.y + obj.height){
           /* Если игрок был слева и разница координат игрока и координта проивника отрицательна и больше длины картинки врага */
           
            return true;
        }
        return false;
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