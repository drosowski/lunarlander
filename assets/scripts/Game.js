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

    // use this for initialization
    onLoad: function () {
        var self = this;
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
