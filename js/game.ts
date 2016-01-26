/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />
/// <reference path="circle.ts" />
/// <reference path="MenuState.ts" />
/// <reference path="GameState.ts" />

class Game{
    game : Phaser.Game;
    newWidth : number;
    newHeight : number;
    
    constructor(){
        var targetWidth : number = 480; // the width of the game we want
        var targetHeight : number  = 720;
        var deviceRatio : number = (window.innerWidth/window.innerHeight);
        var newRatio : number = (targetHeight/targetWidth)*deviceRatio;

        this.newWidth = targetWidth*newRatio;
        this.newHeight = targetHeight;
        
        this.game = new Phaser.Game(this.newWidth,this.newHeight,Phaser.AUTO,'', {create : this.create});
    }
    
    create(){
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.stage.backgroundColor = '#000000';

        this.game.state.add("MenuState", MenuState, true);
        this.game.state.add("GameState", GameState, false);
    }
}

window.onload = () => {
    var game = new Game();
}