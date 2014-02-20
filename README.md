# Breakouts (Cocos2D HTML 2.x)

A Cocos2d-html implementation of the breakouts tutorial game.

## Overview

This is a sample breakout game written in Cocos2D HTML. The latest version is 2.2.2 and this will be updated or forked when 3.0 is released. This version is built to run in both desktop and mobile browsers, but can also be used as the basis for native Android/iOS/Mac/Win7/WinRT/Linux (TODO: need to confirm platform support) apps with only a few modifictions using the Javascript Bindings (jsb) supported with Mozilla's SpiderMonkey Javscript engine.

## Controls

The player paddle can be controlled ...

## Other Breakouts

All of the Breakouts are up and playable at this project's [website](http://jsbreakouts.org)

### Turning on or off prerendering the background

To have the engine use a tilemap for rendering background add the query string "usetiles".
* http://host/path/index.html?usetiles   <---- will create the background via individual tiles

**NOTE:** A mobile device will always use the prerendered background, even if `usetiles` is set. Tiles on mobile devices tend to kill performance quite a bit

## License

MIT. Generally speaking, feel free to do whatever you want with it.
