/// Settings
let rocketSpeed = 12;
let lives = 5;

let ufoSpeed = 8;
let ufoSpeedChange = 0.2;
let ufoSpawnRate = 5000;
let minSpawnRate = 1000;

let shotSpeed =  15;
let shotCooldown = 300;

let ufoPoints = 1;
let ufoBigPoints = 5;




/// Classes
class Rocket {
    constructor(x, y, width, height, imgSrc, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
        this.speed = speed;
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }

    moveLeft() {
        this.x -= (0.7 * this.speed);
    }

    moveRight() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Ufo {
    constructor(x, y, width, height, imgSrc, points, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
        this.points = points;
        this.speed = speed;
    }

    move() {
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    recolor(color) {
        this.img = colorizeImage(this.img, color);
    }
}

class Shot {
    constructor(x, y, width, height, imgSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
    }

    move(speed) {
        this.x += speed;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}


/// Initializes
let score = 0;

let KEY_SPACE = false;
let KEY_UP = false;
let KEY_DOWN = false;
let KEY_LEFT = false;
let KEY_RIGHT = false;

let lastShotTime = 0;
let canvas;
let ctx;
let updateInterval;
let backgroundImage = new Image();

let ufos = [];
let shots = [];
let rocket;

document.onkeydown = function(e) {  // Button pressed
    if (e.key === " "){ // Space
        KEY_SPACE = true;
    }
    if (e.key === "ArrowUp"){ 
        KEY_UP = true;
    }
    if (e.key === "ArrowDown"){ 
        KEY_DOWN = true;
    }
    if (e.key === "ArrowLeft"){
        KEY_LEFT = true;
    }
    if (e.key === "ArrowRight"){ 
        KEY_RIGHT = true;
    }
}
document.onkeyup = function(e) {    // Button released
    if (e.key === " "){
        KEY_SPACE = false;
    }
    if (e.key === "ArrowUp"){
        KEY_UP = false;
    }
    if (e.key === "ArrowDown"){
        KEY_DOWN = false;
    }
    if (e.key === "ArrowLeft"){
        KEY_LEFT = false;
    }
    if (e.key === "ArrowRight"){ 
        KEY_RIGHT = false;
    }
}


/// Game Functions
function startGame(){
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    loadImages();
    updateInterval = setInterval(update, 1000/25);
    spawnUfos();
    setInterval(checkCollision, 1000/25);
    draw();
}

function endGame(){
    setTimeout(() => {
                alert(`Game over! \nYour score is: ${score} \nDo you want to restart?`);
                location.reload();
            }, 200);
}


/// Collision
function checkCollision(){
    ufos.forEach(function(ufo){         // Collision Ufo -> Rocket
        if(rocket.x + rocket.width > ufo.x &&
            rocket.y + rocket.height > ufo.y &&
            rocket.x < ufo.x + ufo.width && 
            rocket.y < ufo.y + ufo.height
        ){
            rocket.img.src = 'img/boom.png';
            ufos = ufos.filter(u => u != ufo);

            endGame();
        }
        if(ufo.x + ufo.width < 0){
            ufos = ufos.filter(u => u != ufo);

            lives--;
            if(lives < 1){
                endGame();
            }
        }

        shots.forEach(function(shot){   // Collision Shot -> Ufo
            if(ufo.x + ufo.width > shot.x &&
                ufo.y + ufo.height > shot.y &&
                ufo.x < shot.x + shot.width && 
                ufo.y < shot.y + shot.height
            ){
                shots = shots.filter(u => u != shot)
                ufo.img.src = 'img/boom.png';
                setTimeout(() => {
                    ufos = ufos.filter(u => u != ufo);
                }, 70);

                score += ufo.points;
                ufoSpeed += ufoSpeedChange;
            }
            if(shot.x > canvas.width){
                shots = shots.filter(u => u != shot);
            }
        });
    });

}


/// Shots
function createShot(){
    let shot = new Shot(rocket.x + rocket.width, 
        rocket.y + rocket.height/4, 
        40, 20, 'img/laser.png');
    shots.push(shot);
}


/// Ufos
let ufoSpwanCount = 1;

function spawnUfos(){
    if(ufoSpwanCount % 5 === 0){
        createUfo(ufoBigPoints, 'img/ufo2.png', ufoSpeed * 1.5);
        ufoSpwanCount = 1;
    } else {
        createUfo(ufoPoints, 'img/ufo1.png', ufoSpeed);
    }

    let nextSpawn;

    if (Math.random() < 0.1) { //random chance to double spawn
        nextSpawn = 200
    } else {
        //randomize and fasten Ufo spawns
        ufoSpawnRate = Math.max(minSpawnRate, ufoSpawnRate * 0.95);
        nextSpawn = Math.random() * 1000 + ufoSpawnRate;
    }
    
    setTimeout(spawnUfos, nextSpawn); 
}

function createUfo(points, img, speed){
    let ufo = new Ufo(canvas.width,
        Math.random() * (canvas.height - 50) + 5, 
        100, 40, img, points, speed);
    ufos.push(ufo);
    ufoSpwanCount++;
}


/// Visuals
function update(){
    // Button presses
    if(KEY_UP){
        if(rocket.y > 0){
            rocket.moveUp();
        } 
    }
    if(KEY_DOWN){
        if(rocket.y + rocket.height < canvas.height){
            rocket.moveDown();
        }
    }
    if(KEY_LEFT){
        if(rocket.x > 0){
            rocket.moveLeft();
        }
    }
    if(KEY_RIGHT){
        if(rocket.x + rocket.height < 0.8*canvas.width){
            rocket.moveRight();
        }
    }
    if(KEY_SPACE){
        let currentTime = Date.now();
        if (currentTime - lastShotTime >= shotCooldown) { 
            createShot();
            lastShotTime = currentTime;
        }
    }

    //move objects
    ufos.forEach(function(ufo){
        ufo.move();
    });
    shots.forEach(function(shot){
        shot.move(shotSpeed);
    });
}

function loadImages(){
    backgroundImage.src = 'img/spaceBackground.jpg'
    rocket = new Rocket(40, 200, 100, 50, 'img/rocket.png', rocketSpeed);
}

function draw(){ //redraw Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    rocket.draw(ctx);

    ufos.forEach(function(ufo){
        ufo.draw(ctx);
    })
    shots.forEach(function(shot){
        shot.draw(ctx);
    })

    // show Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
    ctx.fillText(`Lives: ${lives}`, 30, 30);

    requestAnimationFrame(draw);
}