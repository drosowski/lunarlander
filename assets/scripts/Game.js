cc.Class({
    extends: cc.Component,

    properties: {
        counter: {
            default: null,
            type: cc.Label
        },
        rocket: {
            default: null,
            type: cc.Node
        },
        platformPrefab: {
            default: null,
            type: cc.Prefab
        },
        count: 0
    },

    increaseCounter: function() {
            self.count++;
            var countText;
            if(self.count < 10) {
                countText = '0.' + self.count;
            }
            else {
                countText = self.count/10;
                if(self.count%10 === 0) {
                    countText += '.0';
                }
            }
            this.string = '0:0' + countText;
    },

    spawnPlatform: function() {
        var platform = cc.instantiate(this.platformPrefab);
        this.node.addChild(platform);
        platform.setPosition(this.getPlatformPosition(platform));
    },

    getPlatformPosition: function (platform) {
        var randX = 0;
        var maxX = this.node.width/2 - platform.width;
        var minX = -(this.node.width/2) + platform.width;
        randX = (Math.random() - 0.5) * 2 * maxX;
        if(randX < minX) {
            randX += platform.width;
        }
        return cc.v2(randX, -(this.node.height/2));
    },

    enableCollider: function() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.enableCollider();
        this.rocket.zIndex = 1;
        this.spawnPlatform();

        this.count = 0;
        this.counter.schedule(function() {
            self.count++;
            var countText = '';
            if(self.count < 100) {
                countText = '0';
            }
            if(self.count < 10) {
                countText = countText + '0.' + self.count;
            }
            else {
                countText = countText + self.count/10;
                if(self.count%10 === 0) {
                    countText += '.0';
                }
            }
            this.string = countText;
        }, 0.1);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.rocket.getComponent('Rocket').landed) {
            this.counter.unscheduleAllCallbacks();
            this.scheduleOnce(function() {
                cc.director.loadScene('intro');
            }, 3);
        }
    },
});
