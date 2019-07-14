import * as modules from "./modules.js";
/* Класс, описывающий способности игры */
export default class Skills{
    constructor(){
        
    }
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
        Сброс времени.

        elemTimer - элемент счётка (HTML object),
        time - значение, на которое нужно сбросит счётчик (Number)
    */
    restoreTime(elemTimer, time){
        elemTimer.innerText = time;
    }
}