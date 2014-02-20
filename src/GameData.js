// global data namespaced into G for "Game"
var G = {

  // store current key states
  KEYS: [],

  // key mapping
  KEY: {},
  KEYMAP: {},

  currentLevel: 0,

};

// TODO: prob could also refactor this into an input handler, but for this simple game not necessary
// TODO: this doesn't really help much, meant for ability to keymap, so should have array of KEY codes for each input action
// - for example could have G.KEY.LEFT = [cc.KEY.w,cc.KEY.left]
G.KEY = {};
if (cc.KEY) {
  G.KEY.w = cc.KEY.w;
  G.KEY.s = cc.KEY.s;
  G.KEY.a = cc.KEY.a;
  G.KEY.d = cc.KEY.d;

  G.KEY.i = cc.KEY.i;
  G.KEY.k = cc.KEY.k;
  G.KEY.j = cc.KEY.j;
  G.KEY.l = cc.KEY.l;

  G.KEY.q = cc.KEY.q;
  G.KEY.e = cc.KEY.e;
  G.KEY.x = cc.KEY.x;
  G.KEY.z = cc.KEY.z;
  G.KEY.space = cc.KEY.space;
  G.KEY.up = cc.KEY.up;
  G.KEY.down = cc.KEY.down;
  G.KEY.left = cc.KEY.left;
  G.KEY.right = cc.KEY.right;
}

// String Constants
G.STRINGS = {
  DONE: 'DONE',
};

// TODO: improve asset management, both redundant and unorganized currently (following cocos2d example)
// TODO: implement better sound management to determine which format works, use one filename without extension
// Resource Vars
var json_bgConfig = "res/bg.json";
var tmx_bgTmx = "res/bg.tmx";
var img_bgImage = "res/bg_prerendered.png";
var img_logo = "res/logo.png";
var img_tiles = "res/tiles.png";
var snd_brickDeath = "res/sfx/brickDeath.mp3";
var snd_countdownBlip = "res/sfx/countdownBlip.mp3";
var snd_powerdown = "res/sfx/powerdown.mp3";
var snd_powerup = "res/sfx/powerup.mp3";
var snd_recover = "res/sfx/recover.mp3";

// sheets
var s_iso_outside = "res/sheets/iso-64x64-outside.png";

// tilemaps

// TODO: need to fix js formatter to support keeping single line object literals/declarations???
var g_resources = [{
  src: json_bgConfig
}, {
  src: tmx_bgTmx
}, {
  src: img_bgImage
}, {
  src: img_logo
}, {
  src: img_tiles
}, {
  src: snd_brickDeath
}, {
  src: snd_countdownBlip
}, {
  src: snd_powerdown
}, {
  src: snd_powerup
}, {
  src: snd_recover
}];


var r = 'red';
var b = 'blue';
var o = 'orange';
var g = 'green';
var X = null;

G.mapLevels = [{
  name: "letsa begin",
  bricks: [
    [X, X, g, o, g, X, X],
    [o, b, g, g, g, b, o],
    [X, b, b, b, b, b, X]
  ],
  powerups: 1,
  powerdowns: 1
}, {
  name: "how's it going?",
  bricks: [
    [X, g, o, g, o, g, X],
    [X, b, b, b, b, b, X],
    [g, b, r, b, r, b, g],
    [g, b, b, b, b, b, g],
    [g, b, X, X, X, b, g],
    [X, b, b, b, b, b, X]
  ],
  powerups: 1,
  powerdowns: 1
}, {
  name: 'tie fighta!',
  bricks: [
    [X, b, X, g, X, b, X],
    [b, X, b, o, b, X, b],
    [b, g, b, o, b, g, b],
    [b, X, b, o, b, X, b],
    [X, b, X, X, X, b, X],
    [r, X, r, X, r, X, r]
  ],
  powerups: 2,
  powerdowns: 2
}, {
  name: 'swirl',
  bricks: [
    [r, g, o, b, r, g, o],
    [b, X, X, X, X, X, X],
    [o, X, o, b, r, g, o],
    [g, X, g, X, X, X, b],
    [r, X, r, X, r, X, r],
    [b, X, b, o, g, X, g],
    [o, X, X, X, X, X, o],
    [g, r, b, o, g, r, b]
  ],
  powerups: 2,
  powerdowns: 3
}];