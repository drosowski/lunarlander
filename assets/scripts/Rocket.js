cc.Class({
    extends: cc.Component,

    properties: {
        yAccelerate: false,
        leftAccel: false,
        rightAccel: false,
        ySpeedInc : 0,
        xSpeedInc : 0,
        maxYSpeed: 0,
        maxXSpeed: 0,
        currentYSpeed: 0,
        currentXSpeed: 0,
        gravitation: 0,
        rocketOn: {
            default: null,
            type: cc.SpriteFrame
        }
    },
    
    setInputControl: function () {
        var self = this;
        // add keyboard event listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.up:
                        self.yAccelerate = true;
                        break;
                    case cc.KEY.left:
                        self.leftAccel = true;
                        break;
                    case cc.KEY.right:
                        self.rightAccel = true;
                        break;                        
                }
            },
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.up:
                        self.yAccelerate = false;
                        break;
                    case cc.KEY.left:
                        self.leftAccel = false;
                        break;
                    case cc.KEY.right:
                        self.rightAccel = false;
                        break;                        
                }
            }
        }, self.node);
    },    

    // use this for initialization
    onLoad: function () {
        this.yAccelerate = false;
        this.leftAccel = false;
        this.rightAccel = false;
        this.currentYSpeed = 0;
        this.currentLeftSpeed = 0;
        this.currentRightSpeed = 0;

        this.setInputControl();
    },
    
    yMovement: function(dt) {
        if(this.yAccelerate && this.currentYSpeed <= this.maxYSpeed) {
            this.currentYSpeed += this.ySpeedInc * dt;
        }
        else if(Math.abs(this.currentYSpeed) <= this.maxYSpeed) {
            this.currentYSpeed -= this.gravitation * dt;
        }      
        
        if(this.currentYSpeed > 0 || (cc.Canvas.instance.designResolution.height / 2 + this.node.y) > 0) {
            this.node.y += this.currentYSpeed * dt;
        }
        else {
            this.currentYSpeed = 0;
            this.currentXSpeed = 0;
        }        
    },
    
    xMovement: function(dt) {
        if(this.rightAccel && Math.abs(this.currentXSpeed) <= this.maxXSpeed) {
            this.currentXSpeed += this.xSpeedInc * dt;
        }
        else if(this.leftAccel && Math.abs(this.currentXSpeed) <= this.maxXSpeed) {
            this.currentXSpeed -= this.xSpeedInc * dt;
        }
        
        
        if(this.currentXSpeed !== 0) {
            this.node.x += this.currentXSpeed * dt;
        }
        if(Math.abs(this.node.x) * 2 >= cc.Canvas.instance.designResolution.width) {
            this.currentXSpeed = 0;
            if(this.node.x > 0) {
                this.node.x -= 1;
            }
            else {
                this.node.x += 1;
            }
        }        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.yMovement(dt);
        this.xMovement(dt);
    },
});