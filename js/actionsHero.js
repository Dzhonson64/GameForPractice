import * as modules from "./modules.js";
export default class ActionsHero {
/* Описание действий персонажа-героя */

    constructor(){
        this.flag = 0;              // кол-во нажатых кнопок, отвечающих за перемещение
        this.intervalAnimMove;      // переменная, хранящая setInterval перемещения
        this.intervalAnimJump;      // переменная, хранящая setInterval прыжка
        this.processJump = false;   // флаг указывающий, что начался ли прыжок или нет
        this.jumpPress = false;     // флаг, отвечающий за нажатие кнопки прыжка
        this.rightPress = false;    // флаг, отвечающий за нажатие кнопки вправо
        this.leftPress  = false;    // флаг, отвечающий за нажатие кнопки влево
        
        this.jumpCount = 0;
        this.jumpLength = 50;       // высота прыжка
        // modules.backrg.y = modules.game.floorCoordinate;
        document.onkeydown = (elem) => {
            if (elem.code == "KeyA"){
                /* Нажата кнопка A */
                this.leftPress = true;
                modules.hero.heroImg.frameY = 1;
            }
            if (elem.code == "KeyD"){
                 /* Нажата кнопка D */
                this.rightPress = true;
                modules.hero.heroImg.frameY = 2;
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
    

    /* Перемещение героя */
    moving(){
        // console.log('move', modules.game.width / 2, -modules.backrg.x);

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
        //console.log(modules.backrg.endBackgr);



        //---! Движение фона обратно движению персонажа !---
        
        if (this.leftPress){ //Если движемся влево
            // console.log('l', modules.backrg.endBackgr, -modules.backrg.x, modules.backrg.x < 0 && !modules.backrg.endBackgr, modules.backrg.endBackgr && modules.hero.coordinate.x - modules.hero.dx > 0, modules.hero.coordinate.x);
            
            /* [1] - Смотрим на инвертированное значение флага endBackgr и проверяем не дошёл ли фон до левой границы холста 0 */
            if(modules.backrg.x < 0 && !modules.backrg.endBackgr){  

                // движение !фона
                modules.backrg.x += modules.backrg.k * modules.hero.dx;

                // движение !врагов относительно движения персонажа
                modules.render.evils.forEach((elem) => {
                    elem.coordinate.x += modules.hero.dx;
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

        else if (this.rightPress){
            // console.log('r', modules.backrg.endBackgr, -modules.backrg.x + 200 < modules.game.width && !modules.backrg.endBackgr, (modules.backrg.endBackgr || -modules.backrg.x + 200 == modules.game.width), modules.hero.coordinate.x + modules.hero.width, modules.game.canvasField.width);

            /* [1] - Смотрим на инвертированное значение флага endBackgr и проверяем не дошёл ли фон до правой границы холста 1000. Тут работает магическое число 200, 
                    т. к. персонаж смещён от начала фона и образуется пустота при подходе вправо (если не ставить число 200) */

            if(-modules.backrg.x + 200 < modules.game.width && !modules.backrg.endBackgr){

                // движение !фона
                modules.backrg.x -= modules.hero.dx;


                // движение !врагов относительно движения персонажа
                modules.render.evils.forEach((elem) => {
                    elem.coordinate.x -= modules.backrg.k * modules.hero.dx;
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
        if(this.jumpPress && this.processJump){
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