let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

const GRAVITY = 0.02;
const STARS_NUMBER = 500;

let mouseX = canvas.width / 2;
window.addEventListener("mousemove", e => {
    mouseX = e.offsetX;
}, false);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
}, false);

let isMouseDown = false;
window.addEventListener("mousedown", e => {
    isMouseDown = true;
}, false);

window.addEventListener("mouseup", e => {
    isMouseDown = false;
}, false);

function Cannon(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;

    this.update = (mX) => {
        this.x = mX;
        this.draw();
    };

    this.draw = () => {
        c.fillStyle = this.color;
        c.fillRect(this.x - this.w / 2, this.y - this.h, this.w, this.h);
    };
}

function Cannonball(x, y, dy, radius, color, particlesColor, particlesNumber) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.particlesColor = particlesColor;
    this.particlesNumber = particlesNumber;
    this.life = this.y;

    this.update = () => {
        this.y -= this.dy;
        this.life = this.y;
        this.draw();
    };

    this.draw = () => {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.fill();
        c.closePath();
    };
}

function Particle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.life = 1;

    this.update = () => {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += GRAVITY;
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.radius *= 0.98;
        if (this.x < this.radius || this.x > canvas.width - this.radius) {
            this.dx *= -1;
        }
        this.draw();
    };

    this.draw = () => {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.fill();
        c.closePath();
    };
}

function Explosion(source) {
    this.particles = [];
    this.source = source;

    this.init = () => {
        for (let i = 0; i < this.source.particlesNumber; i++) {
            let x = this.source.x;
            let y = this.source.y;
            let dx = Math.random() * 6 - 3;
            let dy = Math.random() * 6 - 3;
            let radius = Math.random() * 12;
            let color = this.source.particlesColor[Math.floor(Math.random() * this.source.particlesColor.length)];
            this.particles.push(new Particle(x, y, dx, dy, radius, color));
        }
    };

    this.update = () => {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            if (this.particles[i].radius < 1) {
                this.particles.splice(i, 1);
            }
        }
    };

    this.init();
}

function Star(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.update = () => {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x > canvas.width + 10 || this.x < -10) {
            this.dx *= -1;
        }
        if (this.y > canvas.height + 10 || this.y < -10) {
            this.dy *= -1;
        }
        this.draw();
    };

    this.draw = () => {
        c.beginPath();
        c.fillStyle = "rgba(255,255,255,0.4)";
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.fill();
        c.closePath();
    };
}

// Variables
let cannon;
let colors = [{
        cannon: "white",
        cannonBall: "#F5F2DC",
        fireworks: ['#360601', '#db0000', '#f66706', '#3e2200', '#ffc100']
    },
    {
        cannon: "white",
        cannonBall: "#009494",
        fireworks: ['#2C3E50', '#E74C3C', '#3498DB', '#ECF0F1', '#2980B9']
    },
    {
        cannon: "white",
        cannonBall: "#FF5729",
        fireworks: ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800']
    },
    {
        cannon: "white",
        cannonBall: "#454445",
        fireworks: ['#2F2933', '#01A2A6', '#29D9C2', '#BDF271', '#FFFFA6']
    },
    {
        cannon: "white",
        cannonBall: "#FF004C",
        fireworks: ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800']
    }
];
let cannonBalls;
let explosions;
let timer;
let introTimer;
let isIntroFinished;
let stars;

function init() {
    cannon = new Cannon(canvas.width / 2, canvas.height, 30, 40, colors[0].cannon);
    cannonBalls = [];
    explosions = [];
    stars = [];
    timer = 0;
    for (let i = 0; i < STARS_NUMBER; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = Math.random() * 0.02 - 0.01;
        let dy = Math.random() * 0.02 - 0.01;
        let radius = Math.random() * 1;
        stars[i] = new Star(x, y, dx, dy, radius);
    }
}

function startIntro() {
    introTimer = 0;
    isIntroFinished = false;
}
startIntro();
init();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "rgba(0,0,0,0.2)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => star.update());

    if (!isIntroFinished) {
        introTimer += 5;
        cannon.update(introTimer);
        if (introTimer % 20 === 0) {
            fireBalls();
        }
        if (introTimer > canvas.width - cannon.w) {
            isIntroFinished = true;
        }
    } else {
        cannon.update(mouseX);
    }

    for (let i = 0; i < cannonBalls.length; i++) {
        cannonBalls[i].update();
        if (cannonBalls[i].life < getRandom(0, canvas.height / 2)) {
            explosions.push(new Explosion(cannonBalls[i]));
            cannonBalls.splice(i, 1);
        }
    }

    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        if (explosions[i].particles.length <= 0) {
            explosions.splice(i, 1);
        }
    }
    if (isMouseDown) {
        isIntroFinished = true;
        timer++;
        if (timer % 3 === 0) fireBalls();
    }

    function fireBalls() {
        let radius = getRandom(2, 5);
        let dy = radius < 3 ? getRandom(5, 6) : getRandom(6.5, 8);
        let randomColors = colors[Math.floor(Math.random() * colors.length)];
        let particlesNumber = Math.floor(Math.random() * 100);
        cannonBalls.push(new Cannonball(cannon.x, canvas.height - cannon.h, dy, radius, randomColors.cannonBall, randomColors.fireworks, particlesNumber));
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
}

animate();
