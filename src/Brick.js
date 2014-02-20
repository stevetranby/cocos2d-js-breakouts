var brickTextureRects = {
  'blue': cc.rect(0, 0, 32, 16),
  'orange': cc.rect(0, 1 * 16, 32, 16),
  'red': cc.rect(0, 2 * 16, 32, 16),
  'green': cc.rect(0, 3 * 16, 32, 16),
};

// TODO: add toggle for supporting both frame animation as well as the current fadeout/scale actions
// 
var Brick = cc.Sprite.extend({

  type: "brick",
  isActive: true,

  // TODO: refactor to support any number of powerups
  hasPowerup: false,
  hasPowerdown: false,

  init: function(type) {
    var textureRect = brickTextureRects[type];
    this._super(img_tiles, textureRect);
  },

  getValue: function() {
    return 100;
  },

  // destroy: function() {
  //   this.isActive = false;
  // },

});