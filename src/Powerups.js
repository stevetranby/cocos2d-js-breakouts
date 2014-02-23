var POWERUP_TYPE_ADDBALL = "addball";
var POWERUP_TYPE_SHRINK = "shrink";

var Powerup = cc.Sprite.extend({

  type: POWERUP_TYPE_ADDBALL,
  isActive: true,
  velocity: cc.p(0, -1),

  init: function(pType) {

    this.type = pType;

    var frame;
    if (this.type === POWERUP_TYPE_ADDBALL) {
      frameRect = cc.rect(16 * 6, 16 * 6, 16, 16);
    } else if (this.type === POWERUP_TYPE_SHRINK) {
      frameRect = cc.rect(16 * 7, 16 * 6, 16, 16);
    }

    this._super(img_tiles, frameRect);

    console.log("init");
  },

  update: function(dt) {
    var newPosition = cc.pAdd(this.getPosition(), this.velocity);
    this.setPosition(newPosition);
  },

});
