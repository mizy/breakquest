class PlayerPlane extends egret.Sprite{
	scene:Main;
	public constructor(scene) {
		super();
		this.scene = scene;
		this.init();
		this.initEvents();
	}
	
	init(){
		let shape = this;
        shape.graphics.lineStyle(5, 0xffffff);
        shape.graphics.moveTo(0, 0);
        shape.graphics.beginFill(0xf0f0f0);
        shape.graphics.lineTo(100, 0);
        shape.graphics.lineTo(50,50);
        shape.graphics.lineTo(0,0);
        shape.graphics.endFill();
        shape.y = this.scene.stageH - 100;
        shape.x = this.scene.stageW/2 - 100/2;
	}

	initEvents(){
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.startMove,this)
		this.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
		this.addEventListener(egret.Event.REMOVED,this.destroy,this)
	}

	startX:number;// 块初始坐标
	ballX:number;// 球初始坐标
	startTouchX:number;
	startMove(e){
		const {stageX} = e;
		this.startX = this.x;
		this.ballX = this.scene.ball.x;
		this.startTouchX = stageX;
		// 尼玛，还有上下文上的stage，这鬼知道啊
		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.move,this)
	}

	move(e){
		const {stageX} = e;
		const sub = stageX - this.startTouchX;
		const newX = this.startX+sub;
		if(newX>0&&newX<(this.scene.stageW-this.width)){
			this.x = newX;
			if(this.scene.physics.status==='idle'){
				this.scene.ball.x =this.ballX+sub;
			}
		}
	}

	onEnd(){
		this.startX = 0;
		this.ballX = 0;
		this.startTouchX = 0;
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.move,this)
	}

	destroy(){
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.startMove,this)
		this.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
		this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this)
		this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.move,this)
		this.removeEventListener(egret.Event.REMOVED,this.destroy,this)
	}
}