
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
    pipeArr:[],
    pipeLength:7,
    pipeLastIndex:6,
    score:0,
    // scoreArr:[],

    init:function(options){
        this.initData(options.el);
        this.animate();
        this.handle();
        if(sessionStorage.getItem('play')){
            this.start();
        }
    },

    initData:function(el){
       this.oGame = el;
       this.oPlayer = this.oGame.getElementsByClassName("player")[0];
       this.oStart = this.oGame.getElementsByClassName("start")[0];
       this.oScore = this.oGame.getElementsByClassName("score")[0];
       this.oMask = this.oGame.getElementsByClassName("mask")[0];
       this.oEnd = this.oGame.getElementsByClassName("end")[0];
       this.oFinalScore = this.oEnd.getElementsByClassName("final-score")[0];
       this.oRankList = this.oEnd.getElementsByClassName("rank-list")[0];
       this.oReStart = this.oEnd.getElementsByClassName("restart")[0];

       this.scoreArr = this.getScore();
    },

    animate:function(){
        var self = this;
        var count = 0;
        this.timer = setInterval(function(){
            self.skyMove();

            if(self.startFlag){
                self.playerDrop();
                self.pipeMove();
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
    playerDrop:function(){
        this.playerTop += ++this.playerStepY;
        this.oPlayer.style.top = this.playerTop + "px";
        this.judgeKnock();
        this.addScore();

    },

    /**
     * 背景图片的动画
     */
    skyMove:function(){
        this.skyPosition -= this.skyStep;
        this.oGame.style.backgroundPositionX = this.skyPosition + 'px';
    },

    /**
     * 柱子移动的动画
     */
    pipeMove:function(){
        for(var i = 0; i < this.pipeLength; i++){
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skyStep;

            if(x < -52){
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = lastPipeLeft + 300 + 'px';
                oDownPipe.style.left = lastPipeLeft + 300 +'px';
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;

                continue;
            }
            oUpPipe.style.left = x + 'px';
            oDownPipe.style.left = x + 'px';
        }
    },


    createPipeEle:function(x){
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 - 150 - upHeight;

        var oUpPipe = createEle("div",['pipe', 'pipe-up'],{
            height: upHeight + 'px',
            left: x +"px"
        });

        var oDownPipe = createEle("div",['pipe','pipe-down'],{
            height:downHeight + 'px',
            left: x +"px"
        })

        this.oGame.appendChild(oUpPipe);
        this.oGame.appendChild(oDownPipe);
        this.pipeArr.push({
            up:oUpPipe,
            down:oDownPipe,
            y:[upHeight, upHeight + 150]
        });
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
        this.judgePipe();
    },

    /**
     * 进行边界碰撞检测
     */
    judegeBoundary:function(){
        if(this.playerTop < this.minTop || this.playerTop > this.maxTop){
            this.failGame();
            
        }
    },

    /**
     * 柱子的碰撞检测
     */
    judgePipe:function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;

        var playerY = this.playerTop;
        if((pipeX <= 95 && pipeX >= 13) && (playerY <= pipeY[0] || playerY >= pipeY[1])){
            this.failGame();
        }
    },

    addScore:function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if(pipeX < 13){
            this.oScore.innerText = ++ this.score;
        }
    },

    setScore:function(){
        this.scoreArr.push({
            score:this.score,
            time:this.getDate()
        });

        this.scoreArr.sort(function(a,b){
            return b.score - a.score;
        });

        setLocal('score', this.scoreArr);
    },

    getScore:function(){
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr : [];
    },

    getDate:function(){
        var d = new Date();
        var year = d.getFullYear();
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDay());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());
        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
    },


    handle:function(){
        this.handleStart();
        this.handleClick();
        this.handleReStart();
    },

    /**
     * 点击开始游戏时的处理函数
     */
    handleStart:function(){
        var self = this;
        this.oStart.onclick = this.start.bind(this);
    },

    start:function(){
        this.startFlag = true;
        this.oStart.style.display = "none";
        this.oScore.style.display = "block";
        this.skyStep = 5;
        this.oPlayer.style.left = '80px';
        this.oPlayer.style.transition = "none";

        for(var i = 0; i < this.pipeLength; i++){
            this.createPipeEle(300 * (i + 1));//每对柱子相隔300px
        }
    },

    /**
     * 游戏开始之后点击游戏界面的处理函数
     */
    handleClick:function(){
        var self = this;
        this.oGame.onclick = function(e){
            var e = e || window.event;
            var target = e.target;
            if(!target.classList.contains('start')){
                self.playerStepY = -10;
            }
        }
    },

    handleReStart:function(){
        this.oReStart.onclick = function(){
            sessionStorage.setItem('play', true);
            window.location.reload();
        }
    },

    /**
     * 游戏失败函数
     */

    failGame:function(){
        clearInterval(this.timer);
        this.setScore();
        this.oMask.style.display = 'block';
        this.oEnd.style.display = "block";
        this.oPlayer.style.display = "none";
        this.oScore.style.display = "none";
        this.oFinalScore.innerText = this.score;
        this.renderRankList();
    },

    renderRankList:function(){
        var template = ``;
        var len = this.scoreArr.length > 8? 8 : this.scoreArr.length;
        for(var i = 0; i < len; i++){
            var degreeClass = '';
            switch(i){
                case 0:
                    degreeClass = "first";
                    break;
                case 1:
                    degreeClass = "second";
                    break;
                case 2:
                    degreeClass = "third";
            }



            template += `
            <li class="rank-item">
                    <span class="rank-degree ${degreeClass}">${i + 1}</span>
                    <span class="rank-score">${this.scoreArr[i].score}</span>
                    <span class="rank-time">${this.scoreArr[i].time}</span>
                </li>
            `;
        }
        this.oRankList.innerHTML = template;
    }
}