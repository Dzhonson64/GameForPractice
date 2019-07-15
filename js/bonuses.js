 
import * as modules from "./modules.js";
/* Класс, описывающий бонусы игры */
export default class Bonuses{
    constructor(){
        
        this.bonusesArr = [
            document.getElementById("bonus1").querySelector("span"),
            document.getElementById("bonus3").querySelector("span")
        ],
        this.isActives = [false,false];
        /* Бонус первого вида. О 1 раз выполняется ПО счётчику и потом деактивируется */
        document.getElementById("bonus1").onclick = () =>{
            /* Активирован первый бонус */
            if(modules.render.startStopGame){
                if (!document.getElementById("bonus1").classList.contains("active") && !document.getElementById("bonus1").classList.contains("deactivated")){
                    /* Бонус не активен и готов к использованию */
    
                    document.getElementById("bonus1").classList.add("active");  // отображаем бонус как активный
                    this.timer(0, true, this.addHp, 1);   // по таймеру выполняем нужные действия
                }else{
                    /* Бонус остановлен */
                    
                    document.getElementById("bonus1").classList.remove("active");
                }
            }
            
            
        }

        /* Бонус второго вида. О 1 раз выполняется БЕЗ счётчика и потом деактивируется */
        document.getElementById("bonus2").onclick = () =>{
            if(modules.render.startStopGame){
                if (!document.getElementById("bonus2").classList.contains("active") && !document.getElementById("bonus2").classList.contains("deactivated")){
                    /* Бонус не активен и готов к использованию */

                    this.addMana(40); // выполняем нужные дейсвтвия бонуса
                    document.getElementById("bonus2").classList.add("deactivated"); // выполняем деактивируем бонус
                }
            }
        }

        /* Бонус третьего вида. О много раз выполняется ПО счётчику */
        document.getElementById("bonus3").onclick = () =>{
            if(modules.render.startStopGame){
                if (!document.getElementById("bonus3").classList.contains("active") && !document.getElementById("bonus3").classList.contains("deactivated")){
                    /* Бонус не активен и готов к использованию */

                    document.getElementById("bonus3").classList.add("active"); // отображаем бонус как активный
                    this.specialTimer(1, this.addSpeed, 10); // по таймеру второго вида выполняем нужные действия
                }else {
                    /* Бонус остановлен */

                    document.getElementById("bonus3").classList.remove("active");
                }
            }
        }
    }

    /* 
        Таймер (первого вида).
        Он применяется, когда нужно выполнить бонус первого вида.

       numBonus - номер бонуса в массиве (Number),
        isOneUse - флаг, указывающий на выполнение функции 1 раз (boolean),
        func - ссылка на нужную функцию, которая будет выполняться относительно таймера (function reference),
        addNum - число, которое принимает ссылка-функция "func" для увеличени/уменьшения значения
    */
    timer(numBonus, isOneUse, func, addNum) {
        this.isActives[numBonus] = true;                            // поднимаем флаг, говоря что этот бонусу активен
        var oldTime = Number(this.bonusesArr[numBonus].innerText);  // запоминаем начальное время таймера, чтобы потом сбросить
        var time = Number(this.bonusesArr[numBonus].innerText);     // хранит обновлённое время таймера
        var timerUse = setTimeout(function run(){
            if (time - 0.1 <= 0 || !modules.render.startStopGame){
                /* Таймер достиг 0.0 секунд или игра остановлена*/

                clearTimeout(timerUse); // останвливаем счётчик
                if(modules.render.startStopGame){
                    /* Игра была ещё запущена */
                    this.isActives[numBonus] = false;               // опускаем флаг, говоря что этот бонусу неактивен
                    if(isOneUse){
                        /* Функция должна выполняться 1 раз */
    
                        this.bonusesArr[numBonus].parentElement.parentElement.classList.add("deactivated"); // декативируем её
                    }else{
                        /* Функция должна выполняться несколько раз */
    
                        this.restoreTime(elemTimer, oldTime);   // сбрасываем счётчик
                    }
                    this.bonusesArr[numBonus].parentElement.parentElement.classList.remove("active"); // выключаем отображение активности бонуса
                }
                
            }else{
                if (func){
                    /* Функция-ссылка была передана */
                    func(addNum);   // выпоняем эту фукнцию
                }
                time -= 0.1;                                            // уменьшаем значение таймера на 0.1 секунду
                this.bonusesArr[numBonus].innerText = time.toFixed(1);  // отображаем только 1 цифру после запятой
                setTimeout(run.bind(this), 100);
            }
        }.bind(this), 100);
    }
    /* 
        Таймер (второго вида).
        Он применяется, когда нужно выполнить бонус третьего вида.

        numBonus - номер бонуса в массиве (Number),
        func - ссылка на нужную функцию, которая будет выполняться относительно таймера (function reference),
        addNum - число, которое принимает ссылка-функция "func" для увеличени/уменьшения значения
    */
    specialTimer(numBonus, func, addNum){
        this.isActives[numBonus] = true;
        var oldTime = Number(this.bonusesArr[numBonus].innerText);  // запоминаем начальное время таймера, чтобы потом сбросить
        var flagAdd = false;                                        // флаг, которуй указывает, что функция-ссылка будет дейстовать 1 раз за всё время таймера 
        var time = Number(this.bonusesArr[numBonus].innerText);     // хранит обновлённое время таймера
        var timerUse = setTimeout(function run(){
            if (time - 0.1 <= 0 || !modules.render.startStopGame){
                /* Таймер достиг 0.0 секунд или игра была остановлена*/
                func(-addNum);                                                      // сбрасыаем значение, которое увеличивала функция-ссылка
                clearTimeout(timerUse);                                             // останвливаем счётчик
                if(modules.render.startStopGame){
                    /* Игра была ещё запущена */
                    this.isActives[numBonus] = false;                                                   // функция сбрасывает своё увеличение, которое произошло в начале таймера
                    this.restoreTime(this.bonusesArr[numBonus], oldTime);                               // сбрасываем счётчик
                    this.bonusesArr[numBonus].parentElement.parentElement.classList.remove("active");   // выключаем отображение активности бонуса 
                }
            }else{
                if (func && !flagAdd){
                    /* Функция-ссылка была передана и ещё не выполянялась */
                    flagAdd = true;
                    func(addNum);
                }
                time -= 0.1;                            // уменьшаем значение таймера на 0.1 секунду
                this.bonusesArr[numBonus].innerText = time.toFixed(1);  // отображаем только 1 цифру после запятой
                setTimeout(run.bind(this), 100);
            }
        }.bind(this), 100);
    }
    /* 
        Восстановление MP.
        
        dMana - значение на которое будет за 1 раз увеличиваться MP (Number)
    */
    addMana(dMana){
        if (modules.hero.mp + dMana > modules.hero.maxMp){
            /* При восстановление MP будет больше макс. значение MP */

            modules.hero.mp = modules.hero.maxMp;   // просто присваиваем макс. значение
        }else{
            modules.hero.mp += dMana; // увеличиваем значение MP
        }
        /* Делаем обновления отображения значение MP и длины динамич. полосы MP */
        modules.game.heroMp.innerText = modules.hero.mp;
        modules.game.heroMp.parentElement.style.width = String(modules.hero.mp / modules.hero.maxMp * 100) + "%";
    }

    /* 
        Восстановление HP.

        dHp - значение на которое будет за 1 раз увеличиваться dHp (Number)
    */
    addHp(dHp){
        if (modules.hero.hp + dHp  <= modules.hero.maxHp){
            /* Восстановление HP будет больше макс. значение HP */

            modules.hero.hp += dHp; // просто присваиваем макс. значение
        }else{
            modules.hero.hp = modules.hero.maxHp; // увеличиваем значение HP
        }
        
        /* Делаем обновления отображения значение MP и длины динамич. полосы MP */
        modules.game.heroHp.innerHTML = String(modules.hero.hp) + " HP";
        modules.game.heroHp.parentElement.style.width = String(modules.hero.hp / modules.hero.maxHp * 100) + "%";
    }

    /* Увеличение скорости на dx */
    addSpeed(dx){
        modules.hero.dx += dx;
    }
    /* 
        Сброс времени.

        elemTimer - элемент счётка (HTML object),
        time - значение, на которое нужно сбросит счётчик (Number)
    */
    restoreTime(elemTimer, time){
        elemTimer.innerText = time;
    }
}