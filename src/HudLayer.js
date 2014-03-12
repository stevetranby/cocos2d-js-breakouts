var TAG_CONTEXT_MENU = 1;
var TAG_LOG_LABEL = 5;
var TAG_INFO_LABEL = 6;

var HudLayer = cc.Layer.extend({

  // eventually notification events used instead of direct dependency
  gameLayer: null,
  infoLabel: null,
  countdownLabel: null,
  countdownSprite: null,

  init: function(pGameLayer) {

    this._super();

    this.gameLayer = pGameLayer;

    var ws = cc.Director.getInstance().getWinSize();

    this.infoLabel = cc.LabelTTF.create("lives: n/a score: n/a level: n/a", "Helvetica, Arial", 20.0);
    this.infoLabel.setColor(cc.BLACK);
    this.infoLabel.setAnchorPoint(cc.p(0.5, 0));
    this.infoLabel.setPosition(cc.p(ws.width/2.0, 0));
    this.addChild(this.infoLabel);

    this.countdownLabel = cc.LabelTTF.create("3", "Arial", 72.0);
    this.countdownLabel.setColor(cc.BLACK);
    this.countdownLabel.setAnchorPoint(cc.p(0.5, 0.5));
    this.countdownLabel.setPosition(cc.p(ws.width/2.0, ws.height/3.0));
    this.addChild(this.countdownLabel);
  },

  onEnter: function() {
    this._super();
  },

  // TODO: should only update on change
  refresh: function(game) {
    if(game.countdown >= 1.0) {
      this.countdownLabel.setString("" + Math.floor(game.countdown));
    } else {
      this.countdownLabel.setString("");
      //this.countdownLabel.removeFromParent();
    }

    var level = game.currentLevel + 1;
    this.infoLabel.setString("lives: " + game.lives + ", score: " + game.score + ", level: " + level);
  },
});
