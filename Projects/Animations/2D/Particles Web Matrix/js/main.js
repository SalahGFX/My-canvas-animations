let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let c = canvas.getContext("2d");

// Varaibles
let particles;
const PARTICLES_NUMBER = 50;
let particlesColor = [
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

isMouseClick = false;
addEventListener("click", () => {
  isMouseClick = true;
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

function Particle() {
  // this.radius = getRandom(2, 4);
  this.radius = 10;
  this.x = getRandom(this.radius, canvas.width - this.radius);
  this.y = getRandom(this.radius, canvas.height - this.radius);
  this.dx = getRandom(-1, 1);
  this.dy = getRandom(-1, 1);
  // this.color = particlesColor[Math.floor(getRandom(0, particlesColor.length))];
  this.color = "#fff";

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

    this.draw();
  }
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  particles = [];

  for (var i = 0; i < PARTICLES_NUMBER; i++) {
    particles.push(new Particle());
  }
}
init();

function animate() {
  requestAnimationFrame(animate);

  clearCanvas("#000");

  for (var i = 0; i < particles.length; i++) {
    for (var j = i + 1; j < particles.length; j++) {
      if(distanceBetween(particles[i], particles[j]) <= 150) {
        drawLine(particles[i], particles[j], "rgba(255, 255, 255, 0.3)")
      }
    }

    if(distanceBetween(mouse, particles[i]) <= 200 && !isMouseOut) {
      drawLine(mouse, particles[i], "rgba(255, 0, 0, 0.5)")
    }
  }

  if(isMouseClick) {
    particles.push(new Particle());
    particles[particles.length - 1].x = mouse.x;
    particles[particles.length - 1].y = mouse.y;
    isMouseClick = false;
  }

  particles.forEach(particle => {
    particle.update()
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

function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    }
}

function drawLine(p1, p2, color) {
  c.beginPath();
  c.strokeStyle = color;
  c.moveTo(p1.x, p1.y);
  c.lineTo(p2.x, p2.y);
  c.stroke();
  c.closePath();
}
