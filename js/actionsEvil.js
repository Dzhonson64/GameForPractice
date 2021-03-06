import * as modules from "./modules.js";
import TextDamage from './textDamage.js'
export default class ActionsEvil{
/* Описание действий врагов */

    constructor(){
        this.intervalAnimMoveLeft;  // переменная, хранящая setInterval перемещения влево        
        this.intervalAnimMoveRight; // переменная, хранящая setInterval перемещения вправо
        
        this.processJump = false;   // флаг на начало процесса прыжка
        
        this.jumpCount = 0;
        
        this.jumpLength = 50;       // высота прыжка
        
    }
    /* Передвижение врага в режиме "атака" */
    attackMove(obj){
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;
        /* Берём отдельного врага */
        if (coordinateEvilOnMapX > modules.hero.coordinate.x - modules.backrg.x){
            /* Игрок находится слева */
            
            obj.dx = obj.speed * obj.orient;       // присваиваем скорость пермещения
            obj.evilImg.frameY = 3;    // изменяем положения картинки в спрайте
            obj.rightMove = false;     // останавливаем движение вправо
            obj.leftMove = true;       // включаем движение влево
            this.movingLeft(obj);      // наинчаем пермещение влево

        }else if (coordinateEvilOnMapX < modules.hero.coordinate.x - modules.backrg.x){
            /* Игрок находится справа  */

            obj.dx = obj.speed * obj.orient;
            obj.evilImg.frameY = 2;
            obj.rightMove = true;
            obj.leftMove = false;
            this.movingRight(obj);
        }
    }
    /* Передвижение врага в режиме "патрулировния" */
    quiteMove(obj){
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;    // координаты врага относительно всего фона карты (но показыает не точные координаты, если упереться в правую границу)
        obj.dx = obj.speed;       // присваиваем скорость пермещения
        if (obj.orientation == 1 && coordinateEvilOnMapX + obj.width < obj.borderMoveR){
            obj.evilImg.frameY = 0;       // изменяем положения картинки в спрайте
            obj.rightMove = true;          // останавливаем движение вправо
            obj.leftMove = false;          // включаем движение влево
            this.movingRight(obj);         // включаем пермещение напрво
        }else if (obj.orientation == -1 && coordinateEvilOnMapX > obj.borderMoveL){
            obj.evilImg.frameY = 1;
            obj.rightMove = false;
            obj.leftMove = true;
            this.movingLeft(obj);
        }else {
            /* Произошло столкновение с игроком */
            obj.dx = 0;
        }

        if (coordinateEvilOnMapX + obj.width * 3/2 >= obj.borderMoveR){
            /* Враг ниходится на правой границе патрулирования */
            obj.evilImg.frameY = 1;    // изменяем спрайты на движения в левую сторону
            obj.rightMove = false;     // выключаем движение вправо
            obj.leftMove = true;       // включаем движение влево
            //elem.coordinate.x -= 10;    
            this.movingLeft(obj);      // ничинаем перемещение влево
        }else if (coordinateEvilOnMapX <= obj.borderMoveL){
            obj.evilImg.frameY = 2;    // изменяем спрайты на движения в левую сторону
            obj.rightMove = true;      // включаем движение вправо
            obj.leftMove = false;      // выключаем движение влево
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
        if (obj.leftMove && obj.collisions[3] === 0){
            /* Разрешено движение влево */
            if (coordinateEvilOnMapX - obj.dx > 0){
                /* Слева нет границы карты */
                if (this.isCollisionWithHero(obj) && !this.processJump && obj.orient === 1){
                       this.doDamage(obj);
                }else {
                    obj.dx = obj.speed * obj.orient;

                    obj.coordinate.x -= obj.collisions[1] === 0? obj.dx: 0; // если враг не дошёл до блока справа с коллизией, при отходе от персонажа

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
        var coordinateEvilOnMapX = obj.coordinate.x - modules.backrg.x;  // координаты врага относительно всего фона карты (но показыает не точные координаты, если упереться в правую границу)
        
        if(obj.cooldown === 0){ // Если не перезаряжается
            if(modules.hero.block == false){ // если персонаж не блокирует
                modules.hero.hp -= obj.attackPower;
                /* Берём отдельного врага */
                if (coordinateEvilOnMapX > modules.hero.coordinate.x - modules.backrg.x){
                    /* Игрок находится слева */
                    obj.evilImg.frameY = 3;    // изменяем положения картинки в спрайте
        
                }else if (coordinateEvilOnMapX < modules.hero.coordinate.x - modules.backrg.x){
                    /* Игрок находится справа  */
                    obj.evilImg.frameY = 2;
                }
                // Тут мы можем страдать от скорости обращения к DOM элементам
                modules.game.heroHp.innerHTML = String(modules.hero.hp) + " HP";
                modules.game.heroHp.parentElement.style.width = String(modules.hero.hp / modules.hero.maxHp * 100) + "%";
                modules.render.textDamag.push(new TextDamage(obj.attackPower, modules.hero.coordinate.x, modules.hero.coordinate.y, 50, 'red')); // создаём текст с информацией о полученном уроне

                if(modules.hero.hp <= 0){
                    /* ХП героя закончились */
                    modules.render.endGame = true;      // говрим, что конце игры
                    modules.game.statusHero = false;    // игрок проиграл
                }
            }else{
                modules.actHero.doReductionMana(5);
                if(modules.hero.mp < 5 && modules.hero.block) modules.hero.block = false; // если мана истрачена, то убираем флаг на блок у игрока
            }
            obj.cooldown += 1;
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
        
        if (obj.rightMove && obj.collisions[1] === 0){
            if (coordinateEvilOnMapX + obj.dx + 3/2 * obj.width <= modules.mapCol.widthInTile * 10){
                /* Справа нет границы карты */

                if (this.isCollisionWithHero(obj) && !this.processJump && obj.orient === 1){
                    this.doDamage(obj);
                }else{
                    obj.dx = obj.speed * obj.orient;

                    obj.coordinate.x += obj.collisions[3] === 0? obj.dx: 0; // если враг не дошёл до блока слева с коллизией, при отходе от персонажа

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