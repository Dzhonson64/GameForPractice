import * as modules from "./modules.js";
import Weapon from './weapon.js'
import Images from './images.js'
import Gravity from "./gravity.js";
export default class ActionsHero{
/* Описание действий персонажа-героя */

    constructor(){
        this.jumpPress = false;     // флаг, отвечающий за нажатие кнопки прыжка
        this.rightPress = false;    // флаг, отвечающий за нажатие кнопки вправо
        this.leftPress  = false;    // флаг, отвечающий за нажатие кнопки влево
        this.upperPoint = false;    // достиг ли персонаж верхней точеи своего прыжка
        this.jumpStatus = 0;        // статус прыжка, в данном случае, путь до верхней точки при прыжке составляет 15 фреймов
        this.jumpLength = 15;       // высота прыжка
        this.gravAct = new Gravity(modules.hero, this);
        
        this.ab_0 = new Images('../img/ab_0.jpg');
        this.selectedAbil = 0;




        if (document.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                document.addEventListener("wheel", (e) => {
                    // wheelDelta не дает возможность узнать количество пикселей
                    var delta = e.deltaY || e.detail || e.wheelDelta;
    
                    if(delta > 0){
                        this.selectedAbil = (this.selectedAbil + 1) % 4;
                    }else{
                        this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                    }
                });
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                document.addEventListener("mousewheel", (e) => {
                    // wheelDelta не дает возможность узнать количество пикселей
                    var delta = e.deltaY || e.detail || e.wheelDelta;
    
                    if(delta > 0){
                        this.selectedAbil = (this.selectedAbil + 1) % 4;
                    }else{
                        this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                    }
                });
            } else {
                // Firefox < 17
                document.addEventListener("MozMousePixelScroll", (e) => {
                    // wheelDelta не дает возможность узнать количество пикселей
                    var delta = e.deltaY || e.detail || e.wheelDelta;
    
                    if(delta > 0){
                        this.selectedAbil = (this.selectedAbil + 1) % 4;
                    }else{
                        this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                    }
                });
            }
        } else { // IE8-
            document.attachEvent("onmousewheel", (e) => {
                // wheelDelta не дает возможность узнать количество пикселей
                var delta = e.deltaY || e.detail || e.wheelDelta;

                if(delta > 0){
                    this.selectedAbil = (this.selectedAbil + 1) % 4;
                }else{
                    this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                }
            });
        }
        


        
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
                modules.hero.heroImg.frameY = 0;
                modules.hero.orientation = 1;
            }
            if (elem.code == "Space"){
                 /* Нажата кнопка Space */
                this.jumpPress = true;
            }

            if (elem.keyCode == 49){
                /* Нажата кнопка 1 */
                this.selectedAbil = 0
            }
            if (elem.keyCode == 50){
                /* Нажата кнопка 2 */
                this.selectedAbil = 1
            }
            if (elem.keyCode == 51){
                /* Нажата кнопка 3 */
                this.selectedAbil = 2
            }
            if (elem.keyCode == 52){
                /* Нажата кнопка 4 */
                this.selectedAbil = 3
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

            if (Number(modules.game.heroMp.innerText) > 0) {
                /* Маны больше 0 */

                 /* передаём начальные координаты для стрелы, исходя из положения персонажа и размера его спрайта, синус и косинус */
                
                var x1 = elem.clientX;  // кординаты мыши по X
                var y1 = elem.clientY;  // кординаты мыши по Y
               
                if (x1 >= 10 && x1 <= modules.game.width && y1 > 10 && y1 <= modules.game.height){
                    /* Нажатие произошло в границах холста */
                    this.doReductionMana();
                   
                    
                    

                    var x2 = modules.hero.coordinate.x + modules.hero.width / 2;    // кординаты персонажа по X
                    var y2 = modules.hero.coordinate.y + modules.hero.height / 2;   // кординаты персонажа по Y
                    var katetX = Math.round(this.widthLine(x1, y2, x2, y2));        // вычисление длины катета, который лежит на оси X
                    var katetY = Math.round(this.widthLine(x1, y1, x1, y2));        // вычисление длины катета, который лежит на оси Y
                    var gipotenyza = Math.sqrt(katetX * katetX + katetY * katetY);  // вычисление длины гипотенцзы
                   
                    var sinY = katetY / gipotenyza * (y1 >= y2 ? 1: -1), // вычисляем синус угла
                    cosY = katetX / gipotenyza * (x1 >= x2 ? 1: -1), // вычисляем косинус угла   
                    angle = ((x1 >= x2 ? 0: Math.PI) - Math.asin(sinY * (x1 >= x2 ? 1: -1))) * 180 / Math.PI; // вычисляем значение угла прямой между персонажем и мышкой 
                     /* передаём начальные координаты для стрелы, исходя из положения персонажа и размера его спрайта, синус и косинус */
                     
                    
                    this.doIncreaseMana();
                    var weapon = new Weapon(modules.hero.width / 2 + modules.hero.coordinate.x - modules.backrg.x,
                        modules.hero.height / 2 + modules.hero.coordinate.y, sinY, cosY, angle); 
            
                    modules.render.weapons.push(weapon);
                    weapon.move();
                    
                }
                
            }

        }
        
    }




    showAbilBar(){

        modules.game.ctx.globalAlpha = 0.7;

        modules.game.ctx.fillStyle = 'black';
        modules.game.ctx.fillRect(0, 0, 202, 52);

        modules.game.ctx.fillStyle = 'silver';
        modules.game.ctx.fillRect(1, 1, 200, 50);

        modules.game.ctx.globalAlpha = 1;
        modules.game.ctx.fillStyle = 'green';
        modules.game.ctx.fillRect(50 * this.selectedAbil + 3, 3, 46, 46);

        modules.game.ctx.drawImage(this.ab_0.image, 6, 6, 40, 40);
        modules.game.ctx.drawImage(this.ab_0.image, 56, 6, 40, 40);
        modules.game.ctx.drawImage(this.ab_0.image, 106, 6, 40, 40);
        modules.game.ctx.drawImage(this.ab_0.image, 156, 6, 40, 40);
        
    }










    doIncreaseMana(){
        
        var timer = setTimeout(function delay(){
            if ( modules.hero.mp < modules.hero.maxMp){
                /* Таймер закончился */
                modules.hero.mp += modules.hero.deltaMana;
                modules.game.heroMp.innerText = modules.hero.mp; // увеличиваем ману
                modules.game.heroMp.parentElement.style.width = String(modules.hero.mp / modules.hero.maxMp * 100) + "%"; // увеличиваем размер динамической полосы маны
                clearTimeout(timer);
            }else{
                setTimeout(delay, 5000);
            }
            
        }, 5000)
    }
    doReductionMana(){
        if (modules.hero.mp > 0){
            modules.hero.mp -= modules.hero.deltaMana;
            modules.game.heroMp.innerText = modules.hero.mp; // увеличиваем ману
            modules.game.heroMp.parentElement.style.width = String(modules.hero.mp / modules.hero.maxMp * 100) + "%"; // увеличиваем размер динамической полосы маны
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
                modules.hero.coordinate.x -= modules.hero.dx; // ДвЦижение !персонажа влево
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
