cc.Class({
    extends: cc.Component,

    properties: {
        rocketAtlas:{
            default: null,
            type: cc.SpriteAtlas
        },
        explosionAtlas:{
            default: null,
            type: cc.SpriteAtlas
        },
        yAccelerate: false,
        leftAccel: false,
        rightAccel: false,
        exploding: false,
        destroyed: false,
        landed: false,
        ySpeedInc : 0,
        xSpeedInc : 0,
        maxYSpeed: 0,
        maxXSpeed: 0,
        currentYSpeed: 0,
        currentXSpeed: 0,
        gravitation: 0
    },

    showExplosionFrame: function(sframes, index) {
        var sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = sframes[index];
        if(index >= sframes.length) {
            this.destroyed = true;
            this.exploding = false;
            return;
        }
        else {
            var self = this;
            setTimeout(function() {
                self.showExplosionFrame(sframes, ++index)
            }, 75);
        }
    },

    showExplosion: function() {
        this.exploding = true;
        var sframes = this.explosionAtlas.getSpriteFrames();
        this.showExplosionFrame(sframes, 0);
    },

    showSpriteFrame: function(key) {
        var sprite = this.node.getComponent(cc.Sprite);
        if(key === "rocket_on") {
            this.node.anchorY = 0.27;
        }
        else if(key === "rocket_off") {
            this.node.anchorY = 0;
        }
        sprite.spriteFrame = this.rocketAtlas.getSpriteFrame(key);
    },

    setInputControl: function () {
	var self = this;
        // add keyboard event listener
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            function(event) {
                switch(event.keyCode) {
                    case cc.macro.KEY.up:
                        self.yAccelerate = true;
                        break;
                    case cc.macro.KEY.left:
                        self.leftAccel = true;
                        break;
                    case cc.macro.KEY.right:
                        self.rightAccel = true;
                        break;
                }
            }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,
	function(event) {
            switch(event.keyCode) {
            case cc.macro.KEY.up:
                self.yAccelerate = false;
                break;
            case cc.macro.KEY.left:
                self.leftAccel = false;
                break;
            case cc.macro.KEY.right:
                self.rightAccel = false;
                break;
            }
	}, this);
    },

    // use this for initialization
    onLoad: function () {
        this.yAccelerate = false;
        this.leftAccel = false;
        this.rightAccel = false;
        this.destroyed = false;
        this.landed = false;
        this.exploding = false;
        this.currentYSpeed = 0;
        this.currentLeftSpeed = 0;
        this.currentRightSpeed = 0;

        this.setInputControl();

        this.showSpriteFrame(this, "rocket_off");
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
            if(!this.exploding) {
                this.showExplosion();
            }
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

    renderSprite: function() {
        if(this.exploding) {
            return;
        }
        else if(!this.leftAccel && !this.rightAccel && !this.yAccelerate) {
            this.showSpriteFrame("rocket_off");
        }
        else {
            this.showSpriteFrame("rocket_on");
        }
    },

    onCollisionEnter: function (other, self) {
        if(Math.abs(this.currentYSpeed) > 50) {
            this.showExplosion();
        }
        else {
            this.landed = true;
        }
        this.currentYSpeed = 0;
        this.currentXSpeed = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.destroyed) {
            cc.director.loadScene("intro");
        }
        if(!this.landed && !this.exploding) {
            this.yMovement(dt);
            this.xMovement(dt);
            this.renderSprite();
        }
    }
});
