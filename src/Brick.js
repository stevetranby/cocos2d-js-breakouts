var brickTextureRects = {
  'blue': cc.rect(0, 0, 32, 16),
  'orange': cc.rect(0, 1 * 16, 32, 16),
  'red': cc.rect(0, 2 * 16, 32, 16),
  'green': cc.rect(0, 3 * 16, 32, 16),
};

var brickDeathAnimRects = {
  'blue': [cc.rect(0, 0, 32, 16), cc.rect(1 * 32, 0, 32, 16), cc.rect(2 * 32, 0, 32, 16), cc.rect(3 * 32, 0, 32, 16)],
  'orange': [cc.rect(0, 1 * 16, 32, 16), cc.rect(1 * 32, 1 * 16, 32, 16), cc.rect(2 * 32, 1 * 16, 32, 16), cc.rect(3 * 32, 1 * 16, 32, 16)],
  'red': [cc.rect(0, 2 * 16, 32, 16), cc.rect(1 * 32, 2 * 16, 32, 16), cc.rect(2 * 32, 2 * 16, 32, 16), cc.rect(3 * 32, 2 * 16, 32, 16)],
  'green': [cc.rect(0, 3 * 16, 32, 16), cc.rect(1 * 32, 3 * 16, 32, 16), cc.rect(2 * 32, 3 * 16, 32, 16), cc.rect(3 * 32, 3 * 16, 32, 16)],
};

// TODO: add toggle for supporting both frame animation as well as the current fadeout/scale actions
//
var Brick = cc.Sprite.extend({

  type: "brick",
  isActive: true,

  // TODO: refactor to support any number of powerups
  hasPowerup: false,
  hasPowerdown: false,

  useFrameAnimation: false,

  init: function(type) {
    var textureRect = brickTextureRects[type];
    this._super(img_tiles, textureRect);
    return true;
  },

  getValue: function() {
    return 100;
  },

  destroy: function() {
    this.isActive = false;

    // play animation
    if (this.useFrameAnimation) {

    } else {
      var fade = cc.FadeOut.create(0.75);
      var scale = cc.ScaleTo.create(0.75, 0.75);
      var seq = cc.Sequence.create(scale, cc.CallFunc.create(function() { this.isActive = false; }, this), cc.RemoveSelf.create());
      this.runAction(seq);
      this.runAction(fade);
      this.isDying = true;
    }
  },

});
