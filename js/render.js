import * as modules from "./modules.js";
import Evil from './evil.js'
export default class Render{
    /* Рендер карты, который отвечает за отрисовку объектов */
    constructor(){
        this.evils = [];
        this.evils.push(new Evil(modules.game.floorCoordinate, 1920, 1700));
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
            modules.actEvil.quiteMove();
            this.evils.forEach( (elem) => {
                elem.health();
                modules.actEvil.jump(elem);
            })
            modules.actEvil.isCollisionWithHero(this.evils[0]);
            modules.actHero.moving();
            //console.log(elem.coordinate.x - modules.backrg.x + modules.hero.offset - );
            this.processGame();
        }, this);
    }

}