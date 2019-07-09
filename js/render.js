import * as modules from "./modules.js";
import Evil from './evil.js'
export default class Render{
    /* Рендер карты, который отвечает за отрисовку объектов */
    constructor(){
        this.evils = [];
        this.evils.push(new Evil(400, modules.game.floorCoordinate));
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

        modules.game.ctx.drawImage(
            modules.backrg.backImg.image,
            modules.backrg.x,
            modules.backrg.y - modules.game.height
        );

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
    }

    processGame(){
        /* обновление игоровго процесса, относительно которого будут перересовывать изображения с помощью метод  drawImages() */
        window.requestAnimationFrame(() => {
            this.drawImages();
            modules.actEvil.selectSide();
            this.evils.forEach( (elem) => {
                elem.health();
            })
            modules.actHero.moving();
            this.processGame();
        }, this);
    }

}