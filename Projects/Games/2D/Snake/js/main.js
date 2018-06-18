alert("Use Left-Right-Up-Down keys to controll the snake!");

let canvas = document.querySelector("canvas");
canvas.width = canvas.height = innerWidth > innerHeight ? innerHeight * 0.8 : innerWidth * 0.8;

let c = canvas.getContext("2d");

let score = document.querySelector(".score");

// Varaibles
let snake;
let bait;
const CN = 30; // 20 is the colomns number
let speed = 4;
let counter;
let headPos;
let bodyPos;
let isGameOver;
let isWinner;
let coords;
let maxLength;
let currentScore;
let volume = 1.1;

addEventListener("resize", reset, true);

let keys = ["Right", "Left", "Up", "Down"];
let key = keys[getRandomInt(0, keys.length)];
addEventListener("keydown", e => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        key = e.key.slice(5);
    }
});

function SnakeBody(gx, gy) {
    this.gx = gx;
    this.gy = gy;
    this.n = Math.floor(canvas.width / CN) * volume;
    this.color = "#1b3104";

    this.draw = () => {
        c.fillStyle = this.color;
        c.fillRect(canvas.width / CN * this.gx - this.n / 2, canvas.height / CN * this.gy - this.n / 2, this.n, this.n);
        c.fill();
    };
}

function Snake() {
    this.gx = getRandomInt(1, CN);
    this.gy = getRandomInt(1, CN);
    this.n = Math.floor(canvas.width / CN) * volume;
    this.s = 1;
    this.color = "#1b3104";
    this.dir = key;
    this.body = [];

    this.draw = () => {
        c.fillStyle = this.color;
        c.fillRect(canvas.width / CN * this.gx - this.n / 2, canvas.height / CN * this.gy - this.n / 2, this.n, this.n);
        c.fill();
    };

    this.update = () => {
        coords = [];

        if (counter++ % speed === 0) {
            headPos = Object.assign({}, this);

            changeDirection();

            if (this.dir === "Right") {
                this.gx += this.s;
            } else if (this.dir === "Left") {
                this.gx -= this.s;
            } else if (this.dir === "Up") {
                this.gy -= this.s;
            } else {
                this.gy += this.s;
            }

            coords.push(`(${this.gx},${this.gy})`);

            this.body.forEach((p, i) => {
                if (distanceBetween(this, p) === 0) {
                    isGameOver = true;
                }
                if (i === 0) {
                    bodyPos = Object.assign({}, p);
                    p.gx = headPos.gx;
                    p.gy = headPos.gy;
                } else {
                    let a = Object.assign({}, p);
                    p.gx = bodyPos.gx;
                    p.gy = bodyPos.gy;
                    bodyPos = Object.assign({}, a);
                }

                coords.push(`(${p.gx},${p.gy})`);
            });

            if (this.gx === CN) this.gx = 1;
            else if (this.gx === 0) this.gx = CN - 1;
            else if (this.gy === CN) this.gy = 1;
            else if (this.gy === 0) this.gy = CN - 1;

            if (coords.length === maxLength) {
                isWinner = true;
            }

            updateScore();

            counter = 1;
        }

        this.body.forEach(p => {
            p.draw();
        });

        this.draw();
    };
}

function Bait() {
    this.n = Math.floor((canvas.width / CN) / 2);
    this.gx = getRandomInt(1, CN);
    this.gy = getRandomInt(1, CN);
    this.color = "#1b3104";

    this.init = () => {
        while (coords.indexOf(`(${this.gx},${this.gy})`) !== -1 && coords.length !== maxLength) {
            this.gx = getRandomInt(1, CN);
            this.gy = getRandomInt(1, CN);
        }
    };

    this.draw = () => {
        c.fillStyle = this.color;
        c.fillRect(canvas.width / CN * this.gx - this.n / 2, canvas.height / CN * this.gy - this.n / 2, this.n, this.n);
        c.fill();
    };

    this.update = () => {
        if (coords.length !== maxLength) {
            this.draw();
        }
    };

    this.init();
}

// function Grid() {
//   this.color = "rgba(255, 255, 255, 0.25)";
//
//   this.draw = () => {
//     c.beginPath();
//     c.strokeStyle = this.color;
//     c.lineWidth = 0.5;
//     for (var i = 1; i < CN; i++) {
//       c.moveTo(canvas.width / CN * i, 0);
//       c.lineTo(canvas.width / CN * i, canvas.height);
//       c.moveTo(0 , canvas.height / CN * i);
//       c.lineTo(canvas.width, canvas.height / CN * i);
//     }
//     c.stroke();
//     c.closePath();
//   };
// }

function init() {
    currentScore = 0;
    isGameOver = false;
    isWinner = false;
    coords = [];
    maxLength = Math.pow(CN - 1, 2);
    counter = 0;

    snake = new Snake();
    // grid = new Grid();
    bait = new Bait();
}
init();

function animate() {
    if (isGameOver) newGame("GameOver!");
    else if (isWinner) newGame("You've won!");
    else requestAnimationFrame(animate);

    clearCanvas("#98c807");

    // grid.draw();
    bait.update();

    snake.update();
}
animate();

function reset() {
    canvas.width = canvas.height = innerWidth > innerHeight ? innerHeight * 0.8 : innerWidth * 0.8;

    bait.n = Math.floor((canvas.width / CN) / 2);
    snake.n = Math.floor(canvas.width / CN);

    snake.body.forEach(p => {
        p.n = Math.floor(canvas.width / CN);
    });

    updateScorePosition();
}

function clearCanvas(color) {
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function distanceBetween(o1, o2) {
    return Math.sqrt(Math.pow(o1.gx - o2.gx, 2) + Math.pow(o1.gy - o2.gy, 2));
}

function updateScorePosition() {
    score.style.left = canvas.getBoundingClientRect().left + "px";
    score.style.bottom = canvas.getBoundingClientRect().bottom + "px";
}
updateScorePosition();

function updateScore() {
    if (!distanceBetween(snake, bait)) {
        bait = new Bait();

        currentScore++;
        score.innerHTML = '0'.repeat(4 - currentScore.toString().length) + currentScore;

        snake.body.push(new SnakeBody(snake.gx, snake.gy));
    }
}

function changeDirection() {
    if (key === "Right" && snake.dir !== "Left") snake.dir = key;
    else if (key === "Left" && snake.dir !== "Right") snake.dir = key;
    else if (key === "Up" && snake.dir !== "Down") snake.dir = key;
    else if (key === "Down" && snake.dir !== "Up") snake.dir = key;
}

function newGame(msg) {
    alert(msg);
    if (confirm("Wanna play again ?")) {
        init();
        reset();
        animate();
    }
}
