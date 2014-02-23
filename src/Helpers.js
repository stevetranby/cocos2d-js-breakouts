// Author: Steve Tranby
// Desc:
// Notes: need to refactor into library

// Create enum without specifying actual values
// when specific integers are unecessary
// more complete version: https://github.com/rauschma/enums
function Enum() {
  for (var i = 0; i < arguments.length; i++) {
    this[arguments[i]] = i;
  }

  if (Object.freeze)
    Object.freeze(this);
}

// array.length = 0 is slower than pop all elements
// according to jsperf test: http://jsperf.com/array-destroy/32
function ClearArray(arr) {
  while (arr.length > 0) {
    arr.pop();
  }
}

function lerp(a, b, u) {
  return (1 - u) * a + u * b;
}

// get parameter out of query string
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var seed = getParameterByName("rngseed");
if (seed)
  console.log("seed = " + seed);

if (seed !== "") {
  seed = Math.seedrandom(seed);
} else {
  Math.seedrandom();
  seed = Math.random().toString(36).slice(2, 20);
  //seed = Math.random().toString(10).slice(2);
  Math.seedrandom(seed);
}
console.log("rng seed: " + seed);

// Returns a random number between 0 (inclusive) and 1 (exclusive)
function getRandom() {
  return Math.random();
}
// Returns a random number between min and max
function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}
// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(max) {
  return getRandomIntRange(0,max);
}
function getRandomIntRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
