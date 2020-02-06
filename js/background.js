import Images from "./images.js";
import * as modules from "./modules.js";
/* Класс, описывающий фон игры */
export default class Background{
    constructor(level){
        switch(level){
            case 0:
                this.backImg = [new Images("../img/tutor.png"), new Images("../img/forest.png"), new Images("../img/forest.png"), new Images("../img/forest.png"), new Images("../img/forest.png")]; // создание фона по излбражению
                this.aspect = 1924 / 1082; // соотношение сторон фона
                
            break;
            case 1:

            break;
        }
        
        this.x = 0; this.y = 0; // координаты фона
        this.k = 1; // коэффициент движения фона относительно движения персонажа
        this.endBackgr = false;     //флаг, проверяющий конец фона
        this.difference = modules.mapCol.widthInTile * 10 - modules.game.width; // Разница между шириной всей карты и шириной видимой области
        this.backGameWidth = 0;

        /*  Зачем нужна разница выше: представим отрезки 
        
            |----камера----|
            |-----------карта-----------|
                           |---разница--|
            по полученной разности мы ограничиваем условия в actionsHero, т к условия для краёв идут без ограничений по какому-то краю (для левой границы нет ограничения справа, 
            аналогично для правой границы). 

        */

    }
}