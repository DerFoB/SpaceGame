import { MovingBackground } from './objects/background.js';
import { NormalUfo, FastUfo } from './objects/enemies.js';
import { Rocket } from './objects/player.js';
import { Shot } from './objects/shots.js';
import { Explosion } from './objects/explosion.js';
import { keyState } from './functionality/inputHandler.js';
import { collision, deleteObjectFromArray } from './functionality/eventHandler.js';

/// Settings
const rocketSpeed = 12;
let lives = 5;

const ufoSpeedChange = 0.2;
let ufoSpawnRate = 5000;
const minSpawnRate = 1000;

const shotSpeed =  15;
const shotCooldown = 300;


/// Initializes
let score = 0;

let lastShotTime = 0;
let canvas;
let ctx;
let updateInterval;

let ufos = [];
let shots = [];
let rocket;
let background;


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
        if(collision(rocket, ufo)){
            rocket.img.src = 'img/boom.png';
            ufos = deleteObjectFromArray(ufos, ufo);

            endGame();
        }
        if(ufo.x + ufo.width < 0){      // Collision Ufo -> End Zone
            ufos = deleteObjectFromArray(ufos, ufo);

            lives--;
            if(lives < 1){
                endGame();
            }
        }

        shots.forEach(function(shot){   // Collision Shot -> Ufo
            if(collision(ufo, shot)){
                shots = shots.filter(u => u != shot);
                ufo.img.src = 'img/boom.png';
                setTimeout(() => {
                    ufos = deleteObjectFromArray(ufos, ufo);
                }, 70);

                score += ufo.points;
                ufo.speedChange(ufoSpeedChange);
            }
            if(shot.x > canvas.width){
                shots = deleteObjectFromArray(shots, shot);
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
    const randomHeight = Math.random() * (canvas.height - 50) + 5;

    if(ufoSpwanCount % 5 === 0){
        createUfo(new FastUfo(canvas.width, randomHeight));
        ufoSpwanCount = 1;
    } else {
        createUfo(new NormalUfo(canvas.width, randomHeight));
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

function createUfo(ufo){
    ufos.push(ufo);
    ufoSpwanCount++;
}


/// Basics
function update(){
    // Button presses
    if (keyState.KEY_UP && rocket.y > 0) {
        rocket.moveUp();
    }
    if (keyState.KEY_DOWN && rocket.y + rocket.height < canvas.height) {
        rocket.moveDown();
    }
    if (keyState.KEY_LEFT && rocket.x > 0) {
        rocket.moveLeft();
    }
    if (keyState.KEY_RIGHT && rocket.x + rocket.width < 0.8 * canvas.width) {
        rocket.moveRight();
    }
    if (keyState.KEY_SPACE) {
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
    background = new MovingBackground('img/spaceBackground.jpg')
    rocket = new Rocket(40, 200, 100, 50, 'img/rocket.png', rocketSpeed);
}

function draw(){ //redraw Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx, canvas);
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

export { startGame };