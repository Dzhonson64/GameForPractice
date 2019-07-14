import * as modules from "./modules.js";
import Evil from './evil.js'
import TextDamage from './textDamage.js'
export default class Render{
    /* Рендер карты, который отвечает за отрисовку объектов */
    
    constructor(){
        this.evils = [];    // массив врагов
        this.evils.push(new Evil(modules.game.floorCoordinate, 500, 900));
        this.weapons = [];  // массив стрел
        this.nowTime = performance.now();
        this.nextTime;
        this.flagFPS = true;
        this.timeGame = true;
        this.textDamag = [];
    }
    drawImages(){
        /* Метод, который отображет картинки через drawImage() */
        
        /* Очистка области canvas для отрисовки нового состояние */
        modules.game.ctx.clearRect(
            0,
            0,
            modules.game.width,
            modules.game.height
        );
        


        // Отрисовка фона

        modules.game.ctx.drawImage(
            modules.backrg.backImg.image,
            modules.backrg.x,
            modules.backrg.y,
            modules.game.height * modules.backrg.aspect,
            modules.game.height
        );

        //Отрисовка местности

        modules.mapCol.mapCollision.forEach( (elem) => {
            let y1 = Number(elem[0].slice(0, elem[0].indexOf('.'))),
                y2 = Number(elem[0].slice(elem[0].indexOf('.') + 1));

            for(let x = 1, kx = 0; x < elem.length; x++){
                let x1 = Number(elem[x].slice(0, elem[x].indexOf("*"))),
                    x2 = Number(elem[x].slice(elem[x].indexOf("*") + 1));
                    
                if(x1 !== 0){
                    modules.game.ctx.drawImage(
                        modules.mapCol.tileType[x1 - 1].image,
                        kx * 10 + modules.backrg.x, 
                        y1 * 10 + modules.backrg.y,
                        x2 * 10,
                        (y2 - y1) * 10 + 10 // 10 - размер стороны тайла
                    );
                }
                kx += x2;
            }
        });
        /* Отрисовка героя */
        modules.game.ctx.drawImage(
            modules.hero.heroImg.image,
            modules.hero.width * modules.hero.heroImg.frameX,
            modules.hero.height * modules.hero.heroImg.frameY,
            modules.hero.width,
            modules.hero.height,
            modules.hero.coordinate.x,
            modules.hero.coordinate.y,
            modules.hero.width,
            modules.hero.height
        )
        
        /* Отрисовка врагов */
        this.evils.forEach( (elem) => {
            modules.game.ctx.drawImage(
                elem.evilImg.image,
                elem.width * elem.evilImg.frameX,
                elem.height * elem.evilImg.frameY,
                elem.width,
                elem.height,
                elem.coordinate.x,
                elem.coordinate.y,
                elem.width,
                elem.height
            )
        })

        /* Отрисовка стрелы */
        this.weapons.forEach( (elem) => {
            modules.game.ctx.save();
            modules.game.ctx.translate(elem.coordinate.x + modules.backrg.x, elem.coordinate.y);
            /* Мы знаем коодинаты стрелы по х и у, и чтобы повернуть стрелу в нужное напрвление, надо переместить 
                начало координат в координаты стрелы и повернуть уже там на нужный нам угол.
            */
            modules.game.ctx.rotate(-elem.angle * Math.PI / 180);
   
            modules.game.ctx.drawImage(
                elem.weaponImg.image,
                0, 0,               // мы уже переместили стрелу в её координаты, поэтому спавним в начале координат
                elem.width,
                elem.height,
            )
            modules.game.ctx.restore();
        });
        modules.skills.showAbilBar();
    }

    processGame(){
        /* обновление игоровго процесса, относительно которого будут перересовывать изображения с помощью метод  drawImages() */
        window.requestAnimationFrame(() => {
            this.drawImages();              // отбражение всех картинок
            
            for (let i in this.evils){
                if(this.evils[i].mode === 0){ // если враг патрулирует
                    modules.actEvil.quiteMove(this.evils[i]);
                    // проверяем, не появился ли персонаж в зоне патрулирования
                    if(this.evils[i].borderMoveL + modules.backrg.x <= modules.hero.coordinate.x && this.evils[i].borderMoveR + modules.backrg.x >= modules.hero.coordinate.x
                        && Math.abs(modules.hero.coordinate.y - this.evils[i].coordinate.y) <= this.evils[i].height){
                        this.evils[i].mode = 1; 
                    }
                }else if(this.evils[i].mode == 1){ // если враг агрессирует
                    modules.actEvil.attackMove(this.evils[i]);
                    // если персонаж пропал из зоны видимости
                    if(this.evils[i].radiusVisible < Math.abs(modules.hero.coordinate.x - this.evils[i].coordinate.x)
                        || Math.abs(modules.hero.coordinate.y - this.evils[i].coordinate.y) > this.evils[i].height){
                        this.evils[i].mode = 0;
                    }
                }
                modules.actEvil.isCollisionWithHero(this.evils[i]); // проверка на столкновение с врага с героем
                this.evils[i].health();                             // вывод жизней врага
                // проверяем cooldown, и если он запущен (не равен 0), то увеличиваем его
                if(this.evils[i].cooldown !== 0){
                    
                    this.evils[i].cooldown += 1;
                }
                // если cooldown подошёл к концу, то обнуляем его
                if(this.evils[i].cooldown >= this.evils[i].attackDelay){
                    this.evils[i].cooldown = 0;
                    this.evils[i].orient = 1;
                }
                
                for (let j in this.weapons){
                    var flagHit = this.weapons[j].isHit(this.evils[i]);
                    if(flagHit){
                        /* Стрела попала в врага */
                        this.evils[i].hp -= modules.hero.hit;
                        this.textDamag.push(new TextDamage(modules.hero.hit, this.evils[i].coordinate.x, this.evils[i].coordinate.y, 50)); // создаём текст с информацией о нанесённом уроне
                        if (this.evils[i].hp == 0){
                            this.evils[i].isAlive = false; // говорим, что враг мёртв
                        }
                        
                    }
                    if (this.weapons[j].isOutOfBordersCanvas() || flagHit){
                        /* Если стерела вылетела за границы холста или попала во врага */
                        this.weapons.splice(j, 1);  // удаляем стрелу
                    }
                }

                if (!this.evils[i].isAlive){
                    /* Враг мёртв */
                    var oldScore = Number($("#score").text());
                    $("#score").text( oldScore += 1 );
                    this.evils.splice(i, 1); // удалем врага
                }
            }
            for (let i = 0; i < this.weapons.length; i++){ // перемещаем стрелы
                this.weapons[i].move();

                // -----!ХВАТИТ УДАЛЯТЬ ЭТО, ИБО СТРЕЛЫ НЕ УБИРАЮТСЯ!-----

                if (this.weapons[i].isOutOfBordersCanvas()){
                    /* Если стерела вылетела за границы холста */
                    this.weapons.splice(i, 1);  // удаляем стрелу
                }

            }

            for(let i in this.textDamag){
                if(this.textDamag[i].showText()){
                    /* Если время жизни текста закончилось */
                    this.textDamag.splice(i, 1);    // удаляем текст
                }
            }


            modules.actHero.moving();   // обработка перемещения персонажа
            this.fps(); // ФПС игры
            this.processGame();
        }, this);
        
    }
    /* обработка ФПС игры */
    fps(){       
        var fpsBlock = document.getElementById("fps");  // блока, где будет выводится ФПС
        var delta = (this.nowTime  - this.nextTime) / 1000; // разница вермени, переведённое в миллисекнуды
        this.nextTime = this.nowTime;   // старое времся становится бывшим верменем
        
        this.nowTime = performance.now();       // вычисляем новое время
        fpsBlock.innerHTML = Math.round(1 / delta); // выводим ФПС
    }
    /* Таймер игры */
    timerGame(){
        var seconds = Number(document.getElementById("secondTimer").innerText);     // берём секунды из html
        var minutes = Number(document.getElementById("minutesTimer").innerText);    // берём минуты из html
        var timer = setTimeout(function run(){
            if (minutes < 0 && seconds < 0){
                /* Минуты и секунды меньше 0. Время закончилось */
                this.timeGame = false;  // флаг опускаем. Игры закончилась
                clearTimeout(timer);
            }else{
                seconds--; 
                if (seconds < 0){
                    minutes--;
                    seconds = 59;
                }
                /* Обновляем отображаемое время */
                if (seconds < 10){
                    document.getElementById("secondTimer").innerText = "0" + seconds;
                }else{
                    document.getElementById("secondTimer").innerText = seconds;
                }
                
                document.getElementById("minutesTimer").innerText = minutes;
                
                setTimeout(run, 1000);
            }
        }, 1000)
	}

}