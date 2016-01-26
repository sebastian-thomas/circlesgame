/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />

class MenuState extends Phaser.State {
    
    game : Phaser.Game;
    playSprite : Phaser.Sprite;
    radius : number;
    newWidth : number;
    newHeight : number;
    
    constructor(){
        super();
        
        var targetWidth : number = 480; // the width of the game we want
        var targetHeight : number  = 720;
        var deviceRatio : number = (window.innerWidth/window.innerHeight);
        var newRatio : number = (targetHeight/targetWidth)*deviceRatio;

        this.newWidth = targetWidth*newRatio;
        this.newHeight = targetHeight;
        
        this.radius = this.newWidth/3;
    }
    
    create () {
        var bmd = this.game.add.bitmapData(this.radius*2, this.radius*2);
        bmd.circle(this.radius, this.radius, this.radius, "#EA4335");
        
        this.playSprite = this.game.add.sprite(this.newWidth/2 - this.radius, this.newHeight/2 - this.radius, bmd);
        //this.sprite.alpha = 0;
        //this.game.add.tween(this.playSprite).to({alpha:1}, 2000,"Linear",true);
        this.playSprite.inputEnabled = true;
        this.playSprite.events.onInputDown.add(this.clicked, this);
    }
    
    clicked (){
        this.game.state.start("GameState", true);
    }
}