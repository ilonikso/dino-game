

const getRandomValue = function(min, max){
    return Math.random() * (max - min) + min;
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasSetups = {
    width: 600,
    height: 250,
    ground: 220,
    gravity: 0.4,
    gravitySpeed: 0,
    dinoJump: 8,
    dinoWidth: 30,
    dinoHeight: 40,
    dinoXPosition: 40,
    dinoTouch: false,
    roadItemWidth: 50,
    roadItemHeight: 30,
    roadSpeed: 2.8,
    roadStartSpeed: 3.5,
    cactusHeight: 30,
    cactusWidth: 18,
    cactusDiff: 2, 
    cactusCollisionAdj: 7, 
    cactusMinDistance: 800, 
    cactusMaxDistance: 1200,
    counter: 0,
    counterLS: 0, 
    claudWidth: 35,
    claudHeight: 20,
    claudYpositon: 130,
    claudSizeDifference: 10
};

const canvasImages = {
    cactus1: 'img/raster/cactus1test2.png',
    cactus2: 'img/raster/cactus2test2.png',
    cactus3: 'img/raster/cactus3test2.png',
    claud1: 'img/raster/claud1.png',
    claud2: 'img/raster/claud2.png',
    claud3: 'img/raster/claud3.png',
    road1: 'img/raster/road2.png',
    dino1: 'img/raster/dino5.png',
};

const canvasSounds = {
    over: 'img/sounds/jump.wav', 
    hit: 'img/sounds/hiscore.wav'
};

const Dino = function(){
    this._reset();
    this._eventHandler();
};

Dino.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.sizeX, this.sizeY);


    if(!this.dinoCrash){
        if(this.dinoJump){
            ctx.drawImage(this.dinoImg1, 0, 0,this.sizeX - 6,this.sizeY - 6, this.x, this.y, this.sizeX , this.sizeY);
        }else {
            if(Math.floor(this.dinoAnimFrame) === 0){
                ctx.drawImage(this.dinoImg1, 50, 0,this.sizeX - 6,this.sizeY - 6, this.x, this.y, this.sizeX , this.sizeY);
            }
        
            if(Math.floor(this.dinoAnimFrame) === 1){
                ctx.drawImage(this.dinoImg1, 75, 0,this.sizeX - 6,this.sizeY - 6, this.x, this.y, this.sizeX , this.sizeY);
            }
    
            if(this.dinoAnimFrame === -1){
                ctx.drawImage(this.dinoImg1, 0, 0,this.sizeX - 6,this.sizeY - 6, this.x, this.y, this.sizeX , this.sizeY);
            }
        }
    } else{
        ctx.drawImage(this.dinoImg1, 100, 0,(this.sizeX - 6) * 2 + 2,this.sizeY - 6, this.x , this.y, this.sizeX * 2 , this.sizeY);
    }

    //ctx.stroke();
    ctx.closePath();
};

Dino.prototype.animation = function(){
    this.dinoAnimFrame += canvasSetups.roadSpeed / 25;

    if(this.dinoAnimFrame > 2){
        this.dinoAnimFrame = 0;
    }
};

Dino.prototype.update = function(){
    // Dino move animation
    this.animation();
    // Dino move
    this.move();

    // Y position limitation
    if(this.y >= canvasSetups.ground - this.sizeY){
        this.y = canvasSetups.ground - this.sizeY;
    } else if(this.y < 0){
        this.y = 0;
    }
};

Dino.prototype.move = function(){
    // Gravity
    this.dy -= this.gravity;
    this.y -= this.dy;

    if(this.y >= canvasSetups.ground - this.sizeY){
        this.dinoJump = false;
        this.dy = 0;
    } 
};

Dino.prototype.jump = function(){
    this.dy = canvasSetups.dinoJump;
    this.dinoJump = true;
};

Dino.prototype._eventHandler = function(){
    const _self = this;

    document.addEventListener('keydown', function(evtKeybord){
        if(evtKeybord.keyCode === 32 || evtKeybord.keyCode === 38){
            if(_self.y === canvasSetups.ground - _self.sizeY){
                _self.jump();
            }
        }

        if(evtKeybord.keyCode === 40){
            if(_self.y === canvasSetups.ground - _self.sizeY){
                _self.dinoBend = true;
            }
        }
    });

    document.addEventListener('keyup', function(evtKey2){
        if(evtKey2.keyCode === 40){
            if(_self.y === canvasSetups.ground - _self.sizeY){
                _self.dinoBend = false;
            }
        }
    });

    document.addEventListener('touchstart', function(){
            if(_self.y === canvasSetups.ground - _self.sizeY){
                _self.jump();     
            }
    });
};

Dino.prototype._reset = function(){
    this.sizeX = canvasSetups.dinoWidth;
    this.sizeY = canvasSetups.dinoHeight;
    this.x = canvasSetups.dinoXPosition;
    this.y = canvasSetups.ground - this.sizeY;
    this.dy = 0;
    this.vy = 0;
    this.gravity = canvasSetups.gravity;
    this.jumpHeight = canvasSetups.dinoJump;
    this.dinoImg1 = new Image(this.sizeX, this.sizeY);
    this.dinoImg1.src = canvasImages.dino1;
    this.dinoAnimFrame = -1;
    this.dinoJump = false;
    this.dinoBend = false;
    this.dinoCrash = false;
};


const Roads = function(){
    this._reset();
}

Roads.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.sizeX, this.sizeY);
    ctx.drawImage(this.roadImg1, this.x, this.y, this.sizeX, this.sizeY);
    //ctx.stroke();
    ctx.closePath();
};

Roads.prototype.update = function(){
    this.x -= canvasSetups.roadSpeed;
    
    if(this.isOffscreen()){
        this._reset();
        canvasSetups.counter++;
    }
};

Roads.prototype.isOffscreen = function(){
    return this.x < -(this.sizeX)
};

Roads.prototype._reset = function(){
    this.sizeX = canvasSetups.roadItemWidth + canvasSetups.roadSpeed;
    this.sizeY = canvasSetups.roadItemHeight;
    this.x = canvasSetups.width + this.sizeX;
    this.y = canvasSetups.ground; 
    this.vx = canvasSetups.roadSpeed;
    this.type = Math.round(getRandomValue(1, 3));
    this.roadImg1 = new Image(this.sizeX, this.sizeY);
    this.roadImg1.src = canvasImages.road1;
};

// Cactuses start ------------------------------------
const Cactus = function(){
    this._reset();
};

Cactus.prototype.render = function(ctx){
    
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.sizeX, this.sizeY);

    if(this.type === 1){
        ctx.drawImage(this.cactusImg1, this.x, this.y, this.sizeX, this.sizeY);
    } else if(this.type === 2){
        ctx.drawImage(this.cactusImg2, this.x, this.y, this.sizeX, this.sizeY);
        
    } else{
        ctx.drawImage(this.cactusImg3, this.x, this.y, this.sizeX, this.sizeY);
    }
    
    //ctx.stroke();
    ctx.closePath();
};

Cactus.prototype.update = function(sound){
    // Move cactus
    this.x -= canvasSetups.roadSpeed;

    if(this.isOffscreen()){
        this.x = Math.floor(getRandomValue(canvasSetups.cactusMinDistance, canvasSetups.cactusMaxDistance) + getRandomValue(canvasSetups.width, canvasSetups.width * 3));
    }

    if(this.isOverJump()){
        canvasSetups.roadSpeed += 0.1;
        sound.play();
    }
};

Cactus.prototype.isOffscreen = function(){
    return this.x < -(this.sizeX);
};

Cactus.prototype.isOverJump = function(){
    return this.x < canvasSetups.dinoXPosition + canvasSetups.dinoWidth / 2 && this.x > canvasSetups.dinoXPosition + canvasSetups.dinoWidth / 2 - canvasSetups.roadSpeed;
}

Cactus.prototype._reset = function(){
    this.sizeX = Math.floor(getRandomValue(canvasSetups.cactusWidth - canvasSetups.cactusDiff, canvasSetups.cactusWidth + canvasSetups.cactusDiff));
    this.sizeY = Math.floor(getRandomValue(canvasSetups.cactusHeight - canvasSetups.cactusDiff, canvasSetups.cactusHeight + canvasSetups.cactusDiff + 5));
    this.x = canvasSetups.width + this.sizeX;
    this.y = canvasSetups.ground - this.sizeY; 
    this.vx = canvasSetups.roadSpeed;
    this.type = Math.round(getRandomValue(1, 3));
    this.cactusImg1 = new Image(this.sizeX, this.sizeY);
    this.cactusImg1.src = canvasImages.cactus1;
    this.cactusImg2 = new Image(this.sizeX, this.sizeY);
    this.cactusImg2.src = canvasImages.cactus2;
    this.cactusImg3 = new Image(this.sizeX, this.sizeY);
    this.cactusImg3.src = canvasImages.cactus3;
};

// Cactuses end --------------------------------------

// Clouds start --------------------------------------
const Claud = function(){
    this._reset();
}

Claud.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.sizeX, this.sizeY);

    if(this.type === 1){
        ctx.drawImage(this.claudImg1, this.x, this.y, this.sizeX, this.sizeY);
    } else if(this.type === 2){
        ctx.drawImage(this.claudImg2, this.x, this.y, this.sizeX, this.sizeY);
    } else{
        ctx.drawImage(this.claudImg3, this.x, this.y, this.sizeX, this.sizeY);
    }
    
    //ctx.stroke();
    ctx.closePath();
};


Claud.prototype.update = function(){   
    //this.x += -this.vx * this.vxRatio;
    this.x += -canvasSetups.roadSpeed / 2 * this.vxRatio;

    if(this.isOffscreen()){
        this._reset();

        this.x = Math.floor(getRandomValue(canvasSetups.cactusMinDistance, canvasSetups.cactusMaxDistance) + getRandomValue(canvasSetups.width, canvasSetups.width * 3));
    }
};

Claud.prototype.isOffscreen = function(){
    return this.x < -(this.sizeX);
};

Claud.prototype._reset = function(){
    this.sizeX = Math.floor(getRandomValue(canvasSetups.claudWidth - canvasSetups.claudSizeDifference, canvasSetups.claudWidth + canvasSetups.claudSizeDifference));
    this.sizeY = Math.floor(this.sizeX / 2.2);
    this.x = canvasSetups.width + this.sizeX;
    this.y = Math.floor(canvasSetups.ground - this.sizeY - getRandomValue(canvasSetups.claudYpositon - canvasSetups.claudSizeDifference, canvasSetups.claudYpositon + canvasSetups.claudSizeDifference)); 
    this.vx = canvasSetups.roadSpeed / 2;
    this.vxRatio = this.sizeX / canvasSetups.claudWidth;
    this.type = Math.round(getRandomValue(1, 3));
    this.claudImg1 = new Image(this.sizeX, this.sizeY);
    this.claudImg1.src = canvasImages.claud1;
    this.claudImg2 = new Image(this.sizeX, this.sizeY);
    this.claudImg2.src = canvasImages.claud2;
    this.claudImg3 = new Image(this.sizeX, this.sizeY);
    this.claudImg3.src = canvasImages.claud3;
};

// Clouds end ----------------------------------------

// Sounds start --------------------------------------
const Sound = function(src){
    this._reset(src);
}

Sound.prototype._reset = function(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("preload", "auto");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
};
// Sounds end ----------------------------------------

// Counter start --------------------------------------
const Counter = function(){
    Roads.call(this);
}

Counter.prototype = Object.create(Roads.prototype);

Counter.prototype.render = function(ctx){
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Roboto';
    ctx.fillText(this.text, canvasSetups.width - 50, 30);
    ctx.fillStyle = '#aaa';
    ctx.fillText('HI ' + this.hiScore, canvasSetups.width - 110, 30);
}

Counter.prototype.update = function(){
    this.text = canvasSetups.counter;
    this.hiScore = canvasSetups.counterLS;
}

Counter.prototype._reset = function(){
    this.text = canvasSetups.counter;
    this.hiScore = canvasSetups.counterLS;
};
// Counter end ----------------------------------------

// const Colision
const Collision = function(dino, cactus){
    this._reset(dino, cactus);
}

Collision.prototype.update = function(){
    console.log(this.cactusItem.x);
    console.log(this.dinoItem.y)
};

Collision.prototype.getCollision = function(diff){
    let touch = false;

    this.cactusItem.forEach(function(it){
        
        if((this.dinoItem.x <= it.x + it.sizeX - diff) && (this.dinoItem.x + this.dinoItem.sizeX >= it.x + diff)){
            if(this.dinoItem.y + this.dinoItem.sizeY >= it.y + diff){
                touch = true;
            }            
        }
    }, this);

    return touch;
};

Collision.prototype.gameOver = function(sound){
    canvasSetups.roadSpeed = 0;
    this.dinoItem.gravity = 0;
    this.dinoItem.dy = 0;
    this.dinoItem.dinoCrash = true;
    
    sound.play();

    
    // Show Game Over button
    let startButton = document.querySelector('.game__start');
    startButton.style.visibility = 'visible';
    
    // New game start 'Game over' button
    startButton.addEventListener('click', function(){
        location.reload();
    });
    // New game start 'space' button
    document.addEventListener('keydown', function(e){
        if(e.keyCode === 32){
            location.reload();
            e.preventDefault();
        }
    });

    
    // Get score from LS
    let hiScore;
    if(localStorage.getItem('score') === null){
        hiScore = 0;
    } else{
        hiScore = localStorage.getItem('score');
    }

    // Set Score to LS
    if(canvasSetups.counter > hiScore){
        localStorage.setItem('score', canvasSetups.counter);
    }
    
}

Collision.prototype._reset = function(dino, cactus){
    this.dinoItem = dino;
    this.cactusItem = cactus;
    this.collision = false;
};





const cleanupFrame = function(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const renderFrame = function(ctx, dino, road, cactus, claud, counter, coll, sound1, sound2){
    cleanupFrame(ctx);

    dino.render(ctx);
    dino.update();

    road.forEach(function(it){
        it.render(ctx);
        it.update();
    });

    cactus.forEach(function(it){
        it.render(ctx);
        it.update(sound1);
    });

    claud.forEach(function(it){
        it.render(ctx);
        it.update();
    });

    counter.render(ctx);
    counter.update();

    

    if(coll.getCollision(canvasSetups.cactusCollisionAdj)){     
        coll.gameOver(sound2);

        if(!coll.collision){
            requestAnimationFrame(renderFrame.bind(null, ctx, dino, road, cactus,claud, counter, coll, sound1, sound2));
            coll.collision = true;
        }
    } else{
        requestAnimationFrame(renderFrame.bind(null, ctx, dino, road, cactus,claud, counter, coll, sound1, sound2));
    }

    
    //requestAnimationFrame(renderFrame.bind(null, ctx, item, road, cactus,claud, counter, coll,sound1, sound2));
}

const setup = function(){
    canvas.width = canvasSetups.width;
    canvas.height = canvasSetups.height;

    
    // Number of road items
    const roadItemNumber = Math.floor(canvasSetups.width / canvasSetups.roadItemWidth) + 3;
    // Number of cactus items
    const cactusItemNumber = Math.floor(getRandomValue(4, 10));
    // Number of clauds items
    const claudItemNumber = 5;

    // Dino Initialization
    const dinoItem = new Dino();

    // Roads creation
    const roadItems = new Array(roadItemNumber)
        .fill('')
        .map(function(){
            return new Roads();
        });

    roadItems.forEach(function(item, index){
        item.x -= index * item.sizeX;
    });

    // Cactuses initialization
    const cactusItems = new Array(cactusItemNumber)
        .fill('')
        .map(function(){
            return new Cactus();
        });

    cactusItems.forEach(function(item, index){
        //item.x -= index * Math.floor(getRandomValue(canvasSetups.cactusMinDistance, canvasSetups.cactusMaxDistance)) - canvasSetups.width * 2;
        item.x -= index * Math.floor(getRandomValue(350, 550)) - canvasSetups.width * 3;
    });

    // Clouds initialization
    const claudItems = new Array(claudItemNumber)
        .fill('')
        .map(function(){
            return new Claud();
        });

    claudItems.forEach(function(item, index){
        //item.x -= index * Math.floor(getRandomValue(400, 700)) - canvasSetups.width * 3;
        item.x -= index * Math.floor(getRandomValue(canvasSetups.cactusMinDistance, canvasSetups.cactusMaxDistance)) - canvasSetups.width * 2;
        //item.x = index * Math.floor(getRandomValue(400, 700)) + canvasSetups.width * 1; 
        
    });

    // Counter initialoization
    const counterItem = new Counter();
    // Collision Object initialization
    const collision = new Collision(dinoItem, cactusItems);
    // Sounds initialization
    const counterSound = new Sound(canvasSounds.over);
    const failSound = new Sound(canvasSounds.hit);

    renderFrame(ctx, dinoItem, roadItems, cactusItems,claudItems, counterItem, collision, counterSound, failSound);
}




const gameController = function(){

    // Game start
    const gameStart = function(e){
        if(e.keyCode === 32){   
            canvasSetups.roadSpeed = canvasSetups.roadStartSpeed;
            e.preventDefault();
            
            document.removeEventListener('keydown', gameStart);
            document.removeEventListener('touchstart', gameStartTouch);
        }  
    };

    const gameStartTouch = function(){
            canvasSetups.roadSpeed = canvasSetups.roadStartSpeed;

            document.removeEventListener('touchstart', gameStartTouch);
            document.removeEventListener('keydown', gameStart);  
    };

    // Initialize Road speed and Items
    canvasSetups.roadSpeed = 0;
    setup();

    // Get score from LS
    let hiScore;
    if(localStorage.getItem('score') === null){
        hiScore = 0;
    } else{
        hiScore = localStorage.getItem('score');
    }
    canvasSetups.counterLS = hiScore;
   
    // Listen for start Event
    document.addEventListener('keydown', gameStart);
    document.addEventListener('touchstart', gameStartTouch);
};

gameController();
