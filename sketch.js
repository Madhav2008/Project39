var PLAY = 1;
var END = 0;
var gameState = PLAY;
var mario,mario1,mario_running,mario_collided;
var ground,invisibleGround,groundImage;
var bricksGroup,brickImage;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score=0;
var gameOver, restart;

function preload(){
  bg=loadImage("bg.png")
  mario_running =   loadAnimation("char01.png","char02.png","char03.png","char04.png");
  mario_collided = loadAnimation("char.png");
  groundImage = loadImage("ground2.png");
  brickImage = loadImage("brick.png");
  obstacleimage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.wav")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  backS = loadSound("backs.wav");
  music = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  music.loop();

  mario = createSprite(50,windowHeight-295,20,50),
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.7 ;
  
  mario1 = createSprite(50,windowHeight-295,20,50),
  mario1.addAnimation("running",mario_running);
  mario1.addAnimation("collided", mario_collided);
  mario1.scale = 0.5 ;
  mario1.visible = false ;
  
  ground = createSprite(windowWidth/3,630,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(100);
  ground.scale = 1.4 ;
  
  gameOver = createSprite(windowWidth/2,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,250);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.7;
  
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,580,400,10);
  invisibleGround.visible = false;
  
  bricks = createSprite(windowWidth+10,windowHeight+10);
  bricks.addImage(brickImage);
  bricks.velocityX = -12;
  
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
  fill(0);
  textSize(40);
  textFont('Georgia');
  
  score = 0 ;
}

function draw() {
  background(bg);
  ground.velocityX = 0 ;
  text("Score = "+ score,windowWidth/2,50);
  
  if (gameState===PLAY){
  
   backS.stop();

   ground.velocityX = -(12); 
    
  if(touches.length>0||keyDown(UP_ARROW) && mario1.y >= 400) {
      mario1.velocityY = -(12);
      jumpy();
    } 
  
  if(touches.length>0||keyDown(UP_ARROW) && mario.y >= 380) {
      mario.velocityY = -(12);
      jumpy();
    }
    
  if(score>0 && score%10 === 0){
       checkPointSound.play() 
    }
    mario.velocityY = mario.velocityY + 0.5 ;
    mario1.velocityY = mario1.velocityY + 0.5 ;
    
  if (ground.x < 500){
      ground.x = ground.width/2;
    }

  for (var i = 0; i < bricksGroup.length; i++) {
    
  if(bricksGroup.get(i).isTouching(mario)||bricksGroup.get(i).isTouching(mario1)){
      bricksGroup.get(i).remove()
      score =score+1;
    }
  }
    mario.collide(invisibleGround);
    mario1.collide(invisibleGround);
    spawnbricks();
    spawnObstacles();
  
  if(obstaclesGroup.isTouching(mario)){
       reset1();
       mario.y = -90000 ;
       mario1.visible = true ;
    }
    
  if(obstaclesGroup.isTouching(mario1)){
       gameState = END;
       backS.stop();
    }}
  
  if (gameState === END) {
    music.stop();
    backS.loop();
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    mario1.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0); 
    mario1.changeAnimation("collided",mario_collided);
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
  if(touches.length>0||mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnbricks(){
  if (frameCount % 100 === 0) {
    var brick = createSprite(600,550,40,10);
    brick.y = Math.round(random(300,480));
    brick.addImage(brickImage);
    brick.scale = 1;
    brick.velocityX = -(10);
    brick.lifetime = 200;
    brick.depth = mario.depth;
    mario .depth = mario.depth + 1;
    bricksGroup.add(brick);
  }
}

function spawnObstacles() {
  if(frameCount % 90 === 0) {
    var obstacle = createSprite(600,550,10,40);
    obstacle.velocityX = -(10);
    obstacle.addAnimation("obstacles",obstacleimage);
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  mario.y = 390 ;
  mario1.visible = false ;
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  mario.changeAnimation("running",mario_running);
  mario1.changeAnimation("running",mario_running);
  score = 0;
}

function reset1(){
  mario.y = 390 ;
  mario1.visible = false ;
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  mario.changeAnimation("running",mario_running);
  mario1.changeAnimation("running",mario_running);
}

function jumpy(){
    jumpSound.play();
  }