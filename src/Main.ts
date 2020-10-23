class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public status:string;

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
            }
        })
        egret.lifecycle.onPause = () => {
            this.status = 'pause';
            egret.ticker.pause();
        }
        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    public stageW:number;
    public stageH:number;

    private async runGame() {
        // await this.loadResource()
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;
    physics:PhysicsManager;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 40);
        topMask.graphics.endFill();
        topMask.y = 0;
        this.addChild(topMask);

        this.addTop();
        this.buildStage();
        this.addBars();
        this.addPlayer();
        this.plane.touchEnabled = true;
        this.plane.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.physics.start();
        },this)
        this.physics = new PhysicsManager(this);
    }

    // 构建四边围栏
    private buildStage(){
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        //top
        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(stageW, 0);
        line.graphics.endFill();
        line.y = 40;
        this.addChild(line);
    }

    addTop(){
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let title = new egret.TextField();
        this.addChild(title);
        title.size = 24;
        title.textColor = 0xffffff;
        title.x = 20;
        title.y = 10;
        title.text = '打砖块';
    }

    plane:egret.Sprite;
    ball:egret.Shape;
    addPlayer(){
        this.plane = new PlayerPlane(this);
        this.addChild(this.plane);
        
        var ball:egret.Shape = new egret.Shape();
        ball.graphics.beginFill(0xff0000);
        ball.graphics.drawCircle(0, 0, 10);
        ball.graphics.endFill();
        ball.y = this.stageH - 115;
        ball.x = this.stageW/2;
        this.addChild(ball);
        this.ball = ball;

    }

    bars:Bar[];

    addBars(){
        const width = 100;
        const height = 40;
        const top = 50;
        const maxCol = Math.floor(this.stageW/width);
        const left = (this.stageW - width*maxCol)/2;
        const numbers = 20;
        this.bars = [];
        const maxRow = Math.ceil(numbers/maxCol);
        for(let i = 0;i<maxRow;i++){
            for(let j = 0;j<maxCol;j++){
                if((i*maxCol+j)>numbers){return}
                const x = j*width + left + width/2;
                const y = i*height + top + height/2;
                const bar:Bar = new Bar({x,y,width,height,scene:this});
                this.bars.push(bar);
            }
        }
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}