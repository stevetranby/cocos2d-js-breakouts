var Player = cc.Sprite.extend({

  speed: 5,
  isSmallPaddle: false,

  init: function() {
    this._super(img_tiles, cc.rect(0, 16 * 4, 48, 16));
    var ws = cc.Director.getInstance().getWinSize();
    this.setPosition(cc.p(ws.width / 2.0, 40));
    return true;
  },

  update: function(dt) {
    if (this.shrinkTimer > 0) {
      this.shrinkTimer -= dt;
      if (this.shrinkTimer <= 0.0) {
        this.shrinkTimer = 0;
        // back to normal size
        console.log("player back to normal size");
        this.setTextureRect(cc.rect(0, 16 * 4, 48, 16));
      }
    }
  },

  shrink: function() {
    this.shrinkTimer = 10.0;
    this.setTextureRect(cc.rect(0, 16 * 5, 32, 16));
  }

});

Player.create = function() {
  var node = new Player();
  if (node && node.init()) {
    return node;
  }
  return null;
}
