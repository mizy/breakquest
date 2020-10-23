class PhysicsManager extends egret.EventDispatcher{
	scene:Main;
	speed=0.5;
	verticalSpeed = 0.2;//每帧垂直方向下落0.2像素
	time:number;//当前时间
	pos:{
		startX:number,
		startY:number,
		vector:number[]
	}
	public constructor(scene:Main) {
		super();
		this.scene = scene;
		this.init();
	}

	init(){

	}

	// 当前重力方向移动状态
	moveStatus:number = -1;
	collideObj:string;
	status:string = 'idle';

	start(){
		const {plane,ball} = this.scene;
		let {x,y} = ball;
		this.pos = {
			startX:x,
			startY:y,
			vector:[0,-1]
		}
		this.time = egret.getTimer();
		egret.startTick(this.move,this);
		this.status = 'running'
	}

	stop(){
		egret.stopTick(this.move,this);
		const stopEvent = new egret.Event("stop")
		this.dispatchEvent(stopEvent);
		this.status = 'idle'
	}

	move(timeStamp){
		// 最低30帧的时间
		let duration = Math.min(30,timeStamp - this.time);//1000/60
		this.time = timeStamp;
		const {bars,ball} = this.scene;

		let points;
		const r = ball.width/2;
		// 计算下一帧
		this.pos.startX = this.pos.startX + this.pos.vector[0]*this.speed*duration;
		this.pos.startY = this.pos.startY + this.pos.vector[1]*this.speed*duration;
		
		// 球出去的情况
		if(this.pos.startY>this.scene.stageH){;
			this.stop();
			return false;
		}
		if(!points){
			points = this.checkBorder(r);
			this.collideObj = 'border'
		}
		if(!points){
			points = this.checkBar(r);
			this.collideObj = 'plane'
		}
		if(!points){
			for(let i = 0;i<bars.length;i++){
				points  = this.checkForce(bars[i],r);
				if(points){
					break;
				}
			}
			this.collideObj = 'object'
		}
		
		//有交点，计算交点矢量法向量和在速度矢量方向的投影
		// 对角平分线求
		//然后得到反弹的矢量
		//     /| c
		//    / |
		// o----|-b responseForce=>responseForce0 取得等腰三角形的高
		//    \ |
		//     \| a
		if(points){
			let finalX = 0;let finalY = 0;
			for(let i = 0;i<points.length;i+=2){
				finalX+=points[i];
				finalY+=points[i+1]
			}
			points = [finalX/points.length*2,finalY/points.length*2];
			// 反弹方向是对反弹力的对称方向
			let responseForce = util.normalize([this.pos.startX-points[0],this.pos.startY-points[1]]);
			const ao = util.normalize(this.pos.vector);
			const oa = [-ao[0],-ao[1]];
			// 两个方向的cos值
			const cosVal = util.dot(responseForce,oa);
			const ob = [cosVal*responseForce[0],cosVal*responseForce[1]];
			const ab = util.addVector(ao,ob);
			const ac = util.multiplyFloat(ab,2);
			const oc = util.subVector(ac,ao);
			const oc_n = util.normalize(oc);
			const oldVector = {...this.pos.vector};
			this.pos.vector = oc_n;
			// 下落给个额外的重力分量
			// if(Math.abs(this.pos.vector[1])<1){
			// 	this.pos.startY += this.verticalSpeed*duration;
			// }
			this.pos.startX = this.scene.ball.x + this.pos.vector[0]*this.speed*duration;
			this.pos.startY = this.scene.ball.y + this.pos.vector[1]*this.speed*duration;
		}
		
		
		this.scene.ball.x = this.pos.startX;
		this.scene.ball.y = this.pos.startY;
		return false;
	}

	checkBorder(r){
		// 当前帧是否有交点
		const x1 = this.pos.startX;
		const y1 = this.pos.startY;
		let points = [];
		// 检查4个边界
		if(x1+r>this.scene.stageW){
			points = [this.scene.stageW,y1]
		}
		if(x1-r<0){
			points =  [0,y1]
		}
		if(y1-r<0){
			points =  [x1,0]
		}
		if(y1+r>this.scene.stageH){
			return [x1,this.scene.stageH]
		}
		if(points.length){
			return points;
		}
	}

	checkBar(r):number[]|void{
		// 当前帧是否有交点
		const x1 = this.pos.startX;
		const y1 = this.pos.startY;
		const {plane} = this.scene;
		const {x,y,width} = plane;
		let r2 = r*r;
		// 依然求球和线段的交点
		let innerValue = r2 - Math.pow((y - y1 ),2);
		if(innerValue){
			let rightX = x + width;
			let leftX = x;
			let center = x+width/2;
			let points = [];

			let absValue = Math.sqrt(innerValue);
			let result = [absValue+x1,x1-absValue];
			let offset = x + width/2;
			//焦点是否在矩形内
			if(result[0]<rightX&& result[0]>leftX){
				points.push(result[0],y)
			}
			if(result[1]<rightX&& result[1]>leftX){
				points.push(result[1],y)
			}
			if(points.length>2){
				const mid = [points[0]/2+points[2]/2,points[1]/2+points[3]/2];
				mid[0] -= (mid[0]-offset)/(width/2)*r/2;//偏移
				return mid;
			}
			if(points.length){
				return points;
			}
		}
	}

	checkForce(bar:Bar,r){
		// 当前帧是否有交点
		const x1 = this.pos.startX;
		const y1 = this.pos.startY;

		const {width,height,x:offsetX,y:offsetY} = bar;
		const points = []
		// 求矩形和球的焦点
		//(x-x1)^2 + (y-y1)^2=r^2
		//y = +_sqrt(r^2 - (x-x1)^2)+y1
		let r2 = r*r;
		// 下边线
		let bottomY = offsetY + height/2;
		let topY = offsetY - height/2;
		let leftX = offsetX - width/2;
		let rightX = offsetX + width/2;
		let innerValue = r2 - Math.pow((bottomY - y1 ),2);
		if(innerValue){// 是否有焦点
			let absValue = Math.sqrt(innerValue);
			let result = [absValue+x1,x1-absValue];
			//焦点是否在矩形内
			if(result[0]<rightX&& result[0]>leftX){
				points.push(result[0],bottomY)
			}
			if(result[1]<rightX&& result[1]>leftX){
				points.push(result[1],bottomY)
			}
			if(points.length){
				bar.boom();
				return points;
			}
		}
		// 上边线
		innerValue = r2 - Math.pow((topY - y1 ),2);
		if(innerValue){// 是否有焦点
			let absValue = Math.sqrt(innerValue);
			let result = [absValue+x1,x1-absValue];
			//焦点是否在矩形内
			if(result[0]<rightX&& result[0]>leftX){
				points.push(result[0],topY)
			}
			if(result[1]<rightX&& result[1]>leftX){
				points.push(result[1],topY)
			}
			if(points.length){
				bar.boom();
				return points;
			}
		}
		// 左边线
		innerValue = r2 - Math.pow((leftX - x1 ),2);
		if(innerValue){// 是否有焦点
			let absValue = Math.sqrt(innerValue);
			let result = [absValue+y1,y1-absValue];
			//焦点是否在矩形内
			if(result[0]<bottomY&& result[0]>topY){
				points.push(leftX,result[0])
			}
			if(result[1]<bottomY&& result[1]>topY){
				points.push(leftX,result[1])
			}
			if(points.length){
				bar.boom();
				return points;
			}
		}

		// 右边线
		innerValue = r2 - Math.pow((rightX - x1 ),2);
		if(innerValue){// 是否有焦点
			let absValue = Math.sqrt(innerValue);
			let result = [absValue+y1,y1-absValue];
			//焦点是否在矩形内
			if(result[0]<bottomY&& result[0]>topY){
				points.push(rightX,result[0])
			}
			if(result[1]<bottomY&& result[1]>topY){
				points.push(rightX,result[1])
			}
			if(points.length){
				bar.boom();
				return points;
			}
		}
		
	}

	getValue(){

	}
}