var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Bar = (function () {
    function Bar(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height, scene = _a.scene;
        this.nowAniIndex = 0;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.stage = scene;
        this.collide = 1;
        this.init();
    }
    Bar.prototype.init = function () {
        var shape = new egret.Shape();
        shape.cacheAsBitmap = true;
        // shape.graphics.beginFill(0x00ff00);
        shape.graphics.beginGradientFill(egret.GradientType.RADIAL, [0x00ff00, 0xff00ff], [.5, 1], [0.9, 0.3]);
        shape.graphics.drawRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, 5, 5);
        shape.graphics.endFill();
        shape.graphics.lineStyle(2, 0xffffff);
        shape.graphics.drawRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, 5, 5);
        this.stage.addChild(shape);
        this.shape = shape;
        this.shape.x = this.x;
        this.shape.y = this.y;
    };
    Bar.prototype.boom = function () {
        this.shape.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.lastTimer = egret.getTimer();
    };
    Bar.prototype.onEnterFrame = function (e) {
        var now = egret.getTimer();
        var pass = now - this.lastTimer;
        this.lastTimer = now;
        if (this.nowAniIndex > 1) {
            this.shape.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.destroy();
            return false;
        }
        this.shape.rotation += pass / 5;
        this.shape.scaleX = 1 - this.nowAniIndex;
        this.shape.scaleY = 1 - this.nowAniIndex;
        this.nowAniIndex += pass / 30 / 30;
    };
    Bar.prototype.destroy = function () {
        this.shape.parent.removeChild(this.shape);
        var index = this.stage.bars.indexOf(this);
        this.stage.bars.splice(index, 1);
    };
    return Bar;
}());
__reflect(Bar.prototype, "Bar");
//# sourceMappingURL=Bar.js.map