import Images from "./images.js";
import * as modules from "./modules.js";
/* Класс, описывающий способности игры */
export default class Skills{
    constructor(){
        this.timeSkills = [5.1, 10.2, 5.3, 15];
        this.isReloads = [false,false, false, false];
        this.imgSkills = [new Images('../img/skill1.png'), new Images('../img/skill2.png'), new Images('../img/skill3.png'), new Images('../img/skill4.png')];
        this.activeSkill = false;
    }
    timer(numAbil){
        var oldTime = this.timeSkills[modules.actHero.selectedAbil];  // запоминаем начальное время таймера, чтобы потом сбросить
        var time = this.timeSkills[modules.actHero.selectedAbil];     // хранит обновлённое время таймера
        var timerUse = setTimeout(function run(){
            if (time - 0.1 <= 0 ){
                /* Таймер достиг 0.0 секунд */
                this.isReloads[numAbil] = false;        // спосообность номер numAbil закончила действие
                clearTimeout(timerUse);                 // останвливаем счётчик
                this.timeSkills[numAbil] =  oldTime;    // сбрасываем таймер способности
                modules.game.ctx.drawImage(this.imgSkills[numAbil].image, 156, 6, 40, 40);
            }else {
                time -= 0.1;                            // уменьшаем значение таймера на 0.1 секунду
                this.timeSkills[numAbil] = time;        // изменяем значение таймера соответсвующй способности
                setTimeout(run.bind(this), 100);
            }
        }.bind(this), 100);
    }



    showAbilBar(){

        /* Отрисовываем спсобности */
        modules.game.ctx.globalAlpha = 0.7;

        modules.game.ctx.fillStyle = 'black';
        modules.game.ctx.fillRect(0, 0, 202, 52);

        modules.game.ctx.fillStyle = 'silver';
        modules.game.ctx.fillRect(1, 1, 200, 50);

        modules.game.ctx.globalAlpha = 1;
        modules.game.ctx.fillStyle = '#365025';
        modules.game.ctx.fillRect(50 * modules.actHero.selectedAbil + 3, 3, 46, 46);

        

        modules.game.ctx.drawImage(this.imgSkills[0].image, 6, 6, 40, 40);
        modules.game.ctx.drawImage(this.imgSkills[1].image, 56, 6, 40, 40);
        modules.game.ctx.drawImage(this.imgSkills[2].image, 106, 6, 40, 40);
        modules.game.ctx.drawImage(this.imgSkills[3].image, 156, 6, 40, 40);
        
        /* Пробеаемся по всем способностям */
        for(let i = 0; i < 4; i++){
            
            if (this.isReloads[i]){
                /* Способность ещё перезаряжается. Обновляем отображение таймера */
                modules.game.ctx.fillStyle = '#365025';
                modules.game.ctx.fillRect(50 * i + 3, 3, 46, 46);
        
                modules.game.ctx.fillStyle = "white"; 
                modules.game.ctx.font = 'bold 20px sans-serif';
                
                modules.game.ctx.fillText(this.timeSkills[i].toFixed(1), 50 * i + 11, 32);
            }
        }
    }
}