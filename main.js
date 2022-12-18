//캔버스 세팅

let canvas;
let ctx;

//canvas = document.createElement("canvas");
canvas = document.getElementById("space");
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 850;
document.body.appendChild(canvas);

let backgroundImage, jetImage, bulletImage, ufoImage, gameOverImage;
let gameOver = false; // true 이면 게임이 끝남, false 이면 안끝남
let score = 0;

// 전투기 좌표
let jetX = canvas.width / 2 - 32;
let jetY = canvas.height - 64;

let bulletList = []; // 총알들 저장하는 리스트
// 총알 좌표
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = jetX + 25;
    this.y = jetY;
    this.alive = true; // true 면 살아있는 총알 false면 죽은 총알
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 3;
  };

  this.checkHit = function () {
    for (let i = 0; i < ufoList.length; i++) {
      if (
        this.y <= ufoList[i].y &&
        this.x >= ufoList[i].x &&
        this.x <= ufoList[i].x + 40
      ) {
        //총알이 죽게됨, 적군의 우주선이 없어짐, 그리고 점수 획득
        score++;
        this.alive = false; // 죽은 총알
        ufoList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

// Ufo
let ufoList = [];
function Ufo() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 64);
    ufoList.push(this);
  };
  this.update = function () {
    this.y += 1; // ufo 속도 조절

    if (this.y > canvas.height - 48) {
      gameOver = true;
      console.log("GAME OVER");
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/space_bg.jpg";

  jetImage = new Image();
  jetImage.src = "images/jet.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  ufoImage = new Image();
  ufoImage.src = "images/ufo.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/game_over.png";
}

let keysDown = {};

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });

  document.addEventListener("keyup", function () {
    delete keysDown[event.keyCode];

    if (event.keyCode === 32) {
      createBullet(); // 총알생성
      let b = new Bullet();
      b.init();
    }
  });
}

function createBullet() {
  console.log("총알생성");
}

function createUfo() {
  const interval = setInterval(function () {
    let e = new Ufo();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    jetX += 3; // 전투기 속도
  } // right

  if (37 in keysDown) {
    jetX -= 3;
  } // left

  if (jetX <= 0) {
    jetX = 0;
  }
  if (jetX >= canvas.width - 64) {
    jetX = canvas.width - 64;
  }

  // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌 화면 안에서만 움직이게 하기!

  //총알의 y좌표 업데이트 하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < ufoList.length; i++) {
    ufoList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(jetImage, jetX, jetY);

  ctx.fillText(`SCORE:${score}`, 20, 30);
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < ufoList.length; i++) {
    ctx.drawImage(ufoImage, ufoList[i].x, ufoList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 150, 320, 200, 200);
  }
}

loadImage();
setupKeyboardListener();
createUfo();
main();
