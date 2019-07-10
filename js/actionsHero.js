import * as modules from "./modules.js";
export default class ActionsHero {
/* Описание действий персонажа-героя */

    constructor(){
        this.processJump = false;   // флаг указывающий, что начался ли прыжок или нет
        this.jumpPress = false;     // флаг, отвечающий за нажатие кнопки прыжка
        this.rightPress = false;    // флаг, отвечающий за нажатие кнопки вправо
        this.leftPress  = false;    // флаг, отвечающий за нажатие кнопки влево
        
        this.jumpCount = 0;
        this.jumpLength = 50;       // высота прыжка
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
                this.processJump = true;
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
    }
    /* Проверка на столкноввение с противником */
    isCollisionWithEvil(){
        for (let i in modules.render.evils){
            if (modules.hero.orientation == 1 && modules.hero.coordinate.x + modules.hero.width - modules.render.evils[i].coordinate.x > 0 && modules.hero.coordinate.x + modules.hero.width - modules.render.evils[i].coordinate.x <= modules.render.evils[i].width){
                /* Если игрок был справа и разница координат игрока и координта проивника положительна и меньше длины картинки врага */

                return true;
            }else if (modules.hero.orientation == -1 && modules.hero.coordinate.x - (modules.render.evils[i].coordinate.x  + modules.render.evils[i].width) < 0 && modules.hero.coordinate.x - modules.render.evils[i].coordinate.x  + modules.render.evils[i].width >= modules.render.evils[i].width){
               /* Если игрок был слева и разница координат игрока и координта проивника отрицательна и больше длины картинки врага */

                return true;
            }
        }
        return false;
       
    }

    /* Перемещение героя */
    moving(){
        var coordinateHeroOnMapX = -modules.backrg.x + modules.hero.coordinate.x;
        /* 200 - магическое число, стартовая позиция персонажа и место за которое будет закрепляться персонаж, если фон можно двигать.
            Если фон не двигается, то движется персонаж, пока не дойдёт до границы холста.
            Условие ниже определяет конец фона, но оно не корректно опеделяет флаг при координате персонажа 200, 
            поэтому далее выстанавливаем вспомогательные условия (помечены комментарии с приставкой [1]). Место костылей, рассматриваем варианты замены */

        if(modules.backrg.x <= 0 && modules.hero.coordinate.x >= 200 && modules.game.width / 2 > -modules.backrg.x || // левая граница фона
           -modules.backrg.x + 200 <= modules.game.width && modules.hero.coordinate.x <= 200 && modules.game.width / 2 <= -modules.backrg.x){ // правая граница фона
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
                    if (coordinateHeroOnMapX >= elem.borderMoveL && coordinateHeroOnMapX <= elem.borderMoveR){
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
            /* [1] - Смотрим на инвертированное значение флага endBackgr и проверяем не дошёл ли фон до правой границы холста 1000. Тут работает магическое число 200, 
                    т. к. персонаж смещён от начала фона и образуется пустота при подходе вправо (если не ставить число 200) */

            if(-modules.backrg.x + 200 < modules.game.width && !modules.backrg.endBackgr ){

                // движение !фона
                modules.backrg.x -= modules.hero.dx;


                // движение !врагов относительно движения персонажа
                modules.render.evils.forEach((elem) => {
                    elem.coordinate.x -= modules.backrg.k * modules.hero.dx;
                    if (coordinateHeroOnMapX >= elem.borderMoveL && coordinateHeroOnMapX <= elem.borderMoveR){
                    }
                })

            /* [1] - Смотрим на значение флага endBackgr и проверяем не дошёл ли персонаж до правой границы холста 1000, учитывая длину персонажа */
            }else if((modules.backrg.endBackgr || -modules.backrg.x + 200 == modules.game.width) && modules.hero.coordinate.x + modules.hero.width < modules.game.canvasField.width){
                modules.hero.coordinate.x += modules.hero.dx; // Движение !персонажа влево
            }

            /* Смена изображений в спрайте для анимации */
            if (modules.hero.width * (modules.hero.heroImg.frameX + 1) < modules.hero.heroImg.image.width) {
                modules.hero.heroImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                modules.hero.heroImg.frameX = 0;    // то возвращаемся к началу
            }

        }
        if(this.jumpPress && this.processJump || this.jumpPress && this.processJump && this.isCollisionWithEvil()){
            /* Нажата кнопка прыжка и процес прыжка - true */
            this.jumpCount++;
            modules.hero.coordinate.y = -(3 * this.jumpLength * Math.sin(Math.PI * this.jumpCount / this.jumpLength)) +  modules.game.floorCoordinate;
            // modules.backrg.y =  (3 * this.jumpLength * Math.sin(Math.PI * this.jumpCount / this.jumpLength)) +  modules.game.floorCoordinate;
        }
        if(this.jumpCount > this.jumpLength){
            this.jumpCount = 0;
            this.jumpPress = false;
            modules.hero.coordinate.y = modules.game.floorCoordinate;
            // modules.backrg.y = modules.game.floorCoordinate;
            this.processJump = false;
        }
    }
    
}