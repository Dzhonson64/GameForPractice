import * as modules from "./modules.js";
import Evil from './evil.js'
export default class Render{
    /* Рендер карты, который отвечает за отрисовку объектов */
    
    constructor(){
        this.evils = [];    // массив врагов
        this.evils.push(new Evil(modules.game.floorCoordinate, 500, 600));
        this.weapons = [];  // массив стрел
        this.nowTime = performance.now();
        this.nextTime;
        this.flagFPS = true;
        this.timeGame = true;
        
        
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
            // console.log(elem.coordinate.x, modules.backrg.x);
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
    }

    processGame(){
        /* обновление игоровго процесса, относительно которого будут перересовывать изображения с помощью метод  drawImages() */
        window.requestAnimationFrame(() => {
            this.drawImages();              // отбражение всех картинок
            modules.actEvil.quiteMove();    // враги патрулируют
            for (let i in this.evils){
                modules.actEvil.isCollisionWithHero(this.evils[i]); // проверка на столкновение с врага с героем
                this.evils[i].health();                             // вывод жизней врага
                
                for (let j in this.weapons){
                    if(this.weapons[j].isHit(this.evils[i])){
                        /* Стрела попала в врага */
                        var oldScore = Number($("#score").text());
                        $("#score").text( oldScore += 1 );
                        this.evils[i].isAlive = false; // говорим, что враг мёртв
                    }
                    if (this.weapons[j].isOutOfBordersCanvas() || this.weapons[j].isHit(this.evils[i])){
                        /* Если стерела вылетела за границы холста или попала во врага */

                        this.weapons.splice(j, 1);  // удаляем стрелу
                    }
                }

                if (!this.evils[i].isAlive){
                    /* Враг мёртв */
                    this.evils.splice(i, 1); // удалем врага
                }
            }
            for (let i = 0; i < this.weapons.length; i++){ // перемещаем стрелы
                this.weapons[i].move();
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
                /* Обновляем отображаемое вермя */
                document.getElementById("secondTimer").innerText = seconds;
                document.getElementById("minutesTimer").innerText = minutes;
                setTimeout(run, 1000);
            }
        }, 1000)
	}

}