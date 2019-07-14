
import * as modules from "./modules.js";
/* Класс, описывающий бонусы игры */
export default class Bonuses{
    constructor(){
        /*  
        this.useBonus1 = false;
        this.useBonus2 = false;
        this.useBonus3 = false;*/

        /* Бонус первого вида. О 1 раз выполняется ПО счётчику и потом деактивируется */
        document.getElementById("bonus1").onclick = () =>{
            /* Активирован первый бонус */
            //this.useBonus1 = !this.useBonus1 ? true : false;
            
            if (!document.getElementById("bonus1").classList.contains("active") && !document.getElementById("bonus1").classList.contains("deactivated")){
                /* Бонус не активен и готов к использованию */

                document.getElementById("bonus1").classList.add("active");  // отображаем бонус как активный
                this.timer(document.getElementById("bonus1").querySelector("span"), true, this.addHp, 1);   // по таймеру выполняем нужные действия
            }else{
                /* Бонус остановлен */
                
                document.getElementById("bonus1").classList.remove("active");
            }
        }

        /* Бонус второго вида. О 1 раз выполняется БЕЗ счётчика и потом деактивируется */
        document.getElementById("bonus2").onclick = () =>{
            
            //this.useBonus2 = !this.useBonus2 ? true : false;
            if (!document.getElementById("bonus2").classList.contains("active") && !document.getElementById("bonus2").classList.contains("deactivated")){
                /* Бонус не активен и готов к использованию */

                this.addMana(40); // выполняем нужные дейсвтвия бонуса
                document.getElementById("bonus2").classList.add("deactivated"); // выполняем деактивируем бонус
            }
        }

        /* Бонус третьего вида. О много раз выполняется ПО счётчику */
        document.getElementById("bonus3").onclick = () =>{
            
           // this.useBonus3 = !this.useBonus3 ? true : false;
            if (!document.getElementById("bonus3").classList.contains("active") && !document.getElementById("bonus3").classList.contains("deactivated")){
                /* Бонус не активен и готов к использованию */

                document.getElementById("bonus3").classList.add("active"); // отображаем бонус как активный
                this.specialTimer(document.getElementById("bonus3").querySelector("span"), this.addSpeed, 10); // по таймеру второго вида выполняем нужные действия
            }else {
                /* Бонус остановлен */

                document.getElementById("bonus3").classList.remove("active");
            }
        }
    }

    /* 
        Таймер (первого вида).
        Он применяется, когда нужно выполнить бонус первого вида.

        elemTimer - объект, который хранит начальное время таймера (HTML object),
        isOneUse - флаг, указывающий на выполнение функции 1 раз (boolean),
        func - ссылка на нужную функцию, которая будет выполняться относительно таймера (function reference),
        addNum - число, которое принимает ссылка-функция "func" для увеличени/уменьшения значения
    */
    timer(elemTimer, isOneUse, func, addNum) {
        var oldTime = Number(elemTimer.innerText);  // запоминаем начальное время таймера, чтобы потом сбросить
        var time = Number(elemTimer.innerText);     // хранит обновлённое время таймера
        var timerUse = setTimeout(function run(){
            if (time - 0.1 <= 0){
                /* Таймер достиг 0.0 секунд */

                clearTimeout(timerUse); // останвливаем счётчик
                if(isOneUse){
                    /* Функция должна выполняться 1 раз */

                    elemTimer.parentElement.parentElement.classList.add("deactivated"); // декативируем её
                }else{
                    /* Функция должна выполняться несколько раз */

                    this.restoreTime(elemTimer, oldTime);   // сбрасываем счётчик
                }
                elemTimer.parentElement.parentElement.classList.remove("active"); // выключаем отображение активности бонуса
            }else{
                if (func){
                    /* Функция-ссылка была передана */
                    func(addNum);   // выпоняем эту фукнцию
                }
                time -= 0.1;                            // уменьшаем значение таймера на 0.1 секунду
                elemTimer.innerText = time.toFixed(1);  // отображаем только 1 цифру после запятой
                setTimeout(run.bind(this), 100);
            }
        }.bind(this), 100);
    }
    /* 
        Таймер (второго вида).
        Он применяется, когда нужно выполнить бонус третьего вида.

        elemTimer - объект, который хранит начальное время таймера (HTML object),
        func - ссылка на нужную функцию, которая будет выполняться относительно таймера (function reference),
        addNum - число, которое принимает ссылка-функция "func" для увеличени/уменьшения значения
    */
    specialTimer(elemTimer, func, addNum){
        var oldTime = Number(elemTimer.innerText);  // запоминаем начальное время таймера, чтобы потом сбросить
        var flagAdd = false;                        // флаг, которуй указывает, что функция-ссылка будет дейстовать 1 раз за всё время таймера 
        var time = Number(elemTimer.innerText);     // хранит обновлённое время таймера
        var timerUse = setTimeout(function run(){
            if (time - 0.1 <= 0){
                /* Таймер достиг 0.0 секунд */

                func(-addNum);                                                      // функция сбрасывает своё увеличение, которое произошло в начале таймера
                clearTimeout(timerUse);                                             // останвливаем счётчик
                this.restoreTime(elemTimer, oldTime);                               // сбрасываем счётчик
                elemTimer.parentElement.parentElement.classList.remove("active");   // выключаем отображение активности бонуса 
            }else{
                if (func && !flagAdd){
                    /* Функция-ссылка была передана и ещё не выполянялась */
                    flagAdd = true;
                    func(addNum);
                }
                time -= 0.1;                            // уменьшаем значение таймера на 0.1 секунду
                elemTimer.innerText = time.toFixed(1);  // отображаем только 1 цифру после запятой
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