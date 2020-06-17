
var game = {
    skyPosition:0,//背景图片的位置
    skyStep:2,//背景图片移动的速度
    startColor:"blue",//开始游戏按钮的颜色
    startFlag:false,//游戏是否开始的状态，false为游戏未开始
    count:0,
    state:true,//用于判断翅膀扇动的状态
    playerTop:220,
    minTop:0,
    maxTop:570,
    playerStepY:0,

    init:function(options){
        this.initData(options.el);
        this.animate();
        this.handle();
    },

    initData:function(el){
       this.oGame = el;
       this.oPlayer = this.oGame.getElementsByClassName("player")[0];
       this.oStart = this.oGame.getElementsByClassName("start")[0];
       this.oScore = this.oGame.getElementsByClassName("score")[0];
       this.oMask = this.oGame.getElementsByClassName("mask")[0];
       this.oEnd = this.oGame.getElementsByClassName("end")[0];
    },

    animate:function(){
        var self = this;
        var count = 0;
        this.timer = setInterval(function(){
            self.skyMove();

            if(self.startFlag){
                self.playDrop();
                self.judgeKnock();
            }
            if(++count % 10 == 0){
                if(!self.startFlag){
                    self.startBound();
                    self.playerJump();
                }
                self.playerFly();
            }
        },30)
    },
    
    /**
     * 小鸟扇动翅膀的动画
     */
    playerFly:function(){
        if(this.state){ 
            this.count++;
            if(this.count===2){
                this.state = false;
            }
        }else{
            this.count--;
            if(this.count===0){
                this.state = true;
            }
        }
        this.oPlayer.style.backgroundPositionX = this.count % 3 * -30 + 'px';

    },

    /**
     * 小鸟跳动的动画
     */
    playerJump:function(){
        this.playerTop = this.playerTop === 220 ? 260 :220;
        this.oPlayer.style.top = this.playerTop + 'px';
    },

    /**
     * 小鸟下降的动画
     */
    playDrop:function(){
        this.playerTop += ++this.playerStepY;
        this.oPlayer.style.top = this.playerTop + "px";
    },

    /**
     * 背景图片的动画
     */
    skyMove:function(){
        this.skyPosition -= this.skyStep;
        this.oGame.style.backgroundPositionX = this.skyPosition + 'px';
    },

    /**
     * 开始游戏按钮的动画
     */
    startBound:function(){
        var prevColor = this.startColor;
        this.startColor = prevColor ==="blue"? "white": "blue";
        this.oStart.classList.remove("start-" + prevColor);
        this.oStart.classList.add("start-" + this.startColor);
    },

    judgeKnock:function(){
        this.judegeBoundary();
        
    },

    /**
     * 进行边界碰撞检测
     */
    judegeBoundary:function(){
        if(this.playerTop < this.minTop || this.playerTop > this.maxTop){
            this.failGame();
            
        }
    },

    handle:function(){
        this.handleStart();
        
    },

    handleStart:function(){
        var self = this;
        this.oStart.onclick = function(){
            self.startFlag = true;
            self.oStart.style.display = "none";
            self.oScore.style.display = "block";
            self.skyStep = 5;
            self.oPlayer.style.left = '80px';
        }
    },

    /**
     * 游戏失败函数
     */

    failGame:function(){
        clearInterval(this.timer);
        this.oMask.style.display = 'block';
        this.oEnd.style.display = "block";
        this.oPlayer.style.display = "none";
        this.oScore.style.display = "none";
    }
}