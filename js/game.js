import * as modules from "./modules.js";
export default class Game{
    /* Основные настройки игры, поля и т.п. */

    /* 
        floor - координаты нижней границы перемещения (Number)
    */
    constructor(floor){
        this.canvasField = document.getElementById("canvas");
        this.ctx = this.canvasField.getContext("2d");
        
        /* Размеры игрового поля */
        this.width = 1000;
        this.height = 400;

        //this.widthMap = modules.backrg.backImg.image.width - 118;
       
        this.ceilingCoordinate = floor - 100;
        this.floorCoordinate = floor;
        
        /* Установка разморов игрового поля */
        this.canvasField.setAttribute("width", this.width + "px");
        this.canvasField.setAttribute("height", this.height + "px");

    
    }
}