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

        if (this.leftPress && modules.backrg.x < 0){
            
            /* Нажата кнопка движения влево и не упирается в левую границу карты */

            // modules.hero.coordinate.x -= modules.hero.dx; // перемещается влево
            
            //! движение фона обратно движению персонажа !
            
            /* Смена изображений в спрайте для анимации */
            if (modules.hero.width * (modules.hero.heroImg.frameX + 1) < modules.hero.heroImg.image.width) { 
                modules.hero.heroImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                modules.hero.heroImg.frameX = 0;    // то возвращаемся к началу
            }


            // движение фона
            modules.backrg.x += modules.backrg.k * modules.hero.dx;


            // движение врагов относительно движения персонажа
            modules.render.evils.forEach((elem) => {
                elem.coordinate.x += modules.hero.dx;
            })
        }
        else if (this.rightPress && -modules.backrg.x < modules.game.width){
           /* Нажата кнопка движения вправо и не упирается в правую границу карты */

            // modules.hero.coordinate.x += modules.hero.dx; // перемещается впарво

            /* Смена изображений в спрайте для анимации */
            if (modules.hero.width * (modules.hero.heroImg.frameX + 1) < modules.hero.heroImg.image.width) {
                modules.hero.heroImg.frameX += 1;   // если дошли до конца спрайта
            } else {
                modules.hero.heroImg.frameX = 0;    // то возвращаемся к началу
            }


            // движение фона
            modules.backrg.x -= modules.hero.dx;


            // движение врагов относительно движения персонажа
            modules.render.evils.forEach((elem) => {
                elem.coordinate.x -= modules.backrg.k * modules.hero.dx;
            })
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