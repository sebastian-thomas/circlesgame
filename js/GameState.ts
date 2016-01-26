/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />
/// <reference path="circle.ts" />

class GameState extends Phaser.State {
    
    game : Phaser.Game;
    numOfCircles : number;
    circles : Circle[];
    newWidth : number;
    newHeight : number;
    
    constructor() {
        super();
        
        var targetWidth : number = 480; // the width of the game we want
        var targetHeight : number  = 720;
        var deviceRatio : number = (window.innerWidth/window.innerHeight);
        var newRatio : number = (targetHeight/targetWidth)*deviceRatio;

        this.newWidth = targetWidth*newRatio;
        this.newHeight = targetHeight;
        
        //this.game = new Phaser.Game(this.newWidth,this.newHeight,Phaser.AUTO,'', {create : this.create, update : this.update});
        this.numOfCircles = 2;
        this.circles = [];
    }
    
    create () {
       this.initGame();
       this.game.time.events.loop(gameSettings.tColorUpdate, this.updateSprites , this);
    }
    
    initGame (){
        var radius = Math.floor(this.getMaxObjWidth()/2);
        var c = -1;
        this.circles.length = 0;
        this.circles.push(new Circle(this.game,this.newWidth/2, this.newHeight/2, radius, (++c % colors.length)));
        for(var i=1; i < this.numOfCircles; ++i){
            this.circles.push(new Circle(
                this.game,
                Math.floor(Math.random() * this.newWidth),
                Math.floor(Math.random() * this.newHeight),
                radius,
                (++c % colors.length)
            ));
        }
        
        for(var i=0; i < this.numOfCircles; ++i){
            this.circles[i].makeSprite();
            this.game.physics.p2.enable(this.circles[i].sprite);
            this.circles[i].sprite.body.collideWorldBounds = true;
            this.circles[i].sprite.body.setCircle(this.circles[i].radius);
        }
        //make the center object static so that all other objects come to it.
        this.circles[0].sprite.body.static = true;
    }
    
    update () {
        //see if all the circles have same color
        var colorToCheck = this.circles[0].colorIndex;
        var allSame = true;
        var speed;
        for(var i=0; i < this.numOfCircles; ++i){
            if(this.distanceBetween(this.circles[0], this.circles[i]) < 100){
                speed = 300;
            }
            else{
                speed = 200;
            }
            this.accelerateToObject(this.circles[i], this.circles[0], speed);
            if(this.circles[i].colorIndex != colorToCheck){
                allSame = false;
            }
        }
        
        if(allSame){
            //level complete
            this.clearCircles();
            this.numOfCircles++;
            allSame = false;
            this.initGame();
        }
    }
    
    updateSprites = () => {
        for(var i =0; i < this.numOfCircles; ++i){
            this.circles[i].update();
        }
    }
    
    distanceBetween = (objA : Circle, objB : Circle) => {
        var dx = objA.sprite.body.x - objB.sprite.body.x;
        var dy = objA.sprite.body.y - objB.sprite.body.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        return dist;
    }
    
    accelerateToObject = (objA : Circle, objB : Circle, speed : number) => {
        if (typeof speed === 'undefined') { speed = 20; }
        var angle = Math.atan2(objB.sprite.y - objA.sprite.y, objB.sprite.x - objA.sprite.x);
        //objA.sprite.body.rotation = angle + this.game.math.degToRad(180); 
        objA.sprite.body.force.x = Math.cos(angle) * speed;
        objA.sprite.body.force.y = Math.sin(angle) * speed;
    }
    
    getMaxObjWidth = () => {
        //as the number of objects increases the size should be changed accordingly
        var totalArea = this.newWidth * (this.newHeight - 0.1*this.newHeight);
        var areaObj = totalArea / gameSettings.maxObjs;
        var maxWidth = Math.floor(Math.sqrt(areaObj));
        return maxWidth;
    }
    
    clearCircles = () => {
        for(var i=0; i < this.numOfCircles; ++i){
            this.circles[i].remove();
        }
        this.circles.length = 0;
    }
}

