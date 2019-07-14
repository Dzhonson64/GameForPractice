import * as modules from "./modules.js";

export default class TextDamage{
    constructor(text, x, y, timeVis, color = 'yellow', size = '15px', family = 'sans-serif', type = 'bold'){
        this.text = text;               // информация, всплывающего текста
        this.coordinate = {             // координаты текста
            x: x - modules.backrg.x,    // важно получить начальные координаты не просто относительно холста, а относительно фона
            y: y
        }

        this.timeVizible = timeVis;     // максисальное время жизни текста (получается оно в фреймах)
        this.curTime = 0;               // текущее время жизни текста   


        // стилевые характеристики текста

        this.type = type;
        this.color = color;
        this.size = size;
        this.family = family;           
        this.opacity = 1;         
    }

    showText(){
        modules.game.ctx.globalAlpha = this.opacity;        // устанавливаем прозрачность для холста
        modules.game.ctx.fillStyle = this.color;            // цвет текста
        modules.game.ctx.font = this.type + ' ' + this.size + ' ' + this.family;    // сам текст
        modules.game.ctx.fillText(this.text, this.coordinate.x + modules.backrg.x, this.coordinate.y); // рисуем
        modules.game.ctx.globalAlpha = 1;                   // устанавливаем прежнюю прозрачность для холста (1)
        if(this.curTime < this.timeVizible / 4){    
            this.coordinate.y-=1.5;                         // движение текста вверх
        }else{
            this.coordinate.y++;                            // движение текста вниз
        }
        this.opacity -= 1 / this.timeVizible;               // уменьшаем прозрачность 
        this.curTime++;                                     // увеличиваем счётчик времени
        // возвращаем флаг о состоянии жизни текста
        if(this.curTime >= this.timeVizible){
            return true;                    // время жизни текста закончилось
        }else{
            return false;                   // время жизни текста ещё не закончилось
        }
    }
}