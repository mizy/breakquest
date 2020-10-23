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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var PhysicsManager = (function (_super) {
    __extends(PhysicsManager, _super);
    function PhysicsManager(scene) {
        var _this = _super.call(this) || this;
        _this.speed = 0.5;
        _this.verticalSpeed = 0.2; //每帧垂直方向下落0.2像素
        // 当前重力方向移动状态
        _this.moveStatus = -1;
        _this.status = 'idle';
        _this.scene = scene;
        _this.init();
        return _this;
    }
    PhysicsManager.prototype.init = function () {
    };
    PhysicsManager.prototype.start = function () {
        var _a = this.scene, plane = _a.plane, ball = _a.ball;
        var x = ball.x, y = ball.y;
        this.pos = {
            startX: x,
            startY: y,
            vector: [0, -1]
        };
        this.time = egret.getTimer();
        egret.startTick(this.move, this);
        this.status = 'running';
    };
    PhysicsManager.prototype.stop = function () {
        egret.stopTick(this.move, this);
        var stopEvent = new egret.Event("stop");
        this.dispatchEvent(stopEvent);
        this.status = 'idle';
    };
    PhysicsManager.prototype.move = function (timeStamp) {
        // 最低30帧的时间
        var duration = Math.min(30, timeStamp - this.time); //1000/60
        this.time = timeStamp;
        var _a = this.scene, bars = _a.bars, ball = _a.ball;
        var points;
        var r = ball.width / 2;
        // 计算下一帧
        this.pos.startX = this.pos.startX + this.pos.vector[0] * this.speed * duration;
        this.pos.startY = this.pos.startY + this.pos.vector[1] * this.speed * duration;
        // 球出去的情况
        if (this.pos.startY > this.scene.stageH) {
            ;
            this.stop();
            return false;
        }
        if (!points) {
            points = this.checkBorder(r);
            this.collideObj = 'border';
        }
        if (!points) {
            points = this.checkBar(r);
            this.collideObj = 'plane';
        }
        if (!points) {
            for (var i = 0; i < bars.length; i++) {
                points = this.checkForce(bars[i], r);
                if (points) {
                    break;
                }
            }
            this.collideObj = 'object';
        }
        //有交点，计算交点矢量法向量和在速度矢量方向的投影
        // 对角平分线求
        //然后得到反弹的矢量
        //     /| c
        //    / |
        // o----|-b responseForce=>responseForce0 取得等腰三角形的高
        //    \ |
        //     \| a
        if (points) {
            var finalX = 0;
            var finalY = 0;
            for (var i = 0; i < points.length; i += 2) {
                finalX += points[i];
                finalY += points[i + 1];
            }
            points = [finalX / points.length * 2, finalY / points.length * 2];
            // 反弹方向是对反弹力的对称方向
            var responseForce = util.normalize([this.pos.startX - points[0], this.pos.startY - points[1]]);
            var ao = util.normalize(this.pos.vector);
            var oa = [-ao[0], -ao[1]];
            // 两个方向的cos值
            var cosVal = util.dot(responseForce, oa);
            var ob = [cosVal * responseForce[0], cosVal * responseForce[1]];
            var ab = util.addVector(ao, ob);
            var ac = util.multiplyFloat(ab, 2);
            var oc = util.subVector(ac, ao);
            var oc_n = util.normalize(oc);
            var oldVector = __assign({}, this.pos.vector);
            this.pos.vector = oc_n;
            // 下落给个额外的重力分量
            // if(Math.abs(this.pos.vector[1])<1){
            // 	this.pos.startY += this.verticalSpeed*duration;
            // }
            this.pos.startX = this.scene.ball.x + this.pos.vector[0] * this.speed * duration;
            this.pos.startY = this.scene.ball.y + this.pos.vector[1] * this.speed * duration;
        }
        this.scene.ball.x = this.pos.startX;
        this.scene.ball.y = this.pos.startY;
        return false;
    };
    PhysicsManager.prototype.checkBorder = function (r) {
        // 当前帧是否有交点
        var x1 = this.pos.startX;
        var y1 = this.pos.startY;
        var points = [];
        // 检查4个边界
        if (x1 + r > this.scene.stageW) {
            points = [this.scene.stageW, y1];
        }
        if (x1 - r < 0) {
            points = [0, y1];
        }
        if (y1 - r < 0) {
            points = [x1, 0];
        }
        if (y1 + r > this.scene.stageH) {
            return [x1, this.scene.stageH];
        }
        if (points.length) {
            return points;
        }
    };
    PhysicsManager.prototype.checkBar = function (r) {
        // 当前帧是否有交点
        var x1 = this.pos.startX;
        var y1 = this.pos.startY;
        var plane = this.scene.plane;
        var x = plane.x, y = plane.y, width = plane.width;
        var r2 = r * r;
        // 依然求球和线段的交点
        var innerValue = r2 - Math.pow((y - y1), 2);
        if (innerValue) {
            var rightX = x + width;
            var leftX = x;
            var center = x + width / 2;
            var points = [];
            var absValue = Math.sqrt(innerValue);
            var result = [absValue + x1, x1 - absValue];
            var offset = x + width / 2;
            //焦点是否在矩形内
            if (result[0] < rightX && result[0] > leftX) {
                points.push(result[0], y);
            }
            if (result[1] < rightX && result[1] > leftX) {
                points.push(result[1], y);
            }
            if (points.length > 2) {
                var mid = [points[0] / 2 + points[2] / 2, points[1] / 2 + points[3] / 2];
                mid[0] -= (mid[0] - offset) / (width / 2) * r / 2; //偏移
                return mid;
            }
            if (points.length) {
                return points;
            }
        }
    };
    PhysicsManager.prototype.checkForce = function (bar, r) {
        // 当前帧是否有交点
        var x1 = this.pos.startX;
        var y1 = this.pos.startY;
        var width = bar.width, height = bar.height, offsetX = bar.x, offsetY = bar.y;
        var points = [];
        // 求矩形和球的焦点
        //(x-x1)^2 + (y-y1)^2=r^2
        //y = +_sqrt(r^2 - (x-x1)^2)+y1
        var r2 = r * r;
        // 下边线
        var bottomY = offsetY + height / 2;
        var topY = offsetY - height / 2;
        var leftX = offsetX - width / 2;
        var rightX = offsetX + width / 2;
        var innerValue = r2 - Math.pow((bottomY - y1), 2);
        if (innerValue) {
            var absValue = Math.sqrt(innerValue);
            var result = [absValue + x1, x1 - absValue];
            //焦点是否在矩形内
            if (result[0] < rightX && result[0] > leftX) {
                points.push(result[0], bottomY);
            }
            if (result[1] < rightX && result[1] > leftX) {
                points.push(result[1], bottomY);
            }
            if (points.length) {
                bar.boom();
                return points;
            }
        }
        // 上边线
        innerValue = r2 - Math.pow((topY - y1), 2);
        if (innerValue) {
            var absValue = Math.sqrt(innerValue);
            var result = [absValue + x1, x1 - absValue];
            //焦点是否在矩形内
            if (result[0] < rightX && result[0] > leftX) {
                points.push(result[0], topY);
            }
            if (result[1] < rightX && result[1] > leftX) {
                points.push(result[1], topY);
            }
            if (points.length) {
                bar.boom();
                return points;
            }
        }
        // 左边线
        innerValue = r2 - Math.pow((leftX - x1), 2);
        if (innerValue) {
            var absValue = Math.sqrt(innerValue);
            var result = [absValue + y1, y1 - absValue];
            //焦点是否在矩形内
            if (result[0] < bottomY && result[0] > topY) {
                points.push(leftX, result[0]);
            }
            if (result[1] < bottomY && result[1] > topY) {
                points.push(leftX, result[1]);
            }
            if (points.length) {
                bar.boom();
                return points;
            }
        }
        // 右边线
        innerValue = r2 - Math.pow((rightX - x1), 2);
        if (innerValue) {
            var absValue = Math.sqrt(innerValue);
            var result = [absValue + y1, y1 - absValue];
            //焦点是否在矩形内
            if (result[0] < bottomY && result[0] > topY) {
                points.push(rightX, result[0]);
            }
            if (result[1] < bottomY && result[1] > topY) {
                points.push(rightX, result[1]);
            }
            if (points.length) {
                bar.boom();
                return points;
            }
        }
    };
    PhysicsManager.prototype.getValue = function () {
    };
    return PhysicsManager;
}(egret.EventDispatcher));
__reflect(PhysicsManager.prototype, "PhysicsManager");
//# sourceMappingURL=PhysicsManager.js.map