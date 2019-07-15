import * as modules from "./modules.js";
export default class Game{
    /* Основные настройки игры, поля и т.п. */

    /* 
        floor - координаты нижней границы перемещения (Number)
    */
    constructor(floor){
        this.canvasField = document.getElementById("canvas");
        this.ctx = this.canvasField.getContext("2d");
        this.heroHp = document.querySelector(".conditions .hp .fill span");
        this.heroMp = document.querySelector(".conditions .mp .fill span");
        
        /* Размеры игрового поля */
        this.width = 1000;
        this.height = 400;

        //this.widthMap = modules.backrg.backImg.image.width - 118;
       
        this.ceilingCoordinate = floor - 100;
        this.floorCoordinate = floor;
        
        /* Установка разморов игрового поля */
        this.canvasField.setAttribute("width", this.width + "px");
        this.canvasField.setAttribute("height", this.height + "px");

        document.getElementById("pause").addEventListener('click', (e) =>{
                /* Нажата кнопка воспроизведение/пауза */
                
            if (modules.render.startStopGame){
                /* Игра была НЕ на паузе */
                modules.render.startStopGame = false;   // останаваливаем игровой процесс

                /* Меняем кнопки воспроизведение/пауза */
                document.getElementById("pause").children[0].classList.remove("none");
                document.getElementById("pause").children[1].classList.add("none");
            }else{
                /* Игра была на паузе */

                this.resume();  // возобновляем таёмеры
                modules.render.startStopGame = true;    // восстанавливаем игровой процесс
                modules.render.timerGame(); // возобновляем таймер игры

                /* Меняем кнопки воспроизведение/пауза */
                document.getElementById("pause").children[0].classList.add("none");
                document.getElementById("pause").children[1].classList.remove("none");
            }
        });
    }
    /* Возобновление работы таймеров */
    resume(){
        for(let i = 0; i < 4; i++){ // пробегаемся по таймерам способностей
            if (modules.skills.isReloads[i]){
                /* Таймер был в запущенном виде до паузы */

                modules.skills.timer(i);    // возобновляемего
            }
        }
        for(let i = 0; i < 2; i++){ // пробегаемся по таймерам бонусов
            if(modules.bonuses.isActives[i] == true){
                /* Таймер был в запущенном виде до паузы */

                switch (i) {
                    /* Включаем соответсвующий таймер для бонуса */
                    case 0:
                        modules.bonuses.timer(i, true, modules.bonuses.addHp, 1);
                        console.log("1 active");
                        break;
                    case 1:
                        modules.bonuses.specialTimer(i, modules.bonuses.addSpeed, 10);
                        break;
                    default:
                        break;
                }
            }
            
        }
    }
}