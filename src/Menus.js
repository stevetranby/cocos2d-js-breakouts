// TODO: refactor into a single menu class with arguments

MenuStart = cc.Layer.extend({

  init: function() {
    // for clarity
    var selfPointer = this;

    this._super();

    var ws = cc.Director.getInstance().getWinSize();
    //var ws = cc.Director.getInstance().getVisibleSize();

    console.log(ws);

    {
      var bg = cc.Sprite.create(img_bgImage);
      bg.setPosition(cc.p(ws.width * 0.5, ws.height * 0.5));
      bg.ignoreAnchorPointForPosition(false);
      this.addChild(bg);
    }

    {
      var logo = cc.Sprite.create(img_logo);
      logo.setPosition(cc.p(ws.width * 0.5, ws.height * 0.65));
      this.addChild(logo);
    }

    {
      var label = cc.LabelTTF.create("click to start", "Arial", 16.0);
      label.setPosition(cc.p(ws.width * 0.5, ws.height * 0.3));
      label.setColor(cc.BLACK);
      this.addChild(label);
    }

    {
      var label = cc.LabelTTF.create("during the game: use L/R arrow keys to skip level", "Arial", 16.0);
      label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
      label.setDimensions(cc.size(ws.width * 0.8, 60.0));
      label.setPosition(cc.p(ws.width * 0.5, ws.height * 0.1));
      label.setColor(cc.BLACK);
      this.addChild(label);
    }

    return true;
  },

  onEnter: function() {
    this._super();

    console.log("enter");

    // TODO: check for keyboard support using platform info
    if (this.setKeyboardEnabled)
      this.setKeyboardEnabled(true);

    // TODO: add mouse support for hover move (when no buttons down)
    if ('touches' in sys.capabilities) {
      this.setTouchEnabled(true);
    }
    if ('mouse' in sys.capabilities) {
      this.setMouseEnabled(true);
    }
  },

  startGame: function() {
    // start game
    var scene = cc.TransitionFade.create(0.1, GameLayer.scene());
    cc.Director.getInstance().replaceScene(scene);
  },

  //////////////////////////////////////////////////////
  /// Input
  //////////////////////////////////////////////////////

  onKeyDown: function(e) {},
  onKeyUp: function(e) {
    console.log("key up");
    this.startGame();
  },

  onMouseDown: function(event) {
    console.log("mouse down");
    this.startGame();
  },
  onScrollWheel: function(event) {},
  onTouchesBegan: function(touches, event) {},
  onTouchesMoved: function(touches, event) {},
  onTouchesEnded: function(touches, event) {
    console.log("starting game");
    this.startGame();
  },
  onTouchesCancelled: function(touches, event) {},

});

// Factory Methods to support auto init
MenuStart.create = function() {
  var layer = new MenuStart();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

// Create a simple scene
MenuStart.scene = function() {
  var scene = cc.Scene.create();
  var layer = MenuStart.create();
  scene.addChild(layer);
  return scene;
};


////////////////////////////////////////////////////
////////////////////////////////////////////////////


MenuWin = cc.Layer.extend({

  init: function() {
    this._super();

    var ws = cc.Director.getInstance().getWinSize();
    //var ws = cc.Director.getInstance().getVisibleSize();

    console.log(ws);

    {
      var bg = cc.Sprite.create(img_bgImage);
      bg.setPosition(cc.p(ws.width * 0.5, ws.height * 0.5));
      bg.ignoreAnchorPointForPosition(false);
      this.addChild(bg);
    }

    {
      var logo = cc.Sprite.create(img_logo);
      logo.setPosition(cc.p(ws.width * 0.5, ws.height * 0.65));
      this.addChild(logo);
    }

    {
      var label = cc.LabelTTF.create("You are the Master!", "Arial", 16.0);
      label.setPosition(cc.p(ws.width * 0.5, ws.height * 0.3));
      label.setColor(cc.BLACK);
      this.addChild(label);
    }

    return true;
  },

  onEnter: function() {
    this._super();

    console.log("enter");

    this.runAction(cc.Sequence.create(cc.DelayTime.create(2.5), cc.CallFunc.create(function() {
      var scene = cc.TransitionFade.create(0.75, MenuStart.scene());
      cc.Director.getInstance().replaceScene(scene);
    }, this), null));

  },

  startGame: function() {
    // start game
    var scene = GameLayer.scene();
    cc.Director.getInstance().replaceScene(scene);
  },

});

MenuWin.scene = function() {
  var scene = cc.Scene.create();
  var layer = new MenuWin();
  if (layer && layer.init()) {
    scene.addChild(layer);
  }
  return scene;
}



////////////////////////////////////////////////////
////////////////////////////////////////////////////


MenuGameOver = cc.Layer.extend({

  init: function() {
    this._super();

    var ws = cc.Director.getInstance().getWinSize();
    //var ws = cc.Director.getInstance().getVisibleSize();

    console.log(ws);

    {
      var bg = cc.Sprite.create(img_bgImage);
      bg.setPosition(cc.p(ws.width * 0.5, ws.height * 0.5));
      bg.ignoreAnchorPointForPosition(false);
      this.addChild(bg);
    }

    {
      var logo = cc.Sprite.create(img_logo);
      logo.setPosition(cc.p(ws.width * 0.5, ws.height * 0.65));
      this.addChild(logo);
    }

    {
      var label = cc.LabelTTF.create("Game Over!", "Arial", 16.0);
      label.setPosition(cc.p(ws.width * 0.5, ws.height * 0.3));
      label.setColor(cc.BLACK);
      this.addChild(label);
    }

    return true;
  },

  onEnter: function() {
    this._super();

    console.log("enter");

    this.runAction(cc.Sequence.create(cc.DelayTime.create(2.5), cc.CallFunc.create(function() {
      var scene = cc.TransitionFade.create(0.75, MenuStart.scene());
      cc.Director.getInstance().replaceScene(scene);
    }, this), null));

  },

  startGame: function() {
    // start game
    var scene = GameLayer.scene();
    cc.Director.getInstance().replaceScene(scene);
  },

});

MenuGameOver.scene = function() {
  var scene = cc.Scene.create();
  var layer = new MenuGameOver();
  if (layer && layer.init()) {
    scene.addChild(layer);
  }
  return scene;
}
