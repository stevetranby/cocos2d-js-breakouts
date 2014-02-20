// app globals
var director = null;
var winSize = null;

var PLATFORM_JSB = 1 << 0;
var PLATFORM_HTML5 = 1 << 1;
var PLATFORM_HTML5_WEBGL = 1 << 2;
var PLATFORM_JSB_AND_WEBGL = PLATFORM_JSB | PLATFORM_HTML5_WEBGL;
var PLATFORM_ALL = PLATFORM_JSB | PLATFORM_HTML5 | PLATFORM_HTML5_WEBGL;


var cocos2dApp = cc.Application.extend({
    config: document['ccConfig'],
    ctor: function(scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching: function() {
        if (cc.RenderDoesnotSupport()) {
            //show Information to user
            alert("Browser doesn't support Canvas or WebGL");
            return false;
        }
        // initialize director
        director = cc.Director.getInstance();

        // SHOW_ALL should show entire game scene within the window or device screen, with letterboxing as necessary
        //cc.EGLView.getInstance().setDesignResolutionSize(320, 416, cc.RESOLUTION_POLICY.SHOW_ALL);

        var policy = new cc.ResolutionPolicy(cc.ContainerStrategy.ORIGINAL_CONTAINER, cc.ContentStrategy.EXACT_FIT);
        cc.EGLView.getInstance().setDesignResolutionSize(320, 416, policy);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        var selfPointer = this;
        window.addEventListener("resize", function(event) {
            cc.log("resizing window");
            // selfPointer.adjustSizeForWindow();
        });

        //load resources
        cc.LoaderScene.preload(g_resources, function() {
            // selfPointer.adjustSizeForWindow();
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    },
});

// APP LAUNCH
var myApp = new cocos2dApp(GameLayer.scene);

var s_rcVisible = cc.rect(0, 0, 0, 0);
var s_ptCenter = cc.p(0, 0);
var s_ptTop = cc.p(0, 0);
var s_ptTopRight = cc.p(0, 0);
var s_ptRight = cc.p(0, 0);
var s_ptBottomRight = cc.p(0, 0);
var s_ptBottom = cc.p(0, 0);
var s_ptLeft = cc.p(0, 0);
var s_ptTopLeft = cc.p(0, 0);

// TODO: add these methods to a subclass of cc.rect or possibly create pull-request for change to engine itself
var VisibleRect = {
    rect: function() {
        if (s_rcVisible.width == 0) {
            var s = cc.Director.getInstance().getWinSize();
            s_rcVisible = cc.rect(0, 0, s.width, s.height);
        }
        return s_rcVisible;
    },
    center: function() {
        if (s_ptCenter.x == 0) {
            var rc = VisibleRect.rect();
            s_ptCenter.x = rc.x + rc.width / 2;
            s_ptCenter.y = rc.y + rc.height / 2;
        }
        return s_ptCenter;
    },
    top: function() {
        if (s_ptTop.x == 0) {
            var rc = VisibleRect.rect();
            s_ptTop.x = rc.x + rc.width / 2;
            s_ptTop.y = rc.y + rc.height;
        }
        return s_ptTop;
    },
    topRight: function() {
        if (s_ptTopRight.x == 0) {
            var rc = VisibleRect.rect();
            s_ptTopRight.x = rc.x + rc.width;
            s_ptTopRight.y = rc.y + rc.height;
        }
        return s_ptTopRight;
    },
    right: function() {
        if (s_ptRight.x == 0) {
            var rc = VisibleRect.rect();
            s_ptRight.x = rc.x + rc.width;
            s_ptRight.y = rc.y + rc.height / 2;
        }
        return s_ptRight;
    },
    bottomRight: function() {
        if (s_ptBottomRight.x == 0) {
            var rc = VisibleRect.rect();
            s_ptBottomRight.x = rc.x + rc.width;
            s_ptBottomRight.y = rc.y;
        }
        return s_ptBottomRight;
    },
    bottom: function() {
        if (s_ptBottom.x == 0) {
            var rc = VisibleRect.rect();
            s_ptBottom.x = rc.x + rc.width / 2;
            s_ptBottom.y = rc.y;
        }
        return s_ptBottom;
    },
    bottomLeft: function() {
        return VisibleRect.rect();
    },
    left: function() {
        if (s_ptLeft.x == 0) {
            var rc = VisibleRect.rect();
            s_ptLeft.x = rc.x;
            s_ptLeft.y = rc.y + rc.height / 2;
        }
        return s_ptLeft;
    },
    topLeft: function() {
        if (s_ptTopLeft.x == 0) {
            var rc = VisibleRect.rect();
            s_ptTopLeft.x = rc.x;
            s_ptTopLeft.y = rc.y + rc.height;
        }
        return s_ptTopLeft;
    }
};