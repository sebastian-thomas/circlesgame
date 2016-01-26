/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MenuState = (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        _super.call(this);
        var targetWidth = 480; // the width of the game we want
        var targetHeight = 720;
        var deviceRatio = (window.innerWidth / window.innerHeight);
        var newRatio = (targetHeight / targetWidth) * deviceRatio;
        this.newWidth = targetWidth * newRatio;
        this.newHeight = targetHeight;
        this.radius = this.newWidth / 3;
    }
    MenuState.prototype.create = function () {
        var bmd = this.game.add.bitmapData(this.radius * 2, this.radius * 2);
        bmd.circle(this.radius, this.radius, this.radius, "#EA4335");
        this.playSprite = this.game.add.sprite(this.newWidth / 2 - this.radius, this.newHeight / 2 - this.radius, bmd);
        //this.sprite.alpha = 0;
        //this.game.add.tween(this.playSprite).to({alpha:1}, 2000,"Linear",true);
        this.playSprite.inputEnabled = true;
        this.playSprite.events.onInputDown.add(this.clicked, this);
    };
    MenuState.prototype.clicked = function () {
        this.game.state.start("GameState", true);
    };
    return MenuState;
})(Phaser.State);
