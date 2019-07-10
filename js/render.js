import * as modules from "./modules.js";
import Evil from './evil.js'
export default class Render{
    /* Рендер карты, который отвечает за отрисовку объектов */
    constructor(){
        this.evils = [];
        this.evils.push(new Evil(400, modules.game.floorCoordinate));
        // this.xx = new Images("../img/road_forest.png");
        
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
            modules.backrg.y - modules.game.height,
            modules.game.height * modules.backrg.aspect,
            modules.game.height
        );

        //Отрисовка местности

        modules.mapCol.mapCollision.forEach( (elem) => {
            let y1 = Number(elem[0].slice(0, elem[0].indexOf('.'))),
                y2 = Number(elem[0].slice(elem[0].indexOf('.') + 1));

            for(let x = 1, kx = 0; x < elem.length; x++){
                // console.log(x);
                let x1 = Number(elem[x].slice(0, elem[x].indexOf("*"))),
                    x2 = Number(elem[x].slice(elem[x].indexOf("*") + 1));
                    
                if(x1 !== 0){
                    modules.game.ctx.drawImage(
                        modules.mapCol.tileType[x1 - 1].image,
                        kx * 10 + modules.backrg.x,
                        y1 * 10 + modules.backrg.y,
                        x2 * 10,
                        (y2 - y1) * 10 // 10 - размер стороны тайла
                    );
                }
                kx += x2;
            }
        });


        // console.log(this.xx.image);
        // for(let my = 0; my < modules.mapCol.heightInTile; my++){
        //     for(let mx = 0; mx < modules.mapCol.widthInTile; mx++){
        //         if(modules.mapCol.mapcc[my][mx] !== 0){
        //             // console.log(modules.mapCol.mapcc[my][mx], my, mx, modules.mapCol.tileType[modules.mapCol.mapcc[my][mx] - 1]);
        //             // console.log(mx);
                    
        //             modules.game.ctx.drawImage(
        //                 modules.mapCol.tileType[modules.mapCol.mapcc[my][mx] - 1].image,
        //                 mx * 10,
        //                 my * 10,
        //                 10, 10
        //             );
        //             // console.log(modules.mapCol.mapcc[my][mx] - 1);
        //         }
        //     }
        // }
        


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