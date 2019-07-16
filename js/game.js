import * as modules from "./modules.js";
export default class Game{
    /* Основные настройки игры, поля и т.п. */

    /* 
        floor - координаты нижней границы перемещения (Number)
    */
    constructor(floor){
        this.username;
        this.minutes;
        this.seconds;
        this.score;
        this.id; 
        this.statusHero = false; // флаг, указывающий на проигрыш (false) или выигрыш (true) героя
        


        this.canvasField = document.getElementById("canvas");
        this.ctx = this.canvasField.getContext("2d");
        this.heroHp = document.querySelector(".conditions .hp .fill span");
        this.heroMp = document.querySelector(".conditions .mp .fill span");
        
        /* Размеры игрового поля */
        this.width = 1000;
        this.height = 400;

        //this.widthMap = modules.backrg.backImg.image.width - 118;
       
        this.ceilingCoordinate = floor - 100;
        this.floorCoordinate = floor;
        
        /* Установка разморов игрового поля */
        this.canvasField.setAttribute("width", this.width + "px");
        this.canvasField.setAttribute("height", this.height + "px");

        /* Обработка ПАУЗЫ игры */
        document.getElementById("pause").addEventListener('click', (e) =>{
            /* Пауза при нажатии кнопки в браузере */
            this.pause();
        });
        document.addEventListener("keydown", (e) =>{
            /* Пауза при нажатии кнопки Escape */
            if (e.code == "Escape"){
                this.pause();
            }
        })
        document.getElementById("btnStart").addEventListener('click', (e) =>{
            /* Нажата кнопка "НАЧАТЬ" */

            this.username = $("#username").val();
            if(this.username){
                /* Ник был введён */

                /* 
                    База данных игроком образуется таким образов: отдельным объектов в LocalStorage хранится кол-во игроков,
                    при создании нового игрока кол-во переменная кол-ва игроков увелич. и это число прибаляется к всем 4 данным (score, username, minutes, seconds)
                */

                var oldCoutGamers = Number(localStorage['countGamers']); // берём из базы кол-во игроков

                if (!isNaN(oldCoutGamers)){
                    /* Переменная кол-ва игроков есть в базе */
                    if(!this.isUser(this.username)){
                        /* Такого ника нет */
                        localStorage['username' + oldCoutGamers] = this.username;       // запоминаем новый ник
                        localStorage['id' + oldCoutGamers] = oldCoutGamers;       // запоминаем новый ник
                        this.id = oldCoutGamers
                    }else{
                       this.id = this.getIdUser(this.username);
                    }
                    
                }else{
                    /* Переменной кол-ва игроков нет в базе */
                    localStorage['username' + 0] = this.username;       // запоминаем новый ник
                    localStorage['id' + 0] = 0;       // запоминаем новый ник
                    this.id = 0;
                }
                //var newCoutGamers = Number(localStorage['countGamers']) - 1;    // заново берём новое число кол-ва игроков и уменьшем на 1, т.к. так удобней обрабатывать данные
                
                
                document.getElementById("startScreen").style.display = "none";  // скрываем стартовое окно
                document.getElementById("game").style.display = "block";        // отображаем игру
    
                document.getElementById("nickInGame").querySelector("span").innerText = this.username;  // выводим ник в игре
                setTimeout(() =>{
                    this.pause();
                }, 50)
                
            }else{
                /* Ник не был введён */
                alert("Введите ник");
            }
            
        
        });

        /* Скрытие и отображние описания игры */
        $("#more").click(function(){ 
            $( "#contentDescript" ).slideToggle("slow"); 
            $("#more").text() == "показать" ? $("#more").text("скрыть") : $("#more").text("показать");
          });
        
    }
    pause(){
        /* Нажата кнопка воспроизведение/пауза */
                    
        if (modules.render.startStopGame){
            /* Игра была НЕ на паузе */
            

            /* Меняем кнопки воспроизведение/пауза */
            document.getElementById("pause").children[0].classList.remove("none");
            document.getElementById("pause").children[1].classList.add("none");

            modules.render.startStopGame = false;   // останаваливаем игровой процесс
        }else{
            /* Игра была на паузе */

            this.resume();  // возобновляем таёмеры
           
            modules.render.timerGame(); // возобновляем таймер игры

            /* Меняем кнопки воспроизведение/пауза */
            document.getElementById("pause").children[0].classList.add("none");
            document.getElementById("pause").children[1].classList.remove("none");

            modules.render.startStopGame = true;    // восстанавливаем игровой процесс
        }
    }
    /* Возобновление работы таймеров */
    resume(){
        for(let i = 0; i < 4; i++){ // пробегаемся по таймерам способностей
            if (modules.skills.isReloads[i]){
                /* Таймер был в запущенном виде до паузы */

                modules.skills.timer(i);    // возобновляемего
            }
        }
        for(let i = 0; i < 2; i++){ // пробегаемся по таймерам бонусов
            if(modules.bonuses.isActives[i] == true){
                /* Таймер был в запущенном виде до паузы */

                switch (i) {
                    /* Включаем соответсвующий таймер для бонуса */
                    case 0:
                        modules.bonuses.timer(i, true, modules.bonuses.addHp, 1);
                        break;
                    case 1:
                        modules.bonuses.specialTimer(i, modules.bonuses.addSpeed, 10);
                        break;
                    default:
                        break;
                }
            }
            
        }
    }
    /* Сортировка списка игроков в базе данных */
    bubleSort(){
        var countGamers = Number(localStorage["countGamers"]);  // узанём кол-во игроков в списке
        for (let i = countGamers - 1; i > 0; i--){
            for(let j = 0; j < i; j++){
                
                if(Number(localStorage["score" + j]) < Number(localStorage["score" + (j + 1)])){
                    /* счёт игрока j меньше счёта игрока j + 1 */

                    /* Делаем swap, сохраняя соответсвующие данные */
                    var tempScore = Number(localStorage["score" + j]);
                    var tempName = localStorage["username" + j];
                    var minutes = String(localStorage["minutes" + j]);
                    var seconds = String(localStorage["seconds" + j]);
                    var id = Number(localStorage["id" + j]);
                   
                    localStorage["score" + j] = Number(localStorage["score" + (j + 1)]);
                    localStorage["username" + j] = localStorage["username" + (j + 1)];
                    localStorage["minutes" + j] = Number(localStorage["minutes" + (j + 1)]);
                    localStorage["seconds" + j] = localStorage["seconds" + (j + 1)];
                    localStorage["id" + j] = Number(localStorage["id" + (j + 1)]);


                    localStorage["score" + (j + 1)] = tempScore;
                    localStorage["username" + (j + 1)] = tempName;
                    localStorage["minutes" + (j + 1)] = minutes;
                    localStorage["seconds" + (j + 1)] = seconds;
                    localStorage["id" + (j + 1)] = id;

                }else if(Number(localStorage["score" + j]) == Number(localStorage["score" + (j + 1)])){
                    /* счёт игрока j равен счёта игрока j + 1 */
                    
                    if(this.toSeconds(String(localStorage["minutes" + j]), String(localStorage["seconds" + j])) < this.toSeconds(String(localStorage["minutes" + (j+1)]), String(localStorage["seconds" + (j+1)]))){
                        /* Время игрока j меньше чем игрока j + 1 */

                        /* Делаем swap, сохраняя соответсвующие данные */
                        var tempScore = Number(localStorage["score" + j]);
                        var tempName = localStorage["username" + j];
                        var minutes = String(localStorage["minutes" + j]);
                        var seconds = String(localStorage["seconds" + j]);
                        var id = Number(localStorage["id" + j]);
                    
                        localStorage["score" + j] = Number(localStorage["score" + (j + 1)]);
                        localStorage["username" + j] = localStorage["username" + (j + 1)];
                        localStorage["minutes" + j] = Number(localStorage["minutes" + (j + 1)]);
                        localStorage["seconds" + j] = localStorage["seconds" + (j + 1)];
                        localStorage["id" + j] = Number(localStorage["id" + (j + 1)]);


                        localStorage["score" + (j + 1)] = tempScore;
                        localStorage["username" + (j + 1)] = tempName;
                        localStorage["minutes" + (j + 1)] = minutes;
                        localStorage["seconds" + (j + 1)] = seconds;
                        localStorage["id" + (j + 1)] = id;
                    }
                }
            }
        }
    }
    /* Заполненеи таблицы */
    fillTableScore(){
        var countGamers = Number(localStorage["countGamers"]);  // узнаём кол-во игроков в списке
        var isShowUserInTable = false;  // флаг отображения нужных данных до 10 позиции
        for (let i = 0; i < countGamers && i < 10; i++){
            /* Пробегаемся по всему списку */

            /* Запоминаем соответвующие данные из LocalStorage */
            var score = Number(localStorage["score" + i]);
            var name = localStorage["username" + i];
            var minutes = String(localStorage["minutes" + i]);
            var seconds = String(localStorage["seconds" + i]);
            if (name == this.username){
                isShowUserInTable = true;
            }
           
            if (i == 9 && !isShowUserInTable){
                /* Добавление на 10 позицию списка, если в остальных 9 позициях не было нужного ника*/
                $("#idGamers").append("<p>" + this.getIdUser(this.username) + "</p>");
                $("#timerGamers").append("<p>" + this.minutes + ":" + this.seconds + "</p>");
                $("#tableName").append("<p>" + this.username + "</p>");
                $("#tableScore").append("<p>" + this.score + "</p>");
            }else{
                /* Добавление в список, если эта не 9 позиция или 9 и нужный ник уже был отобраэён*/
                $("#idGamers").append("<p>" + (i + 1) + "</p>");
                $("#timerGamers").append("<p>" + minutes + ":" + seconds + "</p>");
                $("#tableName").append("<p>" + name + "</p>");
                $("#tableScore").append("<p>" + score + "</p>");
            }
        }
    }
    /* Перевод времени в секунды */
    toSeconds(min, sec){
        return Number(min)*60 + Number(sec);
    }
    /* Отобраение экрана КОНЦА ИГРЫ */
    deathScreen(){
    var oldCoutGamers = Number(localStorage['countGamers']); // берём из базы кол-во игроков
        if (!isNaN(oldCoutGamers)){
            /* Переменная кол-ва игроков есть в базе */
            if(!this.isUser(this.username)){
                /* Такого ника нет */
                localStorage['countGamers'] = oldCoutGamers + 1;    // увеличиваем на 1 кол-во игроков и запоминаем в базе
            }
            
        }else{
            /* Переменной кол-ва игроков нет в базе */
            localStorage['countGamers'] = 1;    // кол-во игроков ставим 1
        }

        /* Берём данные из игры */
        this.minutes =  document.getElementById("minutesTimer").innerText;
        this.seconds =  document.getElementById("secondTimer").innerText;
        this.score =  document.getElementById("score").innerText;

        document.getElementById("game").style.display = "none";         // скрываем поле с игрой
        document.getElementById("endScreen").style.display = "block";   // отображаем поле с концом игры

        /* Отображаем данные, которые в верхней части до таблицы */
        if(this.statusHero){
            document.getElementById("status").querySelector("span").innerText = "You WIN !!!";
        }else{
            document.getElementById("status").querySelector("span").innerText = "You've lost !!!";
        }
        
        document.getElementById("nickname").querySelector("span").innerText = this.username;
        document.getElementById("endScore").querySelector("span").innerText = this.score;

        /* Запоминаем данные в базу */
        localStorage["score" + this.id] = Number(this.score);
        localStorage["minutes" + this.id] = String(this.minutes);
        localStorage["seconds" + this.id] = String(this.seconds);
        this.bubleSort();       // делаем сортировку списка, относительно новых данных
        this.fillTableScore();  // делаем заполненеи и отображение списка игроков
        this.fillUserInTable();
    }
    /* Проверка на то, если ли такой ник уже в базе */
    isUser(user){
        var countGamers = Number(localStorage["countGamers"]);
        for (let i = 0; i < countGamers; i++){
            if(user == localStorage["username" + i]){
                return true;
            }
        }
        return false;
    }
    /* Получение id данных, относительно username */
    getIdUser(user){
        var countGamers = Number(localStorage["countGamers"]);
        for (let i = 0; i < countGamers; i++){
            if(user == localStorage["username" + i]){
                return i;
            }
        }
        return 0;
    }
   fillUserInTable(){
        var tempElemUser = $("#tableName").children().each(function(pos) {
            if($("#tableName").children()[pos].innerText == this.username){
                
                $("#tableName").children()[pos].classList.add("you");
                $("#idGamers").children()[pos].classList.add("you");
                $("#tableScore").children()[pos].classList.add("you");
                $("#timerGamers").children()[pos].classList.add("you");
            }else{
                $("#tableName").children()[pos].classList.remove("you");
                $("#idGamers").children()[pos].classList.remove("you");
                $("#tableScore").children()[pos].classList.remove("you");
                $("#timerGamers").children()[pos].classList.remove("you");
            }    
        }.bind(this));
    }
}