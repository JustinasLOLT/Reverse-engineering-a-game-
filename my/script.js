const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 1024;

const key = [];

const player = {
  x: 0,
  y: 0,
  width: 32,
  height: 52,
  frameX: 0,
  frameY: 0,
  speed: 9,
  moving: false,
};

const playerSprite = new Image();
playerSprite.src = 'img/albertsimon.png';

//https://www.youtube.com/watch?v=EYf_JwzwTlQ 9:36
