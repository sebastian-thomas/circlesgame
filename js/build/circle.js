/// <reference path="phaser.d.ts" />
/// <reference path="settings.ts" />
var Circle = (function () {
    function Circle(game, x, y, radius, colorIndex) {
        var _this = this;
        this.makeSprite = function () {
            _this.bmd = _this.game.add.bitmapData(_this.radius * 2, _this.radius * 2);
            _this.bmd.circle(_this.radius, _this.radius, _this.radius, colors[_this.colorIndex]);
            _this.sprite = _this.game.add.sprite(_this.x, _this.y, _this.bmd);
            //this.sprite.alpha = 0;
            _this.game.add.tween(_this.sprite).to({ alpha: 1 }, 2000, "Linear", true);
            _this.sprite.inputEnabled = true;
            _this.sprite.events.onInputDown.add(_this.clicked, _this);
        };
        this.clicked = function () {
            _this.touched = true;
            _this.upCount = 0;
            _this.colorIndex = (_this.colorIndex + 1) % colors.length;
            _this.update();
        };
        this.update = function () {
            if (_this.touched) {
                _this.upCount++;
                if (_this.upCount > (gameSettings.tChange * 1000) / gameSettings.tColorUpdate) {
                    _this.clicked();
                }
                else {
                    var sectorAngle = ((_this.upCount * gameSettings.tColorUpdate) / gameSettings.tChange) * 0.360;
                    _this.bmd.clear();
                    _this.bmd.circle(_this.radius, _this.radius, _this.radius, colors[_this.colorIndex]);
                    _this.bmd.context.beginPath();
                    _this.bmd.context.strokeStyle = '#000000';
                    _this.bmd.context.fillStyle = colors[(_this.colorIndex + 1) % colors.length];
                    _this.bmd.context.moveTo(_this.radius, _this.radius);
                    _this.bmd.context.arc(_this.radius, _this.radius, _this.radius, 0, _this.toRadians(sectorAngle));
                    _this.bmd.context.lineTo(_this.radius, _this.radius);
                    _this.bmd.context.fill();
                    _this.bmd.circle(_this.radius, _this.radius, _this.radius - _this.radius / 10, colors[_this.colorIndex]);
                    _this.sprite.loadTexture(_this.bmd);
                }
            }
        };
        this.remove = function () {
            _this.sprite.destroy();
        };
        this.toRadians = function (deg) {
            return deg * Math.PI / 180;
        };
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colorIndex = colorIndex;
        this.shape = Shape.Circle;
        this.touched = false;
        this.upCount = 0;
    }
    return Circle;
})();
