class Bar {
	width:number;
	height:number;
	x:number;
	y:number;
	stage:Main;
	shape:egret.Shape;
	collide:number;

	public constructor({x,y,width,height,scene}) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.stage = scene;
		this.collide = 1;
		this.init();
	}

	init(){
		const shape = new egret.Shape();
		shape.cacheAsBitmap = true;
        // shape.graphics.beginFill(0x00ff00);
        shape.graphics.beginGradientFill(egret.GradientType.RADIAL, [0x00ff00,0xff00ff],[.5,1],[0.9,0.3]);
		shape.graphics.drawRoundRect(-this.width/2, -this.height/2, this.width, this.height, 5, 5);
        shape.graphics.endFill();
		shape.graphics.lineStyle(2,0xffffff)
		shape.graphics.drawRoundRect(-this.width/2, -this.height/2, this.width, this.height, 5, 5);
		
        this.stage.addChild(shape);
		this.shape = shape;
		this.shape.x = this.x;
		this.shape.y = this.y;

	}

	nowAniIndex:number=0;
	lastTimer:number;//上一次调用时间戳
	boom(){
		this.shape.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
		this.lastTimer = egret.getTimer();
	}

	onEnterFrame(e:egret.Event){
		const now = egret.getTimer();
		const pass = now - this.lastTimer;
		this.lastTimer = now;
		if(this.nowAniIndex>1){
			this.shape.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
			this.destroy();
			return false;
		}
		this.shape.rotation += pass/5;
		this.shape.scaleX = 1 - this.nowAniIndex;
		this.shape.scaleY = 1 - this.nowAniIndex;
		this.nowAniIndex += pass/30/30;
	}

	destroy(){
		this.shape.parent.removeChild(this.shape);
		const index = this.stage.bars.indexOf(this);
		this.stage.bars.splice(index,1)
	}
}