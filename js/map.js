import Images from "./images.js";
import * as modules from "./modules.js";

export default class Map{
    constructor(level){
        /* Здесь концепт отходит от привычной тайловой генерации, так что любые термины взяты для простоты. То есть это уникальный способ генерации. 
            Коллизия строится из ячеек, а они, в свою очередь, из тайлов 10х10 пикс.*/
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
                    ["0.10", "1*10", "0*150", "1*20"],
                    ["10.20", "1*30", "0*110", "1*50"],
                    ["20.120", "2*190"]
                ];   // массив заполнения карты
            
            break;

            case 2:
                
            break;
            default:

        }  

        /* Перевод в двоичный массив с размером 120х190 (для каждого тайла прописывем тип текстуры, по ним будем определять коллизии)*/
        this.mapcc = []; 
        this.mapCollision.forEach( (elem) => {
            let y1 = Number(elem[0].slice(0, elem[0].indexOf('.')));
            let y2 = Number(elem[0].slice(elem[0].indexOf('.') + 1));
            for(let i = y1; i <= y2; i++){
                this.mapcc.push([]);
                for(let x = 1, k = 0; x < elem.length; x++){
                    let x1 = Number(elem[x].slice(0, elem[x].indexOf("*"))),
                        x2 = Number(elem[x].slice(elem[x].indexOf("*") + 1));
                        k += x2;
                        for(let j = k; j < k + x2; j++){
                            this.mapcc[i].push(x1)
                        }   
                }
            }
        });
        // console.log(this.mapcc);
    }
}