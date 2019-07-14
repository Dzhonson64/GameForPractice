 
import * as modules from "./modules.js";
/* Класс, описывающий бонусы игры */
export default class Bonuses{
    constructor(){
        this.bonus1 = false;
        this.bonus2 = false;
        document.getElementById("bonus1").onclick = () =>{
            this.bonus1 = !this.bonus1 ? true : false;
            if (!document.getElementById("bonus1").classList.contains("active")){
                document.getElementById("bonus1").classList.add("active");
            }else{
                document.getElementById("bonus1").classList.remove("active");
            }
        }
        document.getElementById("bonus2").onclick = () =>{
            this.bonus2 = !this.bonus2 ? true : false;
            if (!document.getElementById("bonus2").classList.contains("active")){
                document.getElementById("bonus2").classList.add("active");
            }else{
                document.getElementById("bonus2").classList.remove("active");
            }
        }
    }
}