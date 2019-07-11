import Images from "./images.js";
import * as modules from "./modules.js";

export default class Background{
    constructor(img){
        this.backImg = new Images(img); // создание фона по излбражению
        this.aspect = 1920 / 1200; // соотношение сторон фона
        this.x = 0; this.y = 0; // координаты фона
        this.k = 1; // коэффициент движения фона относительно движения персонажа
        this.endBackgr = false;     //флаг, проверяющий конец фона
        this.difference = modules.mapCol.widthInTile * 10 - modules.game.width; // Разница между шириной всей карты и шириной видимой области



        /*  Зачем нужна разница выше: представим отрезки 
        
            |----камера----|
            |-----------карта-----------|
                           |---разница--|
            по полученной разности мы ограничиваем условия в actionsHero, т к условия для краёв идут без ограничений по какому-то краю (для левой границы нет ограничения справа, 
            аналогично для правой границы). 

        */

    }
}