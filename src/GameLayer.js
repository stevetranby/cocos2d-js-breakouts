// Globals, could move into G object or move into GameLayer class
var ZORDER_BOARD = 0;
var ZORDER_BRICKS = 1;
var ZORDER_BALL = 2;
var ZORDER_PLAYER = 3;
var ZORDER_HUD = 10;

var GameLayer = cc.Layer.extend({

  currentLevel: 0,
  lives: 3,
  score: 0,
  countdown: 3.5,

  boardLayer: null,
  hudLayer: null,
  brickLayer: null,

  player: null,
  balls: [],
  bricks: [],
  powerups: [],

  isCountdown: true,

  init: function() {

    // for clarity
    var selfPointer = this;

    this._super();

    var ws = cc.Director.getInstance().getWinSize();

    // reset level in case we're coming from game over scene
    G.currentLevel = 0;

    var usingTiles = false;
    if (usingTiles) {
      // TODO: change tiles
      console.log("using tiles");
    } else {
      this.boardLayer = cc.Sprite.create(img_bgImage);
      this.boardLayer.setAnchorPoint(cc.p(0.5, 0.5));
      this.boardLayer.setPosition(cc.p(ws.width / 2.0, ws.height / 2.0));
      this.boardLayer.ignoreAnchorPointForPosition(false);
      this.addChild(this.boardLayer, ZORDER_BOARD);
    }

    this.hudLayer = new HudLayer();
    this.hudLayer.init(selfPointer);
    this.addChild(this.hudLayer, ZORDER_HUD);

    this.resetLevel();

    return true;
  },

  onEnter: function() {
    this._super();

    console.log("enter");

    // TODO: check for keyboard support using platform info
    if (this.setKeyboardEnabled)
      this.setKeyboardEnabled(true);

    // TODO: add mouse support for hover move (when no buttons down)
    if (this.setMouseEnabled)
      this.setMouseEnabled(true);

    this.scheduleUpdate();
  },

  // dt - delta time, we're updating as if fixed time
  update: function(dt) {

    // update children
    this.player.update(dt);

    if (this.isCountdown) {
      var c = Math.floor(this.countdown);
      this.countdown -= dt;
      if (this.countdown < 0) {
        this.isCountdown = false;
        this.countdown = 0;
      } else {
        if (c !== Math.floor(this.countdown)) {
          cc.AudioEngine.getInstance().playEffect(snd_countdownBlip);
          this.hudLayer.refresh(this);
        }
      }
    } else {

      var n = this.balls.length;
      for (var i = 0; i < n; i++) {
        var ball = this.balls[i];
        if(ball)
          ball.update(dt);
      }

      n = this.powerups.length;
      for (var i = 0; i < n; i++) {
        this.powerups[i].update(dt);
      }

      this.checkCollisions();

      if (!this.hasActiveBricks()) {
        // TODO: reset and start next level
        console.log("resetting to next level");
        this.nextLevel();
      }
    }

    // remove all inactives
    // TODO: fill up arrays of objects to destroy and remove in single pass 
    //        using reverse iteration and .splice()
    for (var i = 0; i < this.balls.length; i++) {
      var ball = this.balls[i];
      if (ball && !ball.isActive) {
        cc.ArrayRemoveObject(this.balls, ball);
      }
    }
    for (var i = 0; i < this.bricks.length; i++) {
      var brick = this.balls[i];
      if (brick && !brick.isActive) {
        cc.ArrayRemoveObject(this.bricks, brick);
      }
    }
    for (var i = 0; i < this.powerups.length; i++) {
      var powerup = this.powerups[i];
      if (powerup && !powerup.isActive) {
        cc.ArrayRemoveObject(this.powerups, powerup);
      }
    }
  },


  //////////////////////////////////////////////////////
  /// Input 
  //////////////////////////////////////////////////////

  onKeyDown: function(e) {
    G.KEYS[e] = true;
  },

  onKeyUp: function(e) {
    G.KEYS[e] = false;

    // REFACTOR
    // TODO: simulate keypress instead and handle in update method
    // I would prefer to not handle input here, rather add state to trigger keypress event instead 
    this.onKeyPress(e);
  },

  onKeyPress: function(e) {
    console.log(e);
    // handle input - need to get pressed
    if (e === cc.KEY.left) {
      this.prevLevel();
    } else if (e === cc.KEY.right) {
      this.nextLevel();
    }
  },

  movePlayer: function(location) {
    var newPosition = cc.p(location.x, this.player.getPosition().y);
    this.player.setPosition(newPosition);
  },

  onMouseMoved: function(event) {
    this.movePlayer(event.getLocation());
  },

  onScrollWheel: function(event) {},

  // touches contains location in screen coords (luckily same as our world coords)
  onTouchesBegan: function(touches, event) {},
  onTouchesMoved: function(touches, event) {
    this.movePlayer(touches[0].getLocation());
  },
  onTouchesEnded: function(touches, event) {},
  onTouchesCancelled: function(touches, event) {},

  //////////////////////////////////////////////////////
  /// Input
  //////////////////////////////////////////////////////

  hasActiveBalls: function() {
    // TODO: refactor to bricks.length having spliced out the inactives (this.removeBricks() at end of update)
    var n = this.balls.length;
    for (var i = 0; i < n; i++) {
      var ball = this.balls[i];
      if (ball && ball.isActive) {
        return true;
      }
    }
    return false;
  },

  hasActiveBricks: function() {
    // TODO: refactor to bricks.length having spliced out the inactives (this.removeBricks() at end of update)
    var n = this.bricks.length;
    for (var i = 0; i < n; i++) {
      var brick = this.bricks[i];
      if (brick && brick.isActive) {
        return true;
      }
    }
    return false;
  },

  checkCollisionsWalls: function(ball) {
    // check boundary "walls"
    var pBall = ball.getPosition();
    var sizeBall = ball.getBoundingBox();
    var brect = this.boundaryRect;

    if (pBall.x - sizeBall.width / 2.0 < brect.x) {
      ball.setPosition(cc.p(brect.x + sizeBall.width / 2.0 + 1, pBall.y));
      ball.velocity.x = -ball.velocity.x;
    } else if (pBall.x + sizeBall.width / 2.0 > brect.x + brect.width) {
      ball.setPosition(cc.p(brect.x + brect.width - sizeBall.width / 2.0 - 1, pBall.y));
      ball.velocity.x = -ball.velocity.x;
    } else if (pBall.y - sizeBall.height / 2.0 < brect.y) {
      // destroy ball
      ball.isActive = false;
      ball.removeFromParent();
      if (!this.hasActiveBalls()) {
        console.log("lose life");
        this.lives--;
        if (this.lives > 0) {
          this.resetGame();
          // TODO: remove from balls array
        } else {
          this.onGameOver();
        }
      }
    } else if (pBall.y + sizeBall.height / 2.0 > brect.y + brect.height) {
      ball.setPosition(cc.p(pBall.x, brect.y + brect.height - sizeBall.height / 2.0 - 1));
      ball.velocity.y = -ball.velocity.y;
    }
  },

  bounceOffBrick: function(ball, brick) {

    var p1 = ball.getPosition();
    var p2 = brick.getPosition();
    var r1 = ball.getBoundingBox();
    var r2 = brick.getBoundingBox();

    if (ball.velocity.x > 0 && cc.rectContainsPoint(r2, cc.p(p1.x + r1.width / 2.0, p1.y))) {
      // ball.velocity.x = -Math.abs(ball.velocity.x);
      ball.velocity.x *= -1;
      ball.setPosition(ball.prevPosition.x, p1.y);
    } else if (ball.velocity.x < 0 && cc.rectContainsPoint(r2, cc.p(p1.x - r1.width / 2.0, p1.y))) {
      // ball.velocity.x = Math.abs(ball.velocity.x);
      ball.velocity.x *= -1;
      ball.setPosition(ball.prevPosition.x, p1.y);
    } else if (ball.velocity.y > 0 && cc.rectContainsPoint(r2, cc.p(p1.x, p1.y + r1.height / 2.0))) {
      // ball.velocity.y = -Math.abs(ball.velocity.y);
      ball.velocity.y *= -1;
      ball.setPosition(p1.x, ball.prevPosition.y);
    } else if (ball.velocity.y < 0 && cc.rectContainsPoint(r2, cc.p(p1.x, p1.y - r1.height / 2.0))) {
      // ball.velocity.y = Math.abs(ball.velocity.y);
      ball.velocity.y *= -1;
      ball.setPosition(p1.x, ball.prevPosition.y);
    }

    cc.AudioEngine.getInstance().playEffect(snd_brickDeath);
  },

  // TODO: refactor into brick class
  // 
  // Support better collision detection with multiple bounce 
  // http://codeincomplete.com/posts/2011/6/12/collision_detection_in_breakout/
  // 
  // or use Box2d
  // 
  // better yet just support all three: Dumb, Recursive, Physics
  // 
  checkCollisionsBricks: function(ball) {
    // check bricks
    var nBricks = this.bricks.length;
    for (var j = nBricks - 1; j >= 0; j--) {
      var brick = this.bricks[j];
      if (brick && brick.isActive) {
        if (cc.rectIntersectsRect(ball.getBoundingBox(), brick.getBoundingBox())) {

          // TODO: send event to increase score instead
          this.score += brick.getValue();
          this.hudLayer.refresh(this);


          this.bounceOffBrick(ball, brick);

          // destroy brick
          //TODO: refactor to brick.destroy();

          if (brick.hasPowerup || brick.hasPowerdown) {
            // spawn powerup
            var powerup = new Powerup();
            var type = brick.hasPowerup ? POWERUP_TYPE_ADDBALL : POWERUP_TYPE_SHRINK;
            powerup.init(type);
            powerup.setPosition(brick.getPosition());
            this.powerups.push(powerup);
          }


          var fade = cc.FadeOut.create(0.75);
          var scale = cc.ScaleTo.create(0.25, 0.75);
          var seq = cc.Sequence.create(scale, cc.RemoveSelf.create());
          brick.runAction(seq);
          brick.runAction(fade);
          brick.isActive = false;
          // should remove entities at end of frame if inactive
          // this.bricks.splice(j, 1);

          return;
        }
      }
    }
  },

  checkCollisions: function() {
    // check each ball to player
    var nBalls = this.balls.length;
    for (var i = 0; i < nBalls; i++) {
      var ball = this.balls[i];
      if (!ball || !ball.isActive)
        continue;

      // ball collides into paddle at bottom center (create a smaller bounding box)
      var bottomCenter = cc.p(ball.getPosition().x, ball.getPosition().y - ball.getContentSize().height / 2.0);
      if (cc.rectContainsPoint(this.player.getBoundingBox(), bottomCenter)) {
        ball.onCollisionPlayer(this.player);
      }

      this.checkCollisionsWalls(ball);
      this.checkCollisionsBricks(ball);
    }

    var nPowerups = this.powerups.length;
    for (var i = 0; i < nPowerups; i++) {
      var powerup = this.powerups[i];
      if (!powerup || !powerup.isActive)
        continue;

      // ball collides into paddle at bottom center (create a smaller bounding box)
      var bottomCenter = cc.p(powerup.getPosition().x, powerup.getPosition().y - powerup.getContentSize().height / 2.0);
      if (cc.rectContainsPoint(this.player.getBoundingBox(), bottomCenter)) {
        if (powerup.type === POWERUP_TYPE_ADDBALL) {
          // spawn extra ball
          console.log("spawning extra ball");
          this.spawnBall();
          cc.AudioEngine.getInstance().playEffect(snd_powerup);
        } else if (powerup.type === POWERUP_TYPE_SHRINK) {
          console.log("shrinking player");
          this.player.shrink();
          cc.AudioEngine.getInstance().playEffect(snd_powerdown);
        }

        powerup.isActive = false;
        powerup.removeFromParent();
      }
    }
  },

  setupBoard: function() {

    this.brickOffset = cc.p(64, 200);
    this.boundaryRect = cc.rect(16, 16, 320 - 32, 416 - 32);

    this.boardLayer.removeAllChildren();
    this.bricks = [];
    this.powerups = [];

    // Add bricks
    var level = G.mapLevels[this.currentLevel];

    var rows = level.bricks.length;
    console.log("loading level [" + level.name + "] with " + rows + " rows");
    for (var r = 0; r < rows; r++) {
      var cols = level.bricks[r].length;
      for (var c = 0; c < cols; c++) {
        var brickType = level.bricks[r][c];

        if (!brickType)
          continue;

        var brick = new Brick();
        brick.init(brickType);

        var size = brick.getContentSize();
        var x = this.brickOffset.x + c * size.width;
        var y = this.brickOffset.y + r * size.height;

        brick.setPosition(cc.p(x, y));
        this.boardLayer.addChild(brick);
        this.bricks.push(brick);

        //console.log("brick placed at {" + x + "," + y + "}");
      }
    }

    if (this.bricks.length > 2) {
      for (var i = 0; i < level.powerups; i++) {
        var found = false;
        do {
          var b = getRandomInt(this.bricks.length - 1);
          var brick = this.bricks[b];
          console.log(b, brick);
          if (!brick.hasPowerup) {
            brick.hasPowerup = true;
            found = true;
          }
        }
        while (!found);
      }

      for (var i = 0; i < level.powerdowns; i++) {
        var found = false;
        do {
          var b = getRandomInt(this.bricks.length - 1);
          var brick = this.bricks[b];
          if (!brick.hasPowerdown) {
            brick.hasPowerdown = true;
            found = true;
          }
        }
        while (!found);
      }
    }
  },

  resetLevel: function() {

    this.currentLevel = G.currentLevel;

    this.setupBoard();

    this.player = Player.create();
    if (this.player) {
      this.boardLayer.addChild(this.player, ZORDER_PLAYER);
    }

    this.resetGame();
  },

  spawnBall: function() {
    var ball = Ball.create();
    if (ball) {
      this.balls.push(ball);
      this.boardLayer.addChild(ball, ZORDER_BALL);
    }
  },

  resetGame: function() {
    for (var i = 0; i < this.balls.length; i++) {
      var ball = this.balls[i];
      if (ball)
        ball.removeFromParent();
    }

    this.balls = [];
    this.spawnBall();

    // add back in countdown
    this.isCountdown = true;
    this.countdown = 3.5;
    this.hudLayer.refresh(this);

    cc.AudioEngine.getInstance().playEffect(snd_recover);
  },

  prevLevel: function() {
    G.currentLevel--;
    if (G.currentLevel >= 0) {
      this.resetLevel();
    } else {
      // goto "MASTER" scene
    }
  },

  nextLevel: function() {
    G.currentLevel++;
    if (G.currentLevel < G.mapLevels.length) {
      this.resetLevel();
    } else {
      // goto "MASTER" scene
    }
  },

  onGameOver: function() {
    var scene = GameOverLayer.scene();
    // cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.0, scene));
    cc.Director.getInstance().replaceScene(scene);
  },
});


// Factory Methods to support auto init
GameLayer.create = function() {
  var layer = new GameLayer();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

// Create a simple scene
GameLayer.scene = function() {
  var scene = cc.Scene.create();
  var layer = GameLayer.create();
  scene.addChild(layer);
  return scene;
};