var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PlayerPlane = (function (_super) {
    __extends(PlayerPlane, _super);
    function PlayerPlane(scene) {
        var _this = _super.call(this) || this;
        _this.scene = scene;
        _this.init();
        _this.initEvents();
        return _this;
    }
    PlayerPlane.prototype.init = function () {
        var shape = this;
        shape.graphics.lineStyle(5, 0xffffff);
        shape.graphics.moveTo(0, 0);
        shape.graphics.beginFill(0xf0f0f0);
        shape.graphics.lineTo(100, 0);
        shape.graphics.lineTo(50, 50);
        shape.graphics.lineTo(0, 0);
        shape.graphics.endFill();
        shape.y = this.scene.stageH - 100;
        shape.x = this.scene.stageW / 2 - 100 / 2;
    };
    PlayerPlane.prototype.initEvents = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.addEventListener(egret.Event.REMOVED, this.destroy, this);
    };
    PlayerPlane.prototype.startMove = function (e) {
        var stageX = e.stageX;
        this.startX = this.x;
        this.ballX = this.scene.ball.x;
        this.startTouchX = stageX;
        // 尼玛，还有上下文上的stage，这鬼知道啊
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
    };
    PlayerPlane.prototype.move = function (e) {
        var stageX = e.stageX;
        var sub = stageX - this.startTouchX;
        var newX = this.startX + sub;
        if (newX > 0 && newX < (this.scene.stageW - this.width)) {
            this.x = newX;
            if (this.scene.physics.status === 'idle') {
                this.scene.ball.x = this.ballX + sub;
            }
        }
    };
    PlayerPlane.prototype.onEnd = function () {
        this.startX = 0;
        this.ballX = 0;
        this.startTouchX = 0;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
    };
    PlayerPlane.prototype.destroy = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
        this.removeEventListener(egret.Event.REMOVED, this.destroy, this);
    };
    return PlayerPlane;
}(egret.Sprite));
__reflect(PlayerPlane.prototype, "PlayerPlane");
//# sourceMappingURL=PlayerPlane.js.map