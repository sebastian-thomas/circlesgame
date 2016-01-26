/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />
/// <reference path="circle.ts" />
/// <reference path="MenuState.ts" />
/// <reference path="GameState.ts" />
var Game = (function () {
    function Game() {
        var targetWidth = 480; // the width of the game we want
        var targetHeight = 720;
        var deviceRatio = (window.innerWidth / window.innerHeight);
        var newRatio = (targetHeight / targetWidth) * deviceRatio;
        this.newWidth = targetWidth * newRatio;
        this.newHeight = targetHeight;
        this.game = new Phaser.Game(this.newWidth, this.newHeight, Phaser.AUTO, '', { create: this.create });
    }
    Game.prototype.create = function () {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.stage.backgroundColor = '#000000';
        this.game.state.add("MenuState", MenuState, true);
        this.game.state.add("GameState", GameState, false);
    };
    return Game;
})();
window.onload = function () {
    var game = new Game();
};
