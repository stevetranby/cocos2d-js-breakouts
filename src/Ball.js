var Ball = cc.Sprite.extend({

  type: "ball",
  isActive: true,
  speed: 170.0 / 60.0,
  velocity: cc.p(0, 0),
  prevPosition: cc.p(0, 0),

  //////

  init: function() {
    // TODO: need to put into global, or reference gameLayer, or pass into init
    this.boundaryRect = cc.rect(48, 48, 320 - 48, 416 - 48);

    this._super(img_tiles, cc.rect(48, 64, 16, 16));

    this.startAnimation();

    return true;
  },

  // NOTE: this._super() is crucial to make sure you add to overridden methods
  //  * unless you know what you're doing. actions won't start if you
  //    implement onEnter, but forget this._super() call, for example
  onEnter: function() {
    this._super();
    this.resetBall();
  },

  // refactor into a cocos2d helper class
  startAnimation: function() {
    // create action for sprite frame-based animation
    // (could also change texture rect in the update method after timer
    //  expires which is basically what the action does for you, depends
    //  on how much control you want)

    // TODO: show many ways, as well as others like separate images,
    //       import from json anim config file

    this.stopActionByTag(101);
    var animFrames = [
      cc.SpriteFrame.create(img_tiles, cc.rect(48, 64, 16, 16)),
      cc.SpriteFrame.create(img_tiles, cc.rect(48 + 16, 64, 16, 16)),
      cc.SpriteFrame.create(img_tiles, cc.rect(48 + 16 * 2, 64, 16, 16)),
      cc.SpriteFrame.create(img_tiles, cc.rect(48 + 16 * 3, 64, 16, 16))
    ];
    var anim = cc.Animation.create(animFrames, 0.1);
    var animAction = cc.RepeatForever.create(cc.Animate.create(anim));
    var loopAction = cc.RepeatForever.create(animAction);
    loopAction.setTag(101);
    this.runAction(loopAction);
  },

  resetBall: function() {
    var ws = cc.Director.getInstance().getWinSize();
    //var xstart = getRandomRange(this.boundaryRect.x, this.boundaryRect.width);
    var xstart = 58;
    var ystart = 200;
    this.startPosition = cc.p(xstart, ystart);
    this.setPosition(this.startPosition);
    this.velocity = cc.p(this.speed, -this.speed);
  },

  update: function(dt) {
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
    var sizeBall = this.getBoundingBox();

    var pPlayer = player.getPosition();
    var sizePlayer = player.getBoundingBox();

    // -1 at far left of player paddle, 1 at far right
    var dx = (pBall.x - pPlayer.x);
    var halfWidth = (sizePlayer.width / 2.0);
    var ratio = dx / halfWidth;

    // console.log(dx, halfWidth, ratio);
    this.velocity = cc.p(this.speed * ratio, -this.velocity.y);

    this.setPosition(pBall.x, pPlayer.y + sizePlayer.height/2.0 + sizeBall.height/2.0);
    this.prevPosition = this.getPosition();
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
