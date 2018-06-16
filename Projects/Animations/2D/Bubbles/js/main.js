let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let c = canvas.getContext("2d");

// Varaibles
let bubbles;
const BUBBLES_NUMBER = 500;
let bubblesColor = [
  "rgb(80, 81, 79)",
  "rgb(242, 95, 92)",
  "rgb(36, 123, 160)",
  "rgb(112, 193, 179)",
  "rgb(1, 22, 39)",
  "rgb(113, 46, 133)",
  "rgb(46, 196, 182)",
  "rgb(231, 29, 54)",
  "rgb(2, 51, 68)",
  "rgb(0, 89, 89)",
  "rgb(0, 126, 167)",
  "rgb(0, 168, 232)"
];

addEventListener("resize", () => {
  init()
});

let mouse = {};
let isMouseOut = false;
addEventListener("mousemove", e => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  isMouseOut = false;
})

addEvent(document, "mouseout", function(e) {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
        isMouseOut = true;
    }
    else {
      isMouseOut = false;
    }
});

function Bubble() {
  this.radius = getRandom(2, 4);
  this.x = getRandom(this.radius, canvas.width - this.radius);
  this.y = getRandom(this.radius, canvas.height - this.radius);
  this.dx = getRandom(-1, 1);
  this.dy = getRandom(-1, 1);
  this.color = bubblesColor[Math.floor(getRandom(0, bubblesColor.length))];
  this.radiusBackUp = this.radius;

  this.draw = () => {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fill();
    c.closePath();
  };

  this.update = () => {
    this.x += this.dx;
    this.y += this.dy;

    if(this.x >= canvas.width - this.radius || this.x <= this.radius) {
      this.dx *= -1;
    }

    if(this.y >= canvas.height - this.radius || this.y <= this.radius) {
      this.dy *= -1;
    }

    if(distanceBetween(this.x, this.y, mouse.x, mouse.y) <= 100 && this.radius <= 100 && !isMouseOut) {
      this.radius += 1.25;
    }
    else if(this.radius > this.radiusBackUp) {
      this.radius -= 0.25;
    }

    this.draw();
  }
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  bubbles = [];

  for (var i = 0; i < BUBBLES_NUMBER; i++) {
    bubbles.push(new Bubble());
  }
}
init();

function animate() {
  requestAnimationFrame(animate);

  clearCanvas("#fff");

  bubbles.forEach(bubble => {
    bubble.update()
  });
}
animate();

function clearCanvas(color) {
  c.fillStyle = color;
  c.fillRect(0, 0, canvas.width, canvas.height);
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    }
}
