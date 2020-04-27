var input = document.querySelector("input");
var startGame = document.querySelector("#startG");
var stopGame = document.querySelector("#stopG");
// 加载页面
window.onload = function(){
    // new创建了一个空对象
    var app = new SnakeGame({
        width:600,
        height:600,
        canvas:document.getElementById("canvas"),
        ctx:this.canvas.getContext("2d")
    });
    // 调用原型上的init
    app.init();
}
// 构造函数
function SnakeGame(option){
    // 添加属性
    // 画布的大小
    this.width = option.width;
    this.height = option.height;
    // 画布的标签
    this.canvas = option.canvas;
    // 绘制图形图像的环境
    this.ctx = option.ctx;
    // 每个格子的大小
    this.space = 20;
    // 设置画布的大小
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.row = this.height/this.space;//30
    this.column = this.width / this.space;//30
    // 添加数组记录蛇
    this.snakeArray = [
        {
            x:0,
            y:0,
            color:"blue"
        },
        {
            x:this.space,
            y:0,
            color:"blue"
        },
        {
            x:this.space*2,
            y:0,
            color:"red"//蛇头
        }
    ];
    // // 添加食物的坐标位置
    // this.food = {
    //     x:this.space*5,
    //     y:this.space*10,
    //     color:"green"
    // }
    // 朝着右边移动
    this.direction = "right";
    this.speed = 500;
    this.maxSpeed = 50;
    // 定义蛇移动的值 储存这个值作为全局变量，后面会用到，解决一些bug
    this.x = 0;
    this.y = 0;
}
// 在构造函数的原型上添加方法
SnakeGame.prototype.init = function(){
    // 调用绘制地图的函数
    this.drawMap();
    this.drawInitSnake();
    // this.drawInitFood();
    this.createFood();
    this.addEventFunc();
    // 启动定时器
    // this.goTime();
    this.controls();
}
// 绘制地图
SnakeGame.prototype.drawMap = function(){
    for(var i = 0 ; i <= this.row;i++){
        // 绘制行
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(0,i*this.space);
        this.ctx.lineTo(this.width,i*this.space);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    for(var j = 0 ; j <= this.column;j++){
        // 绘制列
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(j*this.space,0);
        this.ctx.lineTo(j*this.space,this.height);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}
SnakeGame.prototype.drawInitSnake= function(){
    for(var i=0;i<this.snakeArray.length;i++){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.snakeArray[i].color;
        this.ctx.rect(this.snakeArray[i].x,this.snakeArray[i].y,this.space,this.space);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
// 绘制食物
SnakeGame.prototype.drawInitFood = function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = this.food.color;
    this.ctx.rect(this.food.x,this.food.y,this.space,this.space);
    this.ctx.closePath();
    this.ctx.fill();
}
SnakeGame.prototype.random= function(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}
// 创建食物
SnakeGame.prototype.createFood= function(){
    var _this = this;
    // 随机坐标
    this.food = {
        x:this.random(0,this.column)*this.space,
        y:this.random(0,this.row)*this.space,
        color:"green"
    }
    var bool = false;
    // 循环蛇的数组
    for(var i = 0;i<this.snakeArray.length;i++){
        // 判断创建的食物坐标是否在蛇的身体上
        if(this.food.x == this.snakeArray[i].x && this.food.y == this.snakeArray[i].y){
            bool = true;
        }
    }
    // 如果布尔为true，创建随机的食物在蛇身体上
    if(bool){
        this.createFood();
    }
    // 绘制食物
    this.drawInitFood();
}
// 添加一个方法，监听键盘事件 改变direction
SnakeGame.prototype.addEventFunc= function(){//函数作用域v
    var _this = this;
    // 给页面绑定键盘按下的时间
    document.onkeydown = function(e){
        // 接收一下事件对象的keycode
        var keyCode = e.keyCode;
        // 判断如果蛇往右移动，禁止按向左的按键
        if(_this.direction=="right"&& keyCode == 37){
            return ;
        }else if(_this.direction=="left"&& keyCode == 39){
            return ;
        }else if(_this.direction=="down"&& keyCode == 38){
            return ;
        }else if(_this.direction=="up"&& keyCode == 40){
            return ;
        }
        // 判断keycode的值 这是蛇移动的方向
        if(keyCode == 37){
            _this.direction = "left";
        }else if(keyCode == 39){
            _this.direction = "right";
        }else if(keyCode == 40){
            _this.direction = "down";
        }else if(keyCode == 38){
            _this.direction = "up";
        }
    }
}
// 蛇移动
SnakeGame.prototype.snakeMove= function(){
    // 控制流语句
    switch(this.direction){
        case "up":
            this.y -= this.space;
            break;
        case "down":
            this.y += this.space;
            break;
        case "left":
            this.x -= this.space;
            break;
        case "right":
            this.x += this.space;
            break;
    }
    // 更新蛇身体的坐标
    for(var i=0;i<this.snakeArray.length-1;i++){
        // 循环属于身体的对象，判断每一节身体的坐标等不等于蛇头的坐标
        if(this.snakeArray[i].x == this.snakeArray[this.snakeArray.length-1].x && this.snakeArray[i].y == this.snakeArray[this.snakeArray.length-1].y){
            clearInterval(this.timer);
            alert("吃到自己了");
            // 重新加载页面
            window.location.reload();
        }
        this.snakeArray[i].x = this.snakeArray[i+1].x;
        this.snakeArray[i].y = this.snakeArray[i+1].y;
    }
    // 更新蛇头的坐标
    this.snakeArray[this.snakeArray.length-1].x += this.x;
    this.snakeArray[this.snakeArray.length-1].y += this.y;
    
    // 重新绘制蛇
    this.drawInitSnake();
    // 判断是否结束游戏
    var copySnake = this.snakeArray;//复制蛇的身体数据
    if(copySnake[copySnake.length-1].x >= this.canvas.width || copySnake[copySnake.length-1].x < 0 || copySnake[copySnake.length-1].y >= this.canvas.height || copySnake[copySnake.length-1].y < 0){
        clearInterval(this.timer);
        alert("游戏结束");
        // 重新加载页面
        window.location.reload();
    }
    // 调用吃东西方法
    this.eatFood();
    // 初始化蛇移动的值
    this.x = 0;
    this.y = 0;
}
SnakeGame.prototype.eatFood= function(){
    console.log(this.x,this.y);
    // 蛇头吃到食物 蛇头坐标等于食物坐标时
    if(this.snakeArray[this.snakeArray.length-1].x == this.food.x && this.snakeArray[this.snakeArray.length-1].y == this.food.y){
        var newBody = {
            x:this.snakeArray[0].x-this.x,
            y:this.snakeArray[0].y-this.y,
            color:"blue"
        }
        this.snakeArray.unshift(newBody);
        // 重新绘制蛇
        this.drawInitSnake();
        // 创建食物
        this.createFood();
        // 判断speed等于100的时候就让他一直是一百 最大速度50
        this.speed = this.speed <= this.maxSpeed ? this.maxSpeed : this.speed -=150;
        input.value ++;
        // 调用定时器，更新定时器的速度
        this.goTime();
    }
}
SnakeGame.prototype.goTime = function(){
    // 清除定时器，防止启动多个定时器
    clearInterval(this.timer);
    var _this = this;
    this.timer = setInterval(function(){
        // 重新绘制地图
        _this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        _this.drawMap();
        _this.drawInitFood();
        _this.snakeMove();
    },this.speed)
}
SnakeGame.prototype.controls = function(){
    var _this = this;
    startGame.onclick =function(){

        _this.goTime();
    }
    stopGame.onclick = function(){
        clearInterval(_this.timer);
    }
}