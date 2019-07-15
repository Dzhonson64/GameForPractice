import * as modules from "./modules.js";
/* Класс с гравитацией. Создаём в удобном месте объект данного класса и запихиваем в конструктор 2 параметра: ссылку на объект, который будет подверен гравитации, 
    и опциональный параметр, который нужен для объектов, способных прыгать. */
export default class Gravity{
    constructor(gravobj, activity = -1){
        this.gravObj = gravobj; // Ссылка на объект с гравитацией
        this.activity = activity;
        this.kg = 1; // Небольшое ускорение при падении, чтобы не мозолить глаза. Физика падения не соответствует реальности, но, пока это незаменто, всё хорошо.
    }
    grav(){ // Функция отвечающая за гравитацию объекта
        // У объектов с гравитацией должен быть параметр coordinate, 
        // который является словарём с координатами объекта и массив с коллизией
        
       
        // Если снизу ничего нет
        
        if(this.activity.collisions[2] === 0){
            this.gravObj.coordinate.y += 10 * (this.kg >= 10 ? 1.5: 1); // Для шустроты, двигаются объекты 1 тайл за фрейм и умножаем на ускорение
            this.kg++;
            
        }else if(this.activity !== -1 && this.activity.jumpPress){ // Если у объекта есть активити и он в прыжке (случай прописан для персонажа)
            this.kg = 1;
            this.activity.upperPoint = false; // Делаем флаги верхней точки и прыжка ложными
            this.activity.jumpPress = false;
        }
    }
}