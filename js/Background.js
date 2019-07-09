import * as modules from "./modules.js";
import Images from "./images.js";
export default class Background{
    constructor(){
        this.bgImg = new Images("../img/test-fon.jpg");
        this.totalSeconds = 0;
        this.numImages;
        this.start = true;
    }
    draw(delta){
        this.numImages = Math.ceil(this.bgImg.image.width / modules.game.canvasField.width);
        console.log(this.numImages);
        this.totalSeconds += delta;
        
        /*console.log("Type 'delta' - ", typeof(delta));
        console.log("Type 'totalSeconds' - ", typeof(this.totalSeconds));
        console.log(delta, this.totalSeconds);*/
        var speed = 100;
        var xpos = this.totalSeconds * speed % this.bgImg.image.width;
        //modules.game.ctx.save();
        modules.game.ctx.translate(-xpos, 0);
        if (this.start){
            for (var i = 0; i < this.numImages; i++) {
                modules.game.ctx.drawImage(this.bgImg.image, i * this.bgImg.image.width, 0);
            }
        }
        
        modules.game.ctx.restore();
    }
}