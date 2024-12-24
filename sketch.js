let sprites = {
  player1: {
    idle: { width: 50, height: 50 },
    walk: { width: 50, height: 50 },
    jump: { width: 50, height: 50 }
  },
  player2: {
    idle: { width: 50, height: 50 },
    walk: { width: 50, height: 50 },
    jump: { width: 50, height: 50 }
  },
  bullet: { width: 10, height: 5 }
};

let player1 = {
  x: 100,
  y: 200,
  speedX: 5,
  speedY: 0,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false,
  groundY: 500,
  currㄓentAction: 'idle',
  direction: 1,
  bullets: [],
  health: 100,
  color: 'rgb(255, 50, 50)'
};

let player2 = {
  x: 800,
  y: 200,
  speedX: 5,
  speedY: 0,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false,
  groundY: 500,
  currentAction: 'idle',
  direction: -1,
  bullets: [],
  health: 100,
  color: 'rgb(50, 50, 255)'
};

// 修改子彈屬性
let bulletConfig = {
  width: 10,
  height: 5,
  speed: 10,
  maxBullets: 3,  // 最大子彈數
  damage: 10,     // 子彈傷害
  cooldown: 500   // 射擊冷卻時間（毫秒）
};

// 在 player1 和 player2 物件中加入射擊冷卻
player1.lastShootTime = 0;
player2.lastShootTime = 0;

// 新增遊戲狀態變數
let gameState = 'instruction'; // 'instruction', 'playing', 'gameover'

// 移除圖片相關的程式碼，改用簡單的動畫
let playerStates = {
  idle: {
    frames: 4,
    frameDelay: 10
  },
  walk: {
    frames: 6,
    frameDelay: 6
  },
  jump: {
    frames: 2,
    frameDelay: 8
  }
};

class AnimationController {
  constructor() {
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.currentAction = 'idle';
  }
  
  update() {
    const animation = playerStates[this.currentAction];
    this.frameCounter++;
    
    if (this.frameCounter >= animation.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % animation.frames;
      this.frameCounter = 0;
    }
  }
  
  changeAction(action) {
    if (this.currentAction !== action) {
      this.currentAction = action;
      this.currentFrame = 0;
      this.frameCounter = 0;
    }
  }
}

// 在 player 物件中加入動畫控制器
player1.animator = new AnimationController();
player2.animator = new AnimationController();

// 在檔案開頭宣告背景圖片變數
let backgroundImage;

// 在 preload 函數中載入圖片
function preload() {
  backgroundImage = loadImage('images/ziji_background.jpg');  // 可以是 .jpg 或 .png
}

function setup() {
  createCanvas(1000, 600);
}

// 修改背景文字設定
let backgroundText = {
  mainText: '淡江教科',
  titleText: '淡江大學 教育科技學系'
};

function draw() {
  // 清除背景
  background(220);
  
  // 繪製背景文字（最底層）
  drawBackgroundText();
  
  // 繪製遊戲元素（上層）
  drawGameElements();
}

// 修改背景繪製
function drawBackgroundText() {
  push();
  
  // 繪製背景圖片
  image(backgroundImage, 0, 0, width, height);
  
  // 加入半透明遮罩使背景變暗，讓遊戲元素更容易看見
  fill(0, 0, 0, 100);  // 黑色半透明遮罩
  rect(0, 0, width, height);
  
  // 主要文字
  textSize(150);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  fill(255, 255, 255, 80);  // 改為白色半透明
  text(backgroundText.mainText, width/2, height/2);
  
  // 左上角標題
  textSize(24);
  textAlign(LEFT, TOP);
  fill(255);  // 改為白色
  text(backgroundText.titleText, 20, 20);
  
  pop();
}

// 新增：遊戲元素繪製函數
function drawGameElements() {
  // 繪製地面
  fill(100);
  rect(0, 500, width, 100);
  
  // 更新物理
  updatePhysics(player1);
  updatePhysics(player2);
  
  // 檢查按鍵
  checkKeys();
  
  // 檢查碰撞
  checkCollisions();
  
  // 繪製角色
  drawPlayer(player1);
  drawPlayer(player2);
  
  // 繪製子彈
  drawBullets(player1);
  drawBullets(player2);
  
  // 繪製命中效果
  drawHitEffects();
  
  // 繪製生命值
  drawHealth();
  
  // 繪製控制面板
  drawControlPanel();
}

// 修改遊戲狀態相關的繪製
function draw() {
  if (gameState === 'instruction') {
    background(220);
    drawBackgroundText();  // 在說明畫面也顯示背景文字
    drawInstruction();
  } else if (gameState === 'playing') {
    background(220);
    drawBackgroundText();  // 在遊戲中顯示背景文字
    drawGameElements();
  } else if (gameState === 'gameover') {
    background(220);
    drawBackgroundText();  // 在遊戲結束時也顯示背景文字
    drawGameElements();
    drawGameOver();
  }
}

// 新增說明畫面
function drawInstruction() {
  background(0, 0, 0, 200);
  
  push();
  // 標題
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text('雙人對戰遊戲', width/2, 100);
  
  // 玩家1說明
  textSize(24);
  fill('red');
  text('玩家1 控制：', width/2, 200);
  fill(255);
  textSize(20);
  text('W - 跳躍', width/2, 240);
  text('A - 向左移動', width/2, 270);
  text('D - 向右移動', width/2, 300);
  text('F - 發射子彈', width/2, 330);
  
  // 玩家2說明
  textSize(24);
  fill('blue');
  text('玩家2 控制：', width/2, 380);
  fill(255);
  textSize(20);
  text('↑ - 跳躍', width/2, 420);
  text('← - 向左移動', width/2, 450);
  text('→ - 向右移動', width/2, 480);
  text('空白鍵 - 發射子彈', width/2, 510);
  
  // 開始提示
  textSize(24);
  fill(255);
  text('按下 ENTER 開始遊戲', width/2, height - 50);
  pop();
}

// 新增：物理更新函數
function updatePhysics(player) {
  // 重力效果
  if (player.y < player.groundY) {
    player.speedY += player.gravity;
    player.isJumping = true;
  }
  
  // 更新位置
  player.y += player.speedY;
  
  // 檢查地面碰撞
  if (player.y >= player.groundY) {
    player.y = player.groundY;
    player.speedY = 0;
    player.isJumping = false;
  }
  
  // 限制在畫面內
  if (player.x < 0) player.x = 0;
  if (player.x > width - sprites.player1.idle.width) {
    player.x = width - sprites.player1.idle.width;
  }
}

// 新增：按鍵檢查函數
function checkKeys() {
  // 玩家1控制 (WASD)
  if (keyIsDown(65)) { // A
    player1.x -= player1.speedX;
    player1.direction = -1;
  } else if (keyIsDown(68)) { // D
    player1.x += player1.speedX;
    player1.direction = 1;
  }
  
  if (keyIsDown(87) && !player1.isJumping) { // W
    player1.speedY = player1.jumpForce;
    player1.isJumping = true;
  }
  
  // 玩家2控制 (方向鍵)
  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= player2.speedX;
    player2.direction = -1;
  } else if (keyIsDown(RIGHT_ARROW)) {
    player2.x += player2.speedX;
    player2.direction = 1;
  }
  
  if (keyIsDown(UP_ARROW) && !player2.isJumping) {
    player2.speedY = player2.jumpForce;
    player2.isJumping = true;
  }
}

// 修改 drawPlayer 函數
function drawPlayer(player) {
  // 更新動畫狀態
  if (player.isJumping) {
    player.animator.changeAction('jump');
  } else if (Math.abs(player.speedX) > 0) {
    player.animator.changeAction('walk');
  } else {
    player.animator.changeAction('idle');
  }
  
  player.animator.update();
  
  push();
  translate(player.x, player.y);
  
  // 翻轉角色
  if (player.direction === -1) {
    scale(-1, 1);
    translate(-sprites.player1.idle.width, 0);
  }
  
  // 根據動作繪製不同的動畫
  fill(player.color);
  let w = sprites.player1.idle.width;
  let h = sprites.player1.idle.height;
  
  switch(player.animator.currentAction) {
    case 'idle':
      // 待機動畫：上下浮動
      let idleOffset = sin(frameCount * 0.1) * 3;
      rect(0, idleOffset, w, h);
      break;
      
    case 'walk':
      // 走路動畫：變形
      let walkOffset = sin(frameCount * 0.2) * 5;
      beginShape();
      vertex(w/2, walkOffset);
      vertex(w, h/3);
      vertex(w, h);
      vertex(0, h);
      vertex(0, h/3);
      endShape(CLOSE);
      break;
      
    case 'jump':
      // 跳躍動畫：拉長
      rect(0, 0, w, h * 0.8);
      break;
  }
  
  // 繪製眼睛
  fill(255);
  let eyeX = player.direction === 1 ? w * 0.7 : w * 0.3;
  ellipse(eyeX, h * 0.3, 8, 8);
  
  pop();
}

// 新增：繪製子彈函數
function drawBullets(player) {
  push();
  for (let bullet of player.bullets) {
    // 子彈軌跡效果
    for (let i = 0; i < 3; i++) {
      let alpha = 255 - i * 70;
      fill(bullet.color + alpha.toString(16));
      rect(bullet.x - i * (bullet.speed/2), bullet.y, 
           bullet.width, bullet.height);
    }
    
    // 主要子彈
    fill(bullet.color);
    rect(bullet.x, bullet.y, bullet.width, bullet.height);
    
    // 更新子彈位置
    bullet.x += bullet.speed;
  }
  pop();
}

// 修改生命值顯示函數
function drawHealth() {
  // 玩家1生命值
  drawPlayerHealth(player1);
  // 玩家2生命值
  drawPlayerHealth(player2);
}

// 新增：個別玩家生命值繪製函數
function drawPlayerHealth(player) {
  push();
  
  // 計算生命條位置（在角色頭頂上方）
  let healthBarWidth = 50;
  let healthBarHeight = 5;
  let xPos = player.x + (sprites.player1.idle.width - healthBarWidth) / 2;
  let yPos = player.y - 20;  // 在角色上方20像素
  
  // 生命條背景（灰色）
  fill(100);
  noStroke();
  rect(xPos, yPos, healthBarWidth, healthBarHeight, 2);
  
  // 生命條（根據玩家顏色）
  fill(player.color);
  let currentHealthWidth = (player.health / 100) * healthBarWidth;
  rect(xPos, yPos, currentHealthWidth, healthBarHeight, 2);
  
  // 生命值數字
  textSize(12);
  textAlign(CENTER);
  fill(255);
  stroke(0);
  strokeWeight(2);
  text(player.health, xPos + healthBarWidth/2, yPos - 5);
  
  pop();
}

// 修改 keyPressed 函數
function keyPressed() {
  if (gameState === 'instruction' && keyCode === ENTER) {
    gameState = 'playing';
    resetGame(); // 確保遊戲從初始狀態開始
    return;
  }
  
  if (gameState === 'gameover' && (key === 'r' || key === 'R')) {
    gameState = 'playing';
    resetGame();
    return;
  }
  
  if (gameState === 'playing') {
    if (key === 'f' || key === 'F') {
      shoot(player1);
    }
    if (keyCode === 32) { // 空白鍵
      shoot(player2);
    }
  }
}

// 修改 checkGameOver 函數
function checkGameOver() {
  if (player1.health <= 0 || player2.health <= 0) {
    gameState = 'gameover';
    noLoop();
  }
}

// 修改 resetGame 函數
function resetGame() {
  // 重置玩家1
  player1.x = 100;
  player1.y = 200;
  player1.speedY = 0;
  player1.health = 100;
  player1.bullets = [];
  player1.direction = 1;
  
  // 重置玩家2
  player2.x = 800;
  player2.y = 200;
  player2.speedY = 0;
  player2.health = 100;
  player2.bullets = [];
  player2.direction = -1;
  
  // 重新開始遊戲循環
  loop();
}

// 新增：射擊功能
function shoot(player) {
  let currentTime = millis();
  
  // 檢查射擊冷卻和子彈數量限制
  if (currentTime - player.lastShootTime >= bulletConfig.cooldown && 
      player.bullets.length < bulletConfig.maxBullets) {
    
    let bullet = {
      x: player.x + (player.direction === 1 ? sprites.player1.idle.width : 0),
      y: player.y + sprites.player1.idle.height/2,
      speed: bulletConfig.speed * player.direction,
      width: bulletConfig.width,
      height: bulletConfig.height,
      color: player.color
    };
    
    player.bullets.push(bullet);
    player.lastShootTime = currentTime;
  }
}

// 新增：碰撞檢測
function checkCollisions() {
  // 檢查玩家1的子彈
  for (let i = player1.bullets.length - 1; i >= 0; i--) {
    let bullet = player1.bullets[i];
    if (checkBulletHit(bullet, player2)) {
      // 子彈命中效果
      createHitEffect(bullet.x, bullet.y, player2.color);
      player2.health = max(0, player2.health - bulletConfig.damage);
      player1.bullets.splice(i, 1);
    }
    else if (bullet.x < 0 || bullet.x > width) {
      player1.bullets.splice(i, 1);
    }
  }
  
  // 檢查玩家2的子彈
  for (let i = player2.bullets.length - 1; i >= 0; i--) {
    let bullet = player2.bullets[i];
    if (checkBulletHit(bullet, player1)) {
      // 子彈命中效果
      createHitEffect(bullet.x, bullet.y, player1.color);
      player1.health = max(0, player1.health - bulletConfig.damage);
      player2.bullets.splice(i, 1);
    }
    else if (bullet.x < 0 || bullet.x > width) {
      player2.bullets.splice(i, 1);
    }
  }
}

// 新增：子彈碰撞檢測
function checkBulletHit(bullet, player) {
  return bullet.x < player.x + sprites.player1.idle.width &&
         bullet.x + sprites.bullet.width > player.x &&
         bullet.y < player.y + sprites.player1.idle.height &&
         bullet.y + sprites.bullet.height > player.y;
}

// 新增：子彈命中效果
let hitEffects = [];

function createHitEffect(x, y, color) {
  hitEffects.push({
    x: x,
    y: y,
    size: 20,
    alpha: 255,
    color: color
  });
}

// 在 draw 函數中加入效果繪製
function drawHitEffects() {
  for (let i = hitEffects.length - 1; i >= 0; i--) {
    let effect = hitEffects[i];
    
    push();
    fill(effect.color + effect.alpha.toString(16));
    noStroke();
    circle(effect.x, effect.y, effect.size);
    pop();
    
    // 更新效果
    effect.size += 2;
    effect.alpha -= 15;
    
    // 移除淡出的效果
    if (effect.alpha <= 0) {
      hitEffects.splice(i, 1);
    }
  }
}

// 新增：控制面板顯示函數
function drawControlPanel() {
  push();
  // 半透明背景
  fill(0, 0, 0, 150);
  rect(10, 40, 200, 180, 10); // 圓角矩形
  
  // 標題
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text('遊戲控制說明：', 20, 60);
  
  // 玩家1控制說明
  fill('red');
  textSize(14);
  text('玩家1：', 20, 85);
  fill(255);
  textSize(12);
  text('W - 跳躍', 30, 105);
  text('A - 左移', 30, 120);
  text('D - 右移', 30, 135);
  text('F - 射擊', 30, 150);
  
  // 玩家2控制說明
  fill('blue');
  textSize(14);
  text('玩家2：', 110, 85);
  fill(255);
  textSize(12);
  text('↑ - 跳躍', 120, 105);
  text('← - 左移', 120, 120);
  text('→ - 右移', 120, 135);
  text('空白 - 射擊', 120, 150);
  
  // 其他說明
  fill(255, 255, 0);
  textSize(12);
  text('R - 重新開始遊戲', 20, 180);
  text('ESC - 暫停遊戲', 20, 195);
  pop();
}

// 在 player 物件中添加動畫相關屬性
player1.currentFrame = 0;
player2.currentFrame = 0;
