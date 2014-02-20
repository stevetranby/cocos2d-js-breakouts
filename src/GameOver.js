var GameOverLayer = cc.LayerColor.extend({
  
  init: function(color) {
    this._super(color);
    console.log("test");

    var ws = cc.Director.getInstance().getWinSize();

    console.log("gameoverlayer init");
    var cx = ws.width/2.0;
    var cy = ws.height/2.0;
    var label = cc.LabelTTF.create("Game Over");
    label.setPosition(cc.p(cx,cy));

    this.addChild(label);

    // TODO: add touch/keyboard support for restarting
    this.setTouchEnabled(true);

    return true;
  },

  onTouchesEnded: function(touches, event) {
    console.log("starting new game");
    var scene = GameLayer.scene();
    var transition = cc.TransitionFade.create(1.2, scene);
    cc.Director.getInstance().replaceScene(transition);
  }

});

GameOverLayer.create = function () {
    console.log("create");
    var layer = new GameOverLayer();
    if (layer && layer.init(cc.c4b(128,0,0,255))) {
      console.log("created");
        return layer;
    }
    return null;
};

GameOverLayer.scene = function () {
    console.log("scene");
    var scene = cc.Scene.create();
    var layer = GameOverLayer.create();
    scene.addChild(layer);
    return scene;
};