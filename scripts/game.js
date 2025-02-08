import { MovingBackground } from './objects/background.js';
import { NormalUfo, FastUfo } from './objects/enemies.js';
import { Rocket } from './objects/player.js';
import { Shot } from './objects/shots.js';
import { createExplosion } from './objects/explosion.js';
import { keyState } from './functionality/inputHandler.js';
import { collision, deleteObjectFromArray, drawIfVisible } from './functionality/eventHandler.js';
import { showRestartPopup } from './functionality/popup.js';

/// Settings
const rocketSpeed = 12;
let lives = 5;

let ufoSpeed = 5;
const ufoSpeedChange = 0.2;
let ufoSpawnRate = 5000;
const minSpawnRate = 1000;

const shotSpeed =  15;
const shotCooldown = 300;

const explosionLifetime = 100;

/// Initializes
let score = 0;
let gameRunning = true;

let lastShotTime = 0;
let canvas;
let ctx;
let updateInterval;

let ufos = [];
let shots = [];
let explosions = [];
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
    gameRunning = false;
    setTimeout(() => {
        let highscorePlayer;
    
        if (localStorage.getItem("highscore") !== null) {
            highscorePlayer = JSON.parse(localStorage.getItem("highscore"));
        } else {
            highscorePlayer = { name: "unknown", score: -99 };
        }
    
        let modal = document.getElementById("gameModal");
        let modalTitle = document.getElementById("modalTitle");
        let modalMessage = document.getElementById("modalMessage");
        let inputField = document.getElementById("playerNameInput");
        let modalButton = document.getElementById("modalButton");
        let overlay = document.getElementById("overlay");

        overlay.style.display = "block"; // blur background
    
        // if new highscore
        if (score > highscorePlayer.score) {
            modalTitle.innerText = "New Highscore!";
            modalMessage.innerText = `Your highscore is: ${score}\nEnter your name:`;
            inputField.style.display = "block"; // show input
            modalButton.innerText = "Save";
    
            modal.style.display = "block"; // show Popup
    
            modalButton.onclick = function () {
                let playerName = inputField.value.trim() || "unknown";
    
                // save highscore
                highscorePlayer.name = playerName;
                highscorePlayer.score = score;
                localStorage.setItem("highscore", JSON.stringify(highscorePlayer));
    
                showRestartPopup(`New Highscore!!!\nYour highscore: ${score} by ${playerName}`);
            };
        } else {
            showRestartPopup(`Your score: ${score}\nLocal highscore: ${highscorePlayer.score} by ${highscorePlayer.name}`);
        }
    }, 200);
}


/// Collision
function checkCollision(){
    ufos.forEach(function(ufo){         // Collision Ufo -> Rocket
        if(collision(rocket, ufo)){
            let explosion = createExplosion(rocket);
            explosions.push(explosion);

            ufos = deleteObjectFromArray(ufos, ufo);

            endGame();
  
        }
        if(ufo.x + ufo.width < 0){      // Collision Ufo -> End Zone
            ufos = deleteObjectFromArray(ufos, ufo);

            if(gameRunning === true){
                lives--;
            }
            if(lives < 1){
                endGame();
            }
        }

        shots.forEach(function(shot){   // Collision Shot -> Ufo
            if(collision(ufo, shot)){
                let explosion = createExplosion(ufo);
                explosions.push(explosion);

                shots = deleteObjectFromArray(shots, shot)
                setTimeout(() => {
                    ufos = deleteObjectFromArray(ufos, ufo);
                    deleteObjectFromArray(explosions, explosion);
                }, 70);

                score += ufo.points;
                ufoSpeed += ufoSpeedChange;
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
        createUfo(new FastUfo(canvas.width, randomHeight, ufoSpeed));
        ufoSpwanCount = 1;
    } else {
        createUfo(new NormalUfo(canvas.width, randomHeight, ufoSpeed));
    }

    let nextSpawn;

    if (Math.random() < 0.1) { //random chance to fast spawn ufo
        nextSpawn = 700
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

    //delet explosion after lifetime
    explosions.forEach(function(explosion){
        if(Date.now() > explosion.initTime + explosionLifetime){
            explosions = deleteObjectFromArray(explosions, explosion);
        }
    });
}

function loadImages(){
    background = new MovingBackground('img/spaceBackground.jpg')
    rocket = new Rocket(40, 200, 100, 50, 'img/rocket.png', rocketSpeed);
}

function draw(){ //redraw Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx, canvas);
    drawIfVisible(ctx, rocket);
    ufos.forEach(function(ufo){
        drawIfVisible(ctx, ufo);
    })
    shots.forEach(function(shot){
        drawIfVisible(ctx, shot);
    })
    explosions.forEach(function(explosion){
        drawIfVisible(ctx, explosion);
    })

    // show Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
    ctx.fillText(`Lives: ${lives}`, 30, 30);

    requestAnimationFrame(draw);
}

export { startGame };