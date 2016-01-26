/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />
/// <reference path="circle.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        var _this = this;
        _super.call(this);
        this.updateSprites = function () {
            for (var i = 0; i < _this.numOfCircles; ++i) {
                _this.circles[i].update();
            }
        };
        this.distanceBetween = function (objA, objB) {
            var dx = objA.sprite.body.x - objB.sprite.body.x;
            var dy = objA.sprite.body.y - objB.sprite.body.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            return dist;
        };
        this.accelerateToObject = function (objA, objB, speed) {
            if (typeof speed === 'undefined') {
                speed = 20;
            }
            var angle = Math.atan2(objB.sprite.y - objA.sprite.y, objB.sprite.x - objA.sprite.x);
            //objA.sprite.body.rotation = angle + this.game.math.degToRad(180); 
            objA.sprite.body.force.x = Math.cos(angle) * speed;
            objA.sprite.body.force.y = Math.sin(angle) * speed;
        };
        this.getMaxObjWidth = function () {
            //as the number of objects increases the size should be changed accordingly
            var totalArea = _this.newWidth * (_this.newHeight - 0.1 * _this.newHeight);
            var areaObj = totalArea / gameSettings.maxObjs;
            var maxWidth = Math.floor(Math.sqrt(areaObj));
            return maxWidth;
        };
        this.clearCircles = function () {
            for (var i = 0; i < _this.numOfCircles; ++i) {
                _this.circles[i].remove();
            }
            _this.circles.length = 0;
        };
        var targetWidth = 480; // the width of the game we want
        var targetHeight = 720;
        var deviceRatio = (window.innerWidth / window.innerHeight);
        var newRatio = (targetHeight / targetWidth) * deviceRatio;
        this.newWidth = targetWidth * newRatio;
        this.newHeight = targetHeight;
        //this.game = new Phaser.Game(this.newWidth,this.newHeight,Phaser.AUTO,'', {create : this.create, update : this.update});
        this.numOfCircles = 2;
        this.circles = [];
    }
    GameState.prototype.create = function () {
        this.initGame();
        this.game.time.events.loop(gameSettings.tColorUpdate, this.updateSprites, this);
    };
    GameState.prototype.initGame = function () {
        var radius = Math.floor(this.getMaxObjWidth() / 2);
        var c = -1;
        this.circles.length = 0;
        this.circles.push(new Circle(this.game, this.newWidth / 2, this.newHeight / 2, radius, (++c % colors.length)));
        for (var i = 1; i < this.numOfCircles; ++i) {
            this.circles.push(new Circle(this.game, Math.floor(Math.random() * this.newWidth), Math.floor(Math.random() * this.newHeight), radius, (++c % colors.length)));
        }
        for (var i = 0; i < this.numOfCircles; ++i) {
            this.circles[i].makeSprite();
            this.game.physics.p2.enable(this.circles[i].sprite);
            this.circles[i].sprite.body.collideWorldBounds = true;
            this.circles[i].sprite.body.setCircle(this.circles[i].radius);
        }
        //make the center object static so that all other objects come to it.
        this.circles[0].sprite.body.static = true;
    };
    GameState.prototype.update = function () {
        //see if all the circles have same color
        var colorToCheck = this.circles[0].colorIndex;
        var allSame = true;
        var speed;
        for (var i = 0; i < this.numOfCircles; ++i) {
            if (this.distanceBetween(this.circles[0], this.circles[i]) < 100) {
                speed = 300;
            }
            else {
                speed = 200;
            }
            this.accelerateToObject(this.circles[i], this.circles[0], speed);
            if (this.circles[i].colorIndex != colorToCheck) {
                allSame = false;
            }
        }
        if (allSame) {
            //level complete
            this.clearCircles();
            this.numOfCircles++;
            allSame = false;
            this.initGame();
        }
    };
    return GameState;
})(Phaser.State);
