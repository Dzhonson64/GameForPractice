export default class OptionsGame{
    /* Основные настройки игры, поля и т.п. */

    constructor(){
        this.canvasField = document.getElementById("canvas");
        this.ctx = this.canvasField.getContext("2d");
        
        /* Размеры игрового поля */
        this.width = 1000;
        this.height = 720;

        /* Установка разморов игрового поля */
        this.canvasField.setAttribute("width", this.width + "px");
        this.canvasField.setAttribute("height", this.height + "px");
    }
}