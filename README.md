# Breakouts (Cocos2D HTML 2.x)

A Cocos2d-html implementation of the breakouts tutorial game.

All of the other implementations are up and playable at: http://jsbreakouts.org/

## Overview

This is a sample breakout game written in Cocos2D HTML. The latest version is 2.2.2 and this will be updated or forked when 3.0 is released. This version is built to run in both desktop and mobile browsers, but can also be used as the basis for native Android/iOS/Mac/Win7/WinRT/Linux (TODO: need to confirm platform support) apps with only a few modifictions using the Javascript Bindings (jsb) supported with Mozilla's SpiderMonkey Javscript engine.

**TODO**

- [x] Add frame animations to ball
- [x] Add support for loading as tilemap (.tmx)
- [ ] Add support for loading as tilemap (.json)
- [x] Add Initial Menu/Text Scene
- [x] Add Master Menu/Text Scene
- [ ] Need to refactor GameLayer to move collisions into
- [ ] Improve Collision Detection (support recursive check for accuracy)
- [ ] Add support for building with Grunt into single minified .js file
- [ ] Check mobile support, add touch support as input method
- [ ] Write simple blog post regarding this implementation, mini tutorial or preface to future more tutorial

**Wishlist**

- Show touches with screen->world/node coord transformation
- Add collisions between balls (optional)
- Add tests within Grunt build support (optional)
- Add support for requirejs/browserify/AMD require
- Add support for audio asset management with wav/off/mp3 format detection if necessary

### License

MIT. Generally speaking, feel free to do whatever you want with it.

### Changelog

**Version: 0.1 (2014-19-2014)**
- Powerups added
- Simple collision support between ball and walls/paddle/bricks
- Brick destroy animation
