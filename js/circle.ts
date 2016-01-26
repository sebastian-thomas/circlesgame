/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />

class Circle {
    game : Phaser.Game
    x : number;
    y : number;
    radius : number;
    colorIndex : number;
    shape : Shape;
    sprite : Phaser.Sprite;
    touched : boolean;
    upCount : number;
    bmd : Phaser.BitmapData
    
    
    constructor (game :Phaser.Game, x : number, y : number, radius : number, colorIndex : number) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colorIndex = colorIndex;
        
        this.shape = Shape.Circle;
        this.touched = false;
        this.upCount = 0;
    }
    
    makeSprite = () => {
        this.bmd = this.game.add.bitmapData(this.radius*2, this.radius*2);
        this.bmd.circle(this.radius, this.radius, this.radius, colors[this.colorIndex]);
        
        this.sprite = this.game.add.sprite(this.x, this.y, this.bmd);
        //this.sprite.alpha = 0;
        this.game.add.tween(this.sprite).to({alpha:1}, 2000,"Linear",true);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clicked, this);
    }
    
    clicked = () => {
        this.touched = true;
        this.upCount = 0;
        this.colorIndex = (this.colorIndex + 1) % colors.length;
        this.update();
    }
    
    update = () => {
        if(this.touched){
            this.upCount++;
            if(this.upCount > (gameSettings.tChange * 1000)/gameSettings.tColorUpdate){
                this.clicked();
            }
            else{
                var sectorAngle = ((this.upCount*gameSettings.tColorUpdate)/gameSettings.tChange)*0.360;
                this.bmd.clear();
                this.bmd.circle(this.radius, this.radius, this.radius, colors[this.colorIndex]);
                this.bmd.context.beginPath();
                this.bmd.context.strokeStyle = '#000000';
                this.bmd.context.fillStyle = colors[(this.colorIndex+1)%colors.length];
                this.bmd.context.moveTo(this.radius,this.radius);
                this.bmd.context.arc(this.radius,this.radius,this.radius,0,this.toRadians(sectorAngle));
                this.bmd.context.lineTo(this.radius,this.radius);
                this.bmd.context.fill();
                this.bmd.circle(this.radius, this.radius, this.radius - this.radius/10, colors[this.colorIndex]);
                this.sprite.loadTexture(this.bmd);
            }
        }
    }
    
    remove = () =>{
        this.sprite.destroy();
    }
    
    toRadians = (deg : number) => {
        return deg * Math.PI / 180;
    }
}