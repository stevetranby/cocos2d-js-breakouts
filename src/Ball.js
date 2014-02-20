var Ball = cc.Sprite.extend({

  type: "ball",
  isActive: true,
  speed: 170.0/60.0,
  velocity: cc.p(0, 0),
  prevPosition: cc.p(0, 0),

  //////

  getPrevPosition: function() {
    return this.prevPosition;
  },

  //////

  init: function() {
    this._super(img_tiles, cc.rect(48, 64, 16, 16));

    // TODO: need to put into global, or reference gameLayer, or pass into init
    this.boundaryRect = cc.rect(48, 48, 320 - 48, 416 - 48);
    this.reset();
    return true;
  },

  onEnter: function() {
    this.reset();
  },

  reset: function() {
    var ws = cc.Director.getInstance().getWinSize();

    //var xstart = getRandomRange(this.boundaryRect.x, this.boundaryRect.width);
    var xstart = 74;
    this.startPosition = cc.p(xstart, 120);
    this.setPosition(this.startPosition);

    this.velocity = cc.p(this.speed, -this.speed);
  },

  update: function() {
    if (this.isActive) {
      this.prevPosition = this.getPosition();
      var newPos = cc.pAdd(this.prevPosition, this.velocity);
      this.setPosition(newPos);
    } else {
      this.isActive = true;
    }
  },

  onCollisionPlayer: function(player) {
    //console.log("colliding with player");
    // find center of player
    var pBall = this.getPosition();
    var sizeBall = this.getContentSize();

    var pPlayer = player.getPosition();
    var sizePlayer = player.getContentSize();

    // -1 at far left of player paddle, 1 at far right
    var dx = (pBall.x - pPlayer.x);
    var halfWidth = (sizePlayer.width / 2.0);
    var ratio =  dx / halfWidth;

    // console.log(dx, halfWidth, ratio);
    this.velocity = cc.p(this.speed * ratio, -this.velocity.y);
  },

  // determineBounceVelocity - from other implementations of breakouts
  determineBounceVelocity: function() {

  },

});


Ball.create = function() {
  var node = new Ball();
  if (node && node.init()) {
    return node;
  }
  return null;
}