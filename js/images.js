export default class Images{
    /* Класс, отвечающий за положение нужной картинки из спрайта */
    /*
        url - адрес спрайта (string)
    */
    constructor(url, maxImagesX = 1){
        this.image = new Image(); // создание объекта спрайта
        this.image.src = url;   // присваивание адреса
        

        /* Представим спрайт с картинками, как двумерный массив, где */
        this.frameX = 0;   // номер картинки по X из спрайта
        this.frameY = 0;   // номер картинки по Y из спрайта
        this.maxImagesX = maxImagesX;
    }
}