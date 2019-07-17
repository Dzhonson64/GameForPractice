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
        this.intleftarm;
        this.hands = {
            img: new Images('../img/hands1.png', 4),
            width: 171 / 4,
            height: 91 / 2,
            shoot: 0,
            left: {
                coordinate: {

                    // смещение руки по х 
                    offsetX: [[this.width - 19, this.width - 17, this.width - 15, 
                        this.width - 13, this.width - 11, this.width - 11, this.width - 7],
                        // лево
                        
                        [this.width - 38, this.width - 36, this.width - 34, 
                        this.width - 32, this.width - 30, this.width - 30, this.width - 26]
                        //право
                    ],
                    
                    // смещение руки по у 
                    offsetY: [15, 15, 15, 15, 15, 15, 15],

                    // смещение якоря по х 
                    anchorX:[-4, // лево
                            -15], //право

                    // смещение якоря по у
                    anchorY:[-16,// лево
                            -12], //право

                    x: 0,
                    y: 0
                },
                frame: [1, 0],
                startrotate: [[0, 100], // лево: обычно, при стрельбе(не используется)
                            [55, 55]], // право: обычно, при стрельбе(не используется)
                rotate: 0
            },



            
            right: {
                coordinate: {

                    // смещение руки по х
                    offsetX: [[12, 14, 16, 
                            18, 20, 22, 22],
                        // лево
                        
                        [0, 2, 2, 
                            4, 6, 8, 10]
                        //право
                    ],

                    // смещение руки по у 
                    offsetY: [15, 15, 15, 15, 15, 15, 15],

                    // смещение якоря по х 
                    anchorX:[-21, // лево

                            -5], //право

                    // смещение якоря по у
                    anchorY:[-20,// лево
                            -12], //право
                    x: 0,
                    y: 0
                },
                frame: [0, 0],
                startrotate: [[120, 120], // лево: обычно, при стрельбе
                            [0, 55]],// право: обычно, при стрельбе
                rotate: 0
            }
        }

        // начальные положения рук
        this.hands.left.coordinate.x = this.hands.left.coordinate.offsetX[1][0];
        this.hands.left.coordinate.y = this.hands.left.coordinate.offsetY[0];
        this.hands.right.coordinate.x = this.hands.right.coordinate.offsetX[1][0];
        this.hands.right.coordinate.y = this.hands.right.coordinate.offsetY[0];
        this.hands.left.rotate = this.hands.left.startrotate[1][0];
        this.hands.right.rotate = this.hands.right.startrotate[1][0];
        // console.log(this.hands.right.startrotate[1][0], this.hands.right.rotate);
    }

    changeDirection(){ // -1 - лево, 1 - право
        if(this.orientation === 1){
            this.hands.right.rotate = this.hands.right.startrotate[1][0];
            this.hands.left.frame = [1, 0];
            this.hands.right.frame = [0, 0];
        }else{
            this.hands.left.rotate = this.hands.left.startrotate[0][0];
            this.hands.left.frame = [0, 1];
            this.hands.right.frame = [1, 1];
        }
    }
    changeFrame(heroFrame){
        this.hands.left.coordinate.x = 
            this.hands.left.coordinate.offsetX[this.orientation === 1? 1: 0][heroFrame];
        this.hands.right.coordinate.x = 
            this.hands.right.coordinate.offsetX[this.orientation === 1? 1: 0][heroFrame];
    }
    attack(){
        this.hands.shoot = 1;
        if(this.orientation === 1){
            this.hands.right.rotate = this.hands.left.rotate - this.hands.right.startrotate[1][0];
        }else{
            this.hands.left.rotate = this.hands.right.rotate - this.hands.left.startrotate[0][0];
        }
        this.intleftarm = setInterval(()=>{
            // console.log('int');
            if(this.orientation === 1){
                this.hands.right.rotate -= this.hands.left.rotate / 50;
            }else{
                this.hands.left.rotate += this.hands.right.rotate / 50;
            }
        }, 50);
        setTimeout(()=>{this.hands.shoot = 0;
            if(this.orientation === 1){
                this.hands.right.rotate = this.hands.right.startrotate[1][0];
            }else{
                this.hands.left.rotate = this.hands.left.startrotate[0][0];
            }
            // console.log('clearint');
            clearInterval(this.intleftarm);
            this.changeDirection()}, 1000)
    }
}