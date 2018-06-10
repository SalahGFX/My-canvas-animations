let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let c = canvas.getContext("2d");


addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

let mousePos = {};
addEventListener("mousemove", e => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});

let isMouseDown = false;
addEventListener("mousedown", () => {
  isMouseDown = true;
});
addEventListener("mouseup", () => {
  isMouseDown = false;
});


function Cannon(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;

  this.init = () => {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.w, this.h)
    c.fill();
  }

  this.update = x => {
    this.x = x;

    this.init();
  }
}

function CannonBall(x, y, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.life = 1;

  this.init = () => {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    c.fill();
    c.closePath();
  }

  this.update = () => {
    this.y -= this.dy;
    this.life -= this.dy / getRandomNumber(400, 1300);

    if(this.x >= canvas.width - this.radius || this.x <= this.radius) {
      this.dx = -this.dx;
    }

    if(this.y >= canvas.height - this.radius || this.y <= this.radius) {
      this.dy *= -1;
    }

    this.init();
  }
}

let cannonInit = {
  object: '',
  width: 40,
  height: 70,
  color: 'white'
};
let balls = [];
ballsNumber = 10;
let counter = 0;

function init() {
  cannonInit.object = new Cannon(canvas.width / 2 - cannonInit.width / 2, canvas.height - cannonInit.height, cannonInit.width, cannonInit.height, cannonInit.color);
}
init();

function animate() {
  requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fill();

  balls.forEach((ball, i) => {
    if(ball.life <= 0.3) {
      balls.splice(i, 1);
    }
    else ball.update();
  })

  cannonInit.object.update(mousePos.x - cannonInit.width / 2);

  if(isMouseDown) {
    if(counter % 3 === 0) {
      let radius = getRandomNumber(4, 8);
      let x = mousePos.x;
      let y = canvas.height - cannonInit.height + radius;
      let dy = getRandomNumber(6, 12);
      balls.push(new CannonBall(x, y, dy, radius, "red"))
    }
    counter++;
  }
}
animate();

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
