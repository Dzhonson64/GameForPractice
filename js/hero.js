import Images from "./images.js";
import * as modules from "./modules.js";
export default class Hero{
    /* Описание героя игры */

    /*
        startX - начальная координата по X (number),
        startY - начальная координата по Y (number),
    */
    constructor(startX, startY){
        this.heroImg = new Images("../img/body.png", 7);
        this.width = 372 / 7;    // длина картинки в спрайте
        this.height = 251 / 4;   // ширина картинки в спрайте
        this.dx = 5;        // скорость изменения положения по X
        this.dy = 15;       // скорость изменения положения по Y
        this.sizeJump = 50; // макс. высота прыжка
        this.coordinate = { // координаты персонажа
            x: startX,
            y: startY
        }
        this.hp = 100;      // ХП
        this.mp = 200;
        this.maxHp = 100;
        this.maxMp = 200;
        this.orientation = 1;   // ориентация героя (1 - вправо, -1 - влево)
        this.offset = startX ? startX : 0; // начальный отступ от левой границы холста
        this.deltaMana = 20;
        this.deltaHp = 20;
        this.hit = 20;
        this.block = false; // блокирует ли персонаж
        this.hands = {
            img: new Images('../img/hands1.png', 4),
            width: 171 / 4,
            height: 91 / 2,
            shoot: 0,
            left: {
                coordinate: {
                    offsetX: [[this.width - 38, this.width - 36, this.width - 34, 
                        this.width - 32, this.width - 30, this.width - 30, this.width - 26],
                        // лево
                        
                        [this.width - 38, this.width - 36, this.width - 34, 
                        this.width - 32, this.width - 30, this.width - 30, this.width - 26]
                        //право
                    ],
                    offsetY: [15, 15, 15, 15, 15, 15, 15],


                    anchorX:[-4, // лево
                            -15], //право
                    anchorY:[-14,// лево
                            -12], //право

                    x: 0,
                    y: 0
                },
                frame: [1, 0],
                startrotate: [[45, 45], [45, 45]],
                rotate: 0
            },
            right: {
                coordinate: {
                    offsetX: [this.width - 38, this.width - 36, this.width - 34, 
                        this.width - 32, this.width - 30, this.width - 30, this.width - 26],
                    offsetY: [15, 15, 15, 15, 15, 15, 15],
                    x: 0,
                    y: 0
                },
                frame: [0, 0],
                startrotate: [[45, 45], [45, 45]],
                rotate: 0
            }
        }
        this.hands.left.coordinate.x = this.hands.left.coordinate.offsetX[1][0];
        this.hands.left.coordinate.y = this.hands.left.coordinate.offsetY[0];
    }

    changeDirection(){ // -1 - лево, 1 - право
        this.hands.left.frame = this.orientation === 1? [1, 0]: [0, 1];
        this.hands.right.frame = this.orientation === 1? [0, 0]: [1, 1];
    }
    changeFrame(heroFrame){
        this.hands.left.coordinate.x = 
            this.hands.left.coordinate.offsetX[this.orientation === 1? 1: 0][heroFrame];
    }
}