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

  space: null, // physics world space
  usingPhysics: false,

  init: function() {

    // for clarity
    var selfPointer = this;

    this._super();

    var ws = cc.Director.getInstance().getWinSize();

    // reset level in case we're coming from game over scene
    G.currentLevel = 0;

    this.usingPhysics = (location.search.indexOf("usephysics") != -1);
    this.usingTiles = (location.search.indexOf("usetiles") != -1);


    if (this.usingTiles) {
      // console.log("using tiles");
      this.boardTilesLayer = cc.TMXTiledMap.create(tmx_bgTmx);
      this.boardTilesLayer.setAnchorPoint(cc.p(0.5, 0.5));
      this.boardTilesLayer.setPosition(cc.p(ws.width / 2.0, ws.height / 2.0));
      this.boardTilesLayer.ignoreAnchorPointForPosition(false);
      this.addChild(this.boardTilesLayer, ZORDER_BOARD);

      this.boardLayer = cc.Layer.create();
      // this.boardLayer.setContentSize(cc.size(ws.width,ws.height));
      this.boardLayer.setAnchorPoint(cc.p(0.5, 0.5));
      this.boardLayer.setPosition(cc.p(ws.width / 2.0, ws.height / 2.0));
      this.boardLayer.ignoreAnchorPointForPosition(false);
      this.addChild(this.boardLayer, ZORDER_BOARD);
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
    if ('touches' in sys.capabilities) {
      this.setTouchEnabled(true);
    }
    if ('mouse' in sys.capabilities) {
      this.setMouseEnabled(true);
    }

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
        if (ball)
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
  onTouchesBegan: function(touches, event) {
    this.movePlayer(touches[0].getLocation());
  },
  onTouchesMoved: function(touches, event) {
    this.movePlayer(touches[0].getLocation());
  },
  onTouchesEnded: function(touches, event) {
    this.movePlayer(touches[0].getLocation());
  },
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
    var size1 = ball.getContentSize();
    var size2 = brick.getContentSize();
    var rect1 = ball.getBoundingBox();
    var rect2 = brick.getBoundingBox();

    // get which quadrant
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;

    console.log(size1, size2, p1, p2);

    var maxDist = size1.width * 0.9;

    // top left
    if (dx < 0 && dy >= 0) {
      // is within ball radius of left side
      var dist = cc.pDistance(p1, cc.p(p2.x - size2.width/2.0, p2.y));
      console.log(dist);
      if (dist < maxDist) {
        console.log("left side of ball");
        ball.velocity.x *= -1;
        ball.setPosition(ball.prevPosition.x, p1.y);
      } else {
        console.log("top of ball");
        ball.velocity.y *= -1;
        ball.setPosition(p1.x, ball.prevPosition.y);
      }
    }
    // top right
    else if (dx >= 0 && dy >= 0) {
      // is within ball radius of left side
      var dist = cc.pDistance(p1, cc.p(p2.x + size2.width/2.0, p2.y));
      console.log(dist);
      if (dist < maxDist) {
         console.log("right side of ball");
        ball.velocity.x *= -1;
        ball.setPosition(ball.prevPosition.x, p1.y);
      } else {
        console.log("top of ball");
        ball.velocity.y *= -1;
        ball.setPosition(p1.x, ball.prevPosition.y);
      }
    }
    // bot left
    else if (dx < 0 && dy < 0) {
      // is within ball radius of left side
      var dist = cc.pDistance(p1, cc.p(p2.x - size2.width/2.0, p2.y));
      console.log(dist);
      if (dist < maxDist) {
        console.log("left side of ball");
        ball.velocity.x *= -1;
        ball.setPosition(ball.prevPosition.x, p1.y);
      } else {
        console.log("bottom of ball");
        ball.velocity.y *= -1;
        ball.setPosition(p1.x, ball.prevPosition.y);
      }
    }
    // bot right
    else if (dx >= 0 && dy < 0) {
      // is within ball radius of right side
      var dist = cc.pDistance(p1, cc.p(p2.x + size2.width/2.0, p2.y));
      console.log(dist);
      if (dist < maxDist) {
        console.log("right side of ball");
        ball.velocity.x *= -1;
        ball.setPosition(ball.prevPosition.x, p1.y);
      } else {
        console.log("bottom of ball");
        ball.velocity.y *= -1;
        ball.setPosition(p1.x, ball.prevPosition.y);
      }
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
    var closestBrick = null;
    var closestDist = 99999;//Math.IntMax;
    var nBricks = this.bricks.length;
    for (var j = nBricks - 1; j >= 0; j--) {
      var brick = this.bricks[j];
      if (brick && brick.isActive) {
        // TODO: shrink ball bounding box, or implement circle to rect intersect
        var dist = cc.pDistance(ball.getPosition(), brick.getPosition());
        if (dist < closestDist && cc.rectIntersectsRect(ball.getBoundingBox(), brick.getBoundingBox())) {
          closestBrick = brick;
          closestDist = dist;
        }
      }
    }

    if(closestBrick) {
      // TODO: send event to increase score instead
      this.score += closestBrick.getValue();
      this.hudLayer.refresh(this);


      this.bounceOffBrick(ball, closestBrick);

      // destroy brick
      //TODO: refactor to closestBrick.destroy();

      if (closestBrick.hasPowerup || closestBrick.hasPowerdown) {
        // spawn powerup
        var powerup = new Powerup();
        var type = closestBrick.hasPowerup ? POWERUP_TYPE_ADDBALL : POWERUP_TYPE_SHRINK;
        powerup.init(type);
        powerup.setPosition(closestBrick.getPosition());
        this.powerups.push(powerup);
        this.addChild(powerup, ZORDER_BALL);
      }


      var fade = cc.FadeOut.create(0.75);
      var scale = cc.ScaleTo.create(0.25, 0.75);
      var seq = cc.Sequence.create(scale, cc.RemoveSelf.create());
      closestBrick.runAction(seq);
      closestBrick.runAction(fade);
      closestBrick.isActive = false;
      // should remove entities at end of frame if inactive
      // this.closestBrick.splice(j, 1);

      return;
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

    this.brickOffset = cc.p(64, 336);
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
        var y = this.brickOffset.y - r * size.height;

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
