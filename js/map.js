import Images from "./images.js";
import * as modules from "./modules.js";

export default class Map{
    constructor(level){
        /* Здесь концепт отходит от привычной тайловой генерации, так что любые термины взяты для простоты. То есть это уникальный способ генерации. 
            Коллизия строится из ячеек, а они, в свою очередь, из тайлов 10х10 пикс.
        */
        switch (level){
            case 1:
                // Первый уровень
                /*
                    Пусть 190х120 - размер карты в тайлах, размеры которых 10х10. ["0.3", "0*190"] - шифр для сжатия данных о заполнении карты. Первый элемент - координаты строк, 
                    с которой начинается заполнение ячеек и по которую идёт заполнение включительно (также разность этих чисел даёт высоту). Второй элемент и далее - это ячейка, 
                    где первая цифра - тип текстуры, а вторая - ширина ячейки в тайлахю
                    То есть, в данном примере, мы получим ячейку с высотой равной 3 тайла (т. к. 3 - 0) и шириной 190 тайлов. Тип текстуры полученной ячейки равен 0, что обозначает пустоту.
                    
                    П. С.: Массив заполнения карты mapCollision - это двумерный массив с шифрами для заполнения карты. То есть в одной единице этого двумерного массива, содержится массив с 
                    несколькими шифрами, которые заполнаяют местность по всей ширине карты
                        Пример:
                            this.mapCollision = [
                                ["0.120", "1*5", "0*180", "1*5"] - получили карту с 2 колоннами по краям карты
                            ]

                */
                this.heightInTile = modules.game.height / 10; // Высота карты в тайлах
                this.widthInTile = 190; // Ширина карты в тайлах 
                this.tileType = [new Images("../img/road_forest.png"), new Images("../img/road.png")]; // Текстуры для кодов (подаётся код и вычитаем из него 1, чтобы получить текстуру)
                this.mapCollision = [
                    ["0.10", "1*10", "0*55", "1*40", "0*55", "1*30"],
                    ["10.30", "1*10", "0*130", "1*50"],
                    ["30.40", "2*190"] // 40
                ];   // массив заполнения карты
            
            break;

            case 2:
                
            break;
            default:

        }  
    }

/*
    doesOnVoid(elx, ely){ // Функция, которая определяет стоит ли персонаж на пустом тайле
        this.void = 1;
        // console.log(elx, ely);
        this.mapCollision.forEach((elem) => {
            let y1 = Number(elem[0].slice(0, elem[0].indexOf('.')));
            let y2 = Number(elem[0].slice(elem[0].indexOf('.') + 1));
            if(ely >= y1 && ely <= y2){
                for(let x = 1, k = 0; x < elem.length; x++){
                    let x1 = Number(elem[x].slice(0, elem[x].indexOf("*"))),
                        x2 = Number(elem[x].slice(elem[x].indexOf("*") + 1));
                    if(elx >= k && elx <= k + x2){
                        if(x1 === 0){
                            this.void = 1;
                            break;
                        }else{
                            this.void = 0;
                            break;
                        }
                    }
                    k += x2;
                }
            }
        });
        return Boolean(this.void);
    }*/


    collisWithObj(elx, ely, w, h){
        // console.log('col', elx, ely, w, h);
        elx = Math.floor(elx);
        ely = Math.floor(ely);
        w = Math.floor(w);
        h = Math.floor(h);
        this.void = 1;
        // console.log('col', elx, ely, elx + w, ely + h);
        this.collWith = [0, 0, 0, 0];   // 0 Верх, 1 право, 2 низ, 3 лево
        this.mapCollision.forEach((elem) => {
            let y1 = Number(elem[0].slice(0, elem[0].indexOf('.')));
            let y2 = Number(elem[0].slice(elem[0].indexOf('.') + 1));
            if(ely + h >= y1 && ely + h <= y2 || ely >= y1 && ely <= y2){
                for(let y = y1, up = ely >= y1 && ely <= y2, down = (ely + h >= y1 && ely + h <= y2) && !up; y <= y2; y++){
                    // console.log('col down', down, y1, y2, up);
                    for(let x = 1, k = 0; x < elem.length; x++){
                        let x1 = Number(elem[x].slice(0, elem[x].indexOf("*"))),
                            x2 = Number(elem[x].slice(elem[x].indexOf("*") + 1));
                        if(elx >= k && elx <= k + x2 || elx + w >= k && elx + w <= k + x2){
                            if(x1 !== 0){
                                // console.log('col', y, y2, up)
                                // if(down && y == y1) this.collWith[2] = x1;
                                // if(up && y == y2) {this.collWith[0] = x1;}else if(down && y == y1) this.collWith[2] = x1;
                                // console.log('col y', elx, k + x2);

                                if(up && y == y2 && elx + 1 !== k + x2 && elx + w -1 !== k) this.collWith[0] = x1;
                                else if(down && y == y1 && elx + 1 !== k + x2 && elx + w - 1 !== k) this.collWith[2] = x1;

                                if(elx > k && elx < k + x2 && !down && y != y1) {
                                    // console.log('col k', (k + x2) / 2 >= elx, (k + x2) / 2, elx, k);
                                    this.collWith[3] = x1;
                                }

                                if(elx + w > k && elx + w < k + x2 && !down && y != y1) {
                                    // console.log('col k', (k + x2) / 2 < elx + w, (k + x2) / 2, elx, k);
                                    this.collWith[1] = x1;
                                }
                                break;
                            }
                        }
                        k += x2;
                    }
                }
            }
            
        });
        // console.log('col end');
        return this.collWith;
    }

    /*
    doesOnBlock(elx, ely, obj){ // Блоком будем считать любую ячейку, которая зарисована не 0 и не последняя такая в строке
        this.block = -1;
        // console.log(elx, ely);
        this.mapCollision.forEach((elem) => {
            let y1 = Number(elem[0].slice(0, elem[0].indexOf('.')));
            let y2 = Number(elem[0].slice(elem[0].indexOf('.') + 1));
            if(ely >= y1 && ely <= y2){
                for(let x = 1, k = 0; x < elem.length; x++){
                    let x1 = Number(elem[x].slice(0, elem[x].indexOf("*"))),
                        x2 = Number(elem[x].slice(elem[x].indexOf("*") + 1));
                    if(elx >= k && elx <= k + x2){
                        if(x1 === 0){
                            this.void = 1;
                            break;
                        }else{
                            this.void = 0;
                            break;
                        }
                    }
                    k += x2;
                }
            }
        });
        return Boolean(this.void);
    }*/

}