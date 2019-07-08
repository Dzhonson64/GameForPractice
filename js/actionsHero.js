import * as modules from "./modules.js";
export default class ActionsHero {
/* Описание действий персонажа-героя */

    constructor(){
        this.flag = 0;              // кол-во нажатых кнопок, отвечающих за перемещение
        this.intervalAnimMove;      // переменная, хранящая setInterval перемещения
        this.intervalAnimJump;      // переменная, хранящая setInterval прыжка
        this.button;                // запоминает какая кнопка была нажата
        this.flagUp = false;        // флаг, отвечающий за касания верхней границы прыжка героя
        this.flagDown = false;      // флаг, отвечающий за касания нижней границы прыжка героя
        this.flagStopJump = true;   // флаг, отвечающий за остоновку прыжка
        document.onkeydown = (elem) => {
            this.button = elem.code;            
            if (elem.code == "KeyA"){
                /* Нажата кнопка A */
                
                modules.hero.heroImg.frameY = 1;        // переходим на нужную строку картинов в спрайте
                this.flag++;
                modules.hero.dx = modules.hero.speedX;  // увеличиваем кол-во нажатых кнопок
                this.moving();                          // начинаем перемещение
            }
            if (elem.code == "KeyD"){
                modules.hero.heroImg.frameY = 2;
                this.flag++;
                modules.hero.dx = modules.hero.speedX;
                this.moving();
            }
            if (elem.code == "Space"){
                //this.flag++; 
                modules.hero.dy = modules.hero.speedY;               
                this.jump();
            }
            document.onkeyup = (elem) => {
                if (elem.code == "KeyA"){
                    /* Отжата кнопка A */
                    this.flag = 0; // кол-во нажатых кнопок обнуляем
                    clearInterval(this.intervalAnimMove);   // обнуляем setIntereval
                }
                if (elem.code == "KeyD"){
                    this.flag = 0;
                    clearInterval(this.intervalAnimMove);
                }
                if (elem.code == "Space"){
                    clearInterval(this.intervalAnimMove);
                }
            }
        }
    }
    /* Перемещение героя */
    moving(){
       
        if (this.flag < 2){            
            /* Кол-во нажатых кнопока - 1 */
            this.intervalAnimMove = setInterval(function() {  //запускаем интервал перемещения 
                
                if (this.button == "KeyA"){
                    /* Была нажата кнопка A */
                    if (modules.hero.coordinate.x - modules.hero.dx > 0){
                        /* Не произошло столкновение с левой границы карты */
                        modules.hero.coordinate.x -= modules.hero.dx;
                    }                    
                }
                if (this.button == "KeyD"){
                    /* Была нажата кнопка D */
                    if (modules.hero.coordinate.x + modules.hero.dx + modules.hero.width < modules.game.width){
                       /* Не произошло столкновение с правой границы карты */
                        modules.hero.coordinate.x += modules.hero.dx;
                    }
                }

                if (modules.hero.width * (modules.hero.heroImg.frameX + 1) < modules.hero.heroImg.image.width) { //для смены позиции изображения
                    modules.hero.heroImg.frameX += 1;   // если дошли до конца спрайта
                } else {
                    modules.hero.heroImg.frameX = 0;    // то возвращаемся к началу
                }

            }.bind(this) , 1000/24)
        }
    }

    /* Обработка прыжка персонажа */
    jump(){
        if (this.flagStopJump){
            /* Прыжок ещё не начинался или он уже был закончен */
            
            this.flagStopJump = false; // указываем, что прыжок может начаться
            this.intervalAnimJump = setInterval(function() {                       
                
                if (!this.flagUp && !this.flagDown && !this.flagStopJump){
                    /* Персонаж не каснулся верхней и нижней границы прыжка и прыжок не остановлен */
                    modules.hero.coordinate.y -= modules.hero.dy; // пермещаем персонажа вверх
                    
                    if (modules.hero.coordinate.y <= modules.game.ceilingCoordinate - modules.hero.sizeJump){
                        /* Верхний предел прыжка достигнут */
                       this.flagUp = true; 
                    }
                }else if (this.flagUp && !this.flagDown){
                    /* Верхний предел прыжка достигнут, но не достигнут нижний предел */
                    modules.hero.coordinate.y += modules.hero.dy; // пермещаем персонажа вниз
    
                    if (modules.hero.coordinate.y >= modules.game.floorCoordinate){
                        /* Нижний предел прыжка достигнут */
                        this.flagDown = true;
                    }
                }else if (this.flagUp && this.flagDown){
                    /*Нижний и верхний предел достигнут */
                    clearInterval(this.intervalAnimJump); // останавливаем анимацию прыжок
                    this.flagStopJump = true;
                    this.flagUp = false;
                    this.flagDown = false;
                }
                
            }.bind(this) , 1000/24)
        }
        
    }
}