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
        
        this.selectedAbil = 0;



        this.selectedAbil = 0;
        
        this.intervalIncrease; // интервал для регена маны
        if (document.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                document.addEventListener("wheel", (e) => {
                    if(modules.render.startStopGame){
                        // wheelDelta не дает возможность узнать количество пикселей
                        var delta = e.deltaY || e.detail || e.wheelDelta;
                        if(delta > 0){
                            this.selectedAbil = (this.selectedAbil + 1) % 4;
                        }else{
                            this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                        }
                    }
                    
                });
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                document.addEventListener("mousewheel", (e) => {
                    if(modules.render.startStopGame){
                        // wheelDelta не дает возможность узнать количество пикселей
                        var delta = e.deltaY || e.detail || e.wheelDelta;
        
                        if(delta > 0){
                            this.selectedAbil = (this.selectedAbil + 1) % 4;
                        }else{
                            this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                        }
                    }
                });
            } else {
                // Firefox < 17
                document.addEventListener("MozMousePixelScroll", (e) => {
                    if(modules.render.startStopGame){
                        // wheelDelta не дает возможность узнать количество пикселей
                        var delta = e.deltaY || e.detail || e.wheelDelta;
        
                        if(delta > 0){
                            this.selectedAbil = (this.selectedAbil + 1) % 4;
                        }else{
                            this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                        }
                    }
                });
            }
        } else { // IE8-
            document.attachEvent("onmousewheel", (e) => {
                if(modules.render.startStopGame){
                    // wheelDelta не дает возможность узнать количество пикселей
                    var delta = e.deltaY || e.detail || e.wheelDelta;

                    if(delta > 0){
                        this.selectedAbil = (this.selectedAbil + 1) % 4;
                    }else{
                        this.selectedAbil = (this.selectedAbil > 0 ? (this.selectedAbil - 1): 3);
                    }
                }
            });
        }
        


        
        document.onkeydown = (elem) => {
            if(modules.render.startStopGame){
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
            
        }
        
        document.onkeyup = (elem) => {
            if(modules.render.startStopGame){
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



        
        document.addEventListener('mousedown', (e) =>{ // блок персонажа, прописан ещё в actionsEvil, т к работает так сяк
            console.log(e.which == 1, this.selectedAbil == 1);
            if(e.which == 1 && this.selectedAbil == 1 && modules.hero.mp >= 5 && modules.render.startStopGame){
                modules.hero.block = true;
            }
        });

        document.addEventListener('mouseup', (e) =>{ // убираем блок при отжатии мыши
            if(e.which == 1 && this.selectedAbil == 1 && modules.render.startStopGame){
                modules.hero.block = false;
            }
        });


        document.onclick = (elem) =>{ 
            if(modules.render.startStopGame){
                if(this.selectedAbil == 0 && !modules.skills.isReloads[this.selectedAbil]){ // обычная стрельба
                    this.doArrow(elem, 0, 0, false);
                }else if(this.selectedAbil == 2 && modules.hero.mp >= 15 && !modules.skills.isReloads[this.selectedAbil]){ // три стрелы
                    this.doArrow(elem, 15, 0, false);
                    this.doArrow(elem, 0, 10, false);
                    this.doArrow(elem, 0, -10, false);
                }else if(this.selectedAbil == 3 && modules.hero.mp >= 30 && !modules.skills.isReloads[this.selectedAbil]){ // град стрел
                    this.doArrow(elem, 30, 0, true);
                    this.doArrow(elem, 0, 20, true);
                    this.doArrow(elem, 0, -20, true);
                    this.doArrow(elem, 0, 50, true);
                    this.doArrow(elem, 0, -50, true);
                    this.doArrow(elem, 0, 90, true);
                    this.doArrow(elem, 0, -90, true);
                }
            }             
            
        }
        
        
        
        this.doIncreaseMana(); // запускаем интервал по регену маны
    }



    doArrow(elem, mana, dx, angl){
            /*
             elem - событие для вычисления координаты мыши
             mana - сколько потебляет способность маны, но если стрел несколько, то выставляем нужное потебление на первую стрелу, а остальные ставим здесь по 0
             dx - сдвиг от основной оси(оси главной стрелы, не только по х, но и по у)
             angl - прилетают ли стрелы от верха карты
             */
        
            /* Маны больше 0 */

             /* передаём начальные координаты для стрелы, исходя из положения персонажа и размера его спрайта, синус и косинус */
            
            var x1 = elem.clientX;  // кординаты мыши по X
            var y1 = elem.clientY;  // кординаты мыши по Y
           
            if (x1 >= 10 && x1 <= modules.game.width && y1 > 10 && y1 <= modules.game.height){
                /* Нажатие произошло в границах холста */
                this.doReductionMana(mana);
                
               /* Уводим на перезарядку соответствующую способность */
               if (!modules.skills.isReloads[this.selectedAbil]){
                    /* Перезарядка не идёт у соответствующей способности */
                    modules.skills.isReloads[this.selectedAbil] = true; 
                    modules.skills.timer(this.selectedAbil);        
                }
                
                if(angl === false){
                    var x2 = modules.hero.coordinate.x + modules.hero.width / 2;    // кординаты персонажа по X
                    var y2 = modules.hero.coordinate.y + modules.hero.height / 2;   // кординаты персонажа по Y
                    var katetX = Math.round(this.widthLine(x1, y2, x2, y2));        // вычисление длины катета, который лежит на оси X
                    var katetY = Math.round(this.widthLine(x1, y1, x1, y2));        // вычисление длины катета, который лежит на оси Y
                    var gipotenyza = Math.sqrt(katetX * katetX + katetY * katetY);  // вычисление длины гипотенцзы
                   
                    var sinY = (katetY) / gipotenyza * (y1 >= y2 ? 1: -1), // вычисляем синус угла
                    cosY = (katetX) / gipotenyza * (x1 >= x2 ? 1: -1), // вычисляем косинус угла   
                    angle = ((x1 >= x2 ? 0: Math.PI) - Math.asin(sinY * (x1 >= x2 ? 1: -1))) * 180 / Math.PI; // вычисляем значение угла прямой между персонажем и позицией мышки
                     
                    
                    /* передаём начальные координаты для стрелы, исходя из положения персонажа и размера его спрайта, синус и косинус */
                    
                    var weapon = new Weapon(modules.hero.width / 4 + modules.hero.coordinate.x - modules.backrg.x + dx * sinY,
                        modules.hero.height / 4 + modules.hero.coordinate.y  - dx * cosY, sinY, cosY, angle); 
                }else{
                    var x2 = modules.hero.coordinate.x + modules.hero.width / 2;    // кординаты персонажа по X
                    var y2 = 0;   // кординаты персонажа по Y
                    var katetX = Math.round(this.widthLine(x1, y2, x2, y2));        // вычисление длины катета, который лежит на оси X
                    var katetY = Math.round(this.widthLine(x1, y1, x1, y2));        // вычисление длины катета, который лежит на оси Y
                    var gipotenyza = Math.sqrt(katetX * katetX + katetY * katetY);  // вычисление длины гипотенцзы
                   
                    var sinY = (katetY) / gipotenyza * (y1 >= y2 ? 1: -1),  // вычисляем синус угла
                    cosY = (katetX) / gipotenyza * (x1 >= x2 ? 1: -1)       // вычисляем косинус угла 
                    angle = ((x1 >= x2 ? 0: Math.PI) - Math.asin(sinY * (x1 >= x2 ? 1: -1))) * 180 / Math.PI; // вычисляем значение угла прямой между точкой над персонажем в верху карты и позицией мышки 


                    var weapon = new Weapon(modules.hero.coordinate.x + modules.hero.width / 2 - modules.backrg.x - dx, dx * cosY, sinY, cosY, angle); // sinY = -1, cosY = 0, angle = -90
                    weapon.upperBorderIsFree = true; // для стрел ставим флаг, чтобы они не задевали верхний край карты, т е не удалялись
                    
                }
                
                
        
                modules.render.weapons.push(weapon);
                weapon.move();
                
            }
            
        
    }










    doIncreaseMana(){
        // Вечный интервал для восстановления маны
        this.intervalIncrease = setInterval(function delay(){
            if ( modules.hero.mp < modules.hero.maxMp && modules.render.startStopGame){
                modules.hero.mp =  (modules.hero.mp + modules.hero.deltaMana <= modules.hero.maxMp)? (modules.hero.mp + modules.hero.deltaMana): modules.hero.maxMp;
                modules.game.heroMp.innerText = modules.hero.mp; // увеличиваем ману
                modules.game.heroMp.parentElement.style.width = String(modules.hero.mp / modules.hero.maxMp * 100) + "%"; // увеличиваем размер динамической полосы маны
            }
            
        }, 8000)
    }
    doReductionMana(){
        if (modules.hero.mp > 0){
            modules.hero.mp -= modules.hero.deltaMana;
            modules.game.heroMp.innerText = modules.hero.mp; // уменьшаем ману
            modules.game.heroMp.parentElement.style.width = String(modules.hero.mp / modules.hero.maxMp * 100) + "%"; // уменьшаем размер динамической полосы маны
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
