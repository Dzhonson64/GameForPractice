import * as modules from "./modules.js";
import Weapon from './weapon.js'
import Gravity from "./gravity.js";
export default class ActionsHero{
/* Описание действий персонажа-героя */

    constructor(){
        this.flag = 0;              // кол-во нажатых кнопок, отвечающих за перемещение
        this.intervalAnimMove;      // переменная, хранящая setInterval перемещения
        this.intervalAnimJump;      // переменная, хранящая setInterval прыжка
        this.jumpPress = false;     // флаг, отвечающий за нажатие кнопки прыжка
        this.rightPress = false;    // флаг, отвечающий за нажатие кнопки вправо
        this.leftPress  = false;    // флаг, отвечающий за нажатие кнопки влево
        this.upperPoint = false;    // достиг ли персонаж верхней точеи своего прыжка
        this.jumpStatus = 0;        // статус прыжка, в данном случае, путь до верхней точки при прыжке составляет 15 фреймов
        this.jumpLength = 15;       // высота прыжка
        this.gravAct = new Gravity(modules.hero, this);
        
        document.onkeydown = (elem) => {
            if (elem.code == "KeyA"){
                /* Нажата кнопка A */
                this.leftPress = true;
                modules.hero.heroImg.frameY = 1;
                modules.hero.orientation = -1;
            }
            if (elem.code == "KeyD"){
                 /* Нажата кнопка D */
                this.rightPress = true;
                modules.hero.heroImg.frameY = 2;
                modules.hero.orientation = 1;
            }
            if (elem.code == "Space"){
                 /* Нажата кнопка Space */
                this.jumpPress = true;
            }
        }
           
        document.onkeyup = (elem) => {
            if (elem.code == "KeyA"){
                /* Отжата кнопка A */
                this.leftPress = false;
            }
            if (elem.code == "KeyD"){
                 /* Отжата кнопка D */
                this.rightPress = false;
            }
        }

        document.onclick = (elem) =>{
            let weapon = new Weapon(modules.hero.coordinate.x, modules.hero.coordinate.y);
            modules.render.weapons.push(weapon);
            var x1 = elem.clientX;  // кординаты мыши по X
            var y1 = elem.clientY;  // кординаты мыши по Y
            var x2 = modules.hero.coordinate.x + modules.hero.width / 2;    // кординаты персонажа по X
            var y2 = modules.hero.coordinate.y + modules.hero.height / 2;   // кординаты персонажа по Y
            var katetX = Math.round(this.widthLine(x1, y2, x2, y2));        // вычисление длины катета, который лежит на оси X
            var katetY = Math.round(this.widthLine(x1, y1, x1, y2));        // вычисление длины катета, который лежит на оси Y
            var gipotenyza = Math.sqrt(katetX * katetX + katetY * katetY);  // вычисление длины гипотенцзы
            
            
            if (x1 < x2 && y1 < y2 || x1 < x2 && y1 > y2 ){ // II и III четверть
                katetX = -katetX;
                weapon.coefficient = -1;
            }
            if (x1 < x2 && y1 > y2 || x1 > x2 && y1 > y2){ // III и IV четверть
                katetY = -katetY;
            }
            var k = katetY / katetX;                    // вычисление коэффициент угла наклона через тангенс
            var sin = katetY / gipotenyza;              // вычисляем синус угла
            var angel = Math.asin(sin) * 180 / Math.PI; // вычисляем значение угла прямой между персонажем и мышкой
            
            if (x1 < x2 && y1 < y2 ){ // II четверть
                angel = 180 - angel ;
            }
            if (x1 < x2 && y1 > y2){  // III четверть
                angel = -180 - angel;
            }
            weapon.k = k;

            //weapon.addEventListener("load", function(){
                //modules.game.ctx.rotate(angel * Math.PI / 180);                
                weapon.drawRotated(100, 100, angel, 100, 100);
                
                
            //})
            
            
            weapon.move();
           
        }
        
    }

    /* Проверка на столкноввение с противником */
    isCollisionWithEvil(){
        for (let i in modules.render.evils){
            if (modules.hero.orientation == 1 && modules.hero.coordinate.x + modules.hero.width - modules.render.evils[i].coordinate.x > 0 && 
                modules.hero.coordinate.x + modules.hero.width - modules.render.evils[i].coordinate.x <= modules.render.evils[i].width && 
                modules.hero.coordinate.y + modules.hero.height >= modules.render.evils[i].coordinate.y &&
                modules.hero.coordinate.y <= modules.render.evils[i].coordinate.y + modules.render.evils[i].height){
                /* Если игрок был справа и разница координат игрока и координта проивника положительна и меньше длины картинки врага */

                return true;
            }else if (modules.hero.orientation == -1 && modules.hero.coordinate.x - (modules.render.evils[i].coordinate.x  + modules.render.evils[i].width) < 0 &&
             modules.hero.coordinate.x - modules.render.evils[i].coordinate.x  + modules.render.evils[i].width >= modules.render.evils[i].width && 
             modules.hero.coordinate.y + modules.hero.height >= modules.render.evils[i].coordinate.y &&
             modules.hero.coordinate.y <= modules.render.evils[i].coordinate.y + modules.render.evils[i].height){
               /* Если игрок был слева и разница координат игрока и координта проивника отрицательна и больше длины картинки врага */

                return true;
            }
        }
        return false;
       
    }

    /* Перемещение героя */
    moving(){
        var coordinateHeroOnMapX = -modules.backrg.x + modules.hero.coordinate.x;
        /* 200 (modules.hero.offset) - магическое число, стартовая позиция персонажа и место за которое будет закрепляться персонаж, если фон можно двигать.
            Если фон не двигается, то движется персонаж, пока не дойдёт до границы холста.
            Условие ниже определяет конец фона, но оно не корректно опеделяет флаг при координате персонажа 200, 
            поэтому далее выстанавливаем вспомогательные условия (помечены комментарии с приставкой [1]). Место костылей, рассматриваем варианты замены */

        if(modules.backrg.x <= 0 && modules.hero.coordinate.x >= modules.hero.offset && modules.game.width / 2 > -modules.backrg.x || // левая граница фона
           -modules.backrg.x + modules.hero.offset <= modules.game.width && modules.hero.coordinate.x <= modules.hero.offset && modules.game.width / 2 <= -modules.backrg.x){ // правая граница фона
                modules.backrg.endBackgr = false; // Можно двигать фон (кроме некоторых случаев, которые помечены комментариями с приставкой [1])
        }else{
            modules.backrg.endBackgr = true;    // Нельзя двигать фон
        }

        //---! Движение фона обратно движению персонажа !---
        if (this.leftPress && !this.isCollisionWithEvil() || this.leftPress && this.processJump){ //Если движемся влево

            /* [1] - Смотрим на инвертированное значение флага endBackgr и проверяем не дошёл ли фон до левой границы холста 0 */
            if(modules.backrg.x < 0 && !modules.backrg.endBackgr){  

                // движение !фона
                modules.backrg.x += modules.backrg.k * modules.hero.dx;

                // движение !врагов относительно движения персонажа
                modules.render.evils.forEach((elem) => {
                    elem.coordinate.x += modules.hero.dx;
                    if (modules.hero.coordinateHeroOnMapX >= elem.borderMoveL && modules.hero.coordinateHeroOnMapX <= elem.borderMoveR){
                    }
                })

            /* [1] - Смотрим на значение флага endBackgr и проверяем не дошёл ли персонаж до левой границы холста 0 */
            }else if((modules.backrg.endBackgr || modules.backrg.x == 0) && modules.hero.coordinate.x > 0){
                modules.hero.coordinate.x -= modules.hero.dx; // Движение !персонажа влево
            }

            /* Смена изображений в спрайте для анимации */
            if (modules.hero.width * (modules.hero.heroImg.frameX + 1) < modules.hero.heroImg.image.width) { 
                modules.hero.heroImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                modules.hero.heroImg.frameX = 0;    // то возвращаемся к началу
            }
        }

        else if (this.rightPress && !this.isCollisionWithEvil() || this.rightPress && this.processJump ){ //если движется вправо

            /* Смотрим на инвертированное значение флага endBackgr и проверяем не дошёл ли фон до правой границы карты. Тут работает магическое число 200, 
                    т. к. персонаж смещён от начала фона и образуется пустота при подходе вправо (если не ставить число 200) */

            if(-modules.backrg.x + modules.game.width < modules.mapCol.widthInTile * 10 && !modules.backrg.endBackgr){

                // движение !фона
                modules.backrg.x -= modules.hero.dx;


                // движение !врагов относительно движения персонажа
                modules.render.evils.forEach((elem) => {
                    elem.coordinate.x -= modules.backrg.k * modules.hero.dx;
                })

            /* [1] - Смотрим на значение флага endBackgr и проверяем не дошёл ли персонаж до правой границы холста 1000, учитывая длину персонажа */
            }else if((modules.backrg.endBackgr || -modules.backrg.x + modules.game.width == modules.mapCol.widthInTile * 10) && 
                    modules.hero.coordinate.x + modules.hero.width < modules.game.width){
                modules.hero.coordinate.x += modules.hero.dx; // Движение !персонажа влево
            }

            /* Смена изображений в спрайте для анимации */
            if (modules.hero.width * (modules.hero.heroImg.frameX + 1) < modules.hero.heroImg.image.width) {
                modules.hero.heroImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                modules.hero.heroImg.frameX = 0;    // то возвращаемся к началу
            }

        }

        if(this.jumpPress && !this.upperPoint){
            /* Нажата кнопка прыжка и не достиг ли верхней точки */
            if(this.jumpStatus >= this.jumpLength){ // Если статус больше длины, то сбатываем его и поднимаем флаг верхней точки
                this.jumpStatus = 0;
                this.upperPoint = true;
            }else{ // Увелививаем статус и поднимаем персонажа
                this.jumpStatus++;
                modules.hero.coordinate.y-=10;
            }
        }
       
        if(!this.jumpPress || this.upperPoint){ // Если персонаж не в прыжке или достиг верхней точки, то запускаем логику гравитации
            this.gravAct.grav(this);
        }
    }
    widthLine(x1, y1, x2, y2){
        return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
    }

}
