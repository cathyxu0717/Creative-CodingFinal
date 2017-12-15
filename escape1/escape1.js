var start = false;
var lose = false; 
var BALL_AMT_MIN = 10;
var BALL_AMT_MAX = 50;
var NEAR_DISTANCE = 100;
var player, ball;
var balls = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  var j = int(random(BALL_AMT_MAX))+BALL_AMT_MIN;
  for (var i =0; i< j; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(237, 213, 219);
  player.display();

  if (start == true & lose == false) {
    for (var i=0; i< balls.length; i++) {
      var curBall = balls[i];

      //detect if  too close
      if (closeToPlayer(curBall)) {
        curBall.changeDangerColor();
      } else {
        curBall.changeBackColor();
      }
      // detect collision for each ball
      if (collision(curBall)) {
        if (isPlayerBigger(curBall)) {
          player.eat(curBall);
          curBall.die();
        } else {
          lose = true;
        }
      }

      // detect out of frame
      if (curBall.outOfFrame()) {
        curBall.die();
      }

      // display
      if (!curBall.isDead()) {
        curBall.display();
      }
    }

    //refresh balls if dead
    for (var i=balls.length-1; i>=0; i--) {
      if (balls[i].isDead()) {
        balls.splice(i, 1);
        balls.push(new Ball());
      }
    }
  }
}


function keyPressed() {
  if (lose == true) {
    // refresh all balls
    balls = [];
    var j = int(random(BALL_AMT_MAX))+BALL_AMT_MIN;
    for (var i =0; i< j; i++) {
      balls.push(new Ball());
    }
    lose = false;
    // refresh player
    player = new Player();
  }
}

function mouseMoved() {
  if (start == false & lose == false)start = true;
}

function collision(ball) {                   // check if the player run into any balls
  var ballX = ball.getX();
  var ballY = ball.getY();
  var ballRad = ball.getRad();
  if (dist(ballX, ballY, mouseX, mouseY)<ballRad/2) {
    return true;
    //}
  } else {
    return false;
  }
  //return (pow(ballX-mouseX, 2) + pow(ballY - mouseY, 2)) <= pow(ballRad/2+player.getRad()/2, 2);
}

function isPlayerBigger(ball) {             // check if the player is bigger than the ball or not
  if (player.getRad()>ball.getRad()) {
    return true;
  } else {
    return false;
  }
}

function closeToPlayer (ball) {            // check if the current ball is close to the player or not
  var ballX = ball.getX();
  var ballY = ball.getY();
  var ballRad = ball.getRad();
  //if ((pow(ballX-mouseX,2) + pow(ballY - mouseY,2)) - pow(ballRad/2+player.getRad()/2,2) < pow(NEAR_DISTANCE,2)){
  if (dist(ballX, ballY, mouseX, mouseY)<ballRad & isPlayerBigger(ball) == false) {
    return true;
  } else {
    return false;
  }
}

function Ball() {                          // class Ball
  this.rad = random(300);
  this.startPos = int(random(4));    
  this.dir = random(-1, 1);
  this.r = int(random(120, 140));
  this.g = int(random(160, 190));
  this.b = int(random(200, 230));
  this.prevR = this.r;
  this.prevG = this.g;
  this.prevB = this.b;
  this.t = int(this.rad);
  this.speed = 2;
  this.dead = false;
  
  // start position of the ball
  if (this.startPos == 0) {               // top
    this.x = random(width);
    this.y = 0 - this.rad/2;
  } else if (this.startPos == 1) {        // right
    this.x = width + this.rad/2;
    this.y = random(height);
  } else if (this.startPos == 2) {        // bottom
    this.x = random(width);
    this.y = height + this.rad/2;
  } else {                                // left
    this.x = 0 - this.rad/2;
    this.y = random(height);
  }


  this.display = function() {             // display the ball
    noStroke();    
    fill(this.r, this.g, this.b, this.t);
    ellipse(this.x, this.y, this.rad, this.rad);
    this.move();
  }

  this.move = function () {               // move the ball         
    if (this.startPos==0) {
      this.moveX(this.dir * this.speed);
      this.moveY(this.speed);
    } else if (this.startPos == 1) {
      this.moveX(-this.speed);
      this.moveY(this.dir * this.speed);
    } else if (this.startPos == 2) {
      this.moveX(this.dir * this.speed);
      this.moveY(-this.speed);
    } else {
      this.moveX(this.speed);
      this.moveY(this.dir * this.speed);
    }
  }

  this.moveX = function(xx) {
    this.x += xx;
  }

  this.moveY = function(yy) {
    this.y += yy;
  }

  this.outOfFrame = function() {
    if (this.startPos==0) {
      if (this.y-this.rad/2>height) {
        return true;
      } else {
        return false;
      }
    } else if (this.startPos == 1) {
      if (this.x+this.rad/2<0) {
        return true;
      } else {
        return false;
      }
    } else if (this.startPos == 2) {
      if (this.y+this.rad/2<0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.x-this.rad/2>width) {
        return true;
      } else {
        return false;
      }
    }
  }

  this.getT = function() {                // get the alpha of the current ball
    return this.t;
  }

  this.getX = function() {                // get the x position of the current ball
    return this.x;
  }

  this.getY = function() {                // get the y position of the current ball
    return this.y;
  }

  this.getRad = function() {              // get the size of the current ball
    return this.rad;
  }

  this.die = function() {                 // the current ball is dead
    this.dead = true;
  }

  this.isDead = function() {              // return true when the current ball is dead
    return this.dead;
  }

  this.changeDangerColor = function() {   // turn red when the player is very close
    this.r = 255;
    this.g = 0;
    this.b = 0;
  }

  this.changeBackColor = function() {    // change back to its original color when the player move away
    this.r = this.prevR;
    this.g = this.prevG;
    this.b = this.prevB;
  }
}

function Player() {                      // class Player
  this.rad = 50;
  this.x = width/2;
  this.y = height/2;
  this.r = 255;
  this.g = 255;
  this.b = 255;
  this.t = 5;

  this.eat = function(ball) {             // eat ball that's smaller than the current player
    this.r = (this.r +132)/2;
    this.g = (this.g +182)/2;
    this.b = (this.b +223)/2;
    this.t = (this.t +ball.getT())/10;    
    this.rad += ball.getRad()/10;        // the player get larger (its size grow 1/10 the size of the ball it ate )         
  }

  this.display = function() {            // display the player ball which goes afer the mouse  
    this.x = mouseX;
    this.y = mouseY;
    noStroke();
    fill (this.r, this.g, this.b);
    ellipse(this.x, this.y, this.rad, this.rad);
  }

  this.getRad = function() {            // get the size of the player
    return this.rad;
  }
}