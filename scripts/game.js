import { MovingLayeredBackground } from './objects/background.js';
import { NormalUfo, FastUfo } from './objects/enemies.js';
import { Rocket } from './objects/player.js';
import { createShot } from './objects/shots.js';
import { createExplosion } from './objects/explosion.js';
import { keyState } from './functionality/inputHandler.js';
import { collision, deleteObjectFromArray, drawIfVisible } from './functionality/eventHandler.js';
import { endGamePopup } from './functionality/popup.js';

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
let rocketShots = [];
let explosions = [];
let rocket;
let background;



/// Game Functions
function startGame(){
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    background = new MovingLayeredBackground(0.8, 
        'img/background/spaceBackgroundBaseLayer.png', 
        'img/background/spaceBackgroundMiddleLayer.png', 
        'img/background/spaceBackgroundFrontLayer.png');
    rocket = new Rocket(40, 200, 100, 50, 'img/rocket.png', rocketSpeed);

    updateInterval = setInterval(update, 1000/25);
    spawnUfos();
    setInterval(checkCollision, 1000/25);
    draw();
}

function endGame(){
    gameRunning = false;
    endGamePopup(score);
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

        rocketShots.forEach(function(shot){   // Collision Shot -> Ufo
            if(collision(ufo, shot)){
                let explosion = createExplosion(ufo);
                explosions.push(explosion);

                rocketShots = deleteObjectFromArray(rocketShots, shot)
                setTimeout(() => {
                    ufos = deleteObjectFromArray(ufos, ufo);
                    deleteObjectFromArray(explosions, explosion);
                }, 70);

                score += ufo.points;
                ufoSpeed += ufoSpeedChange;
            }
            if(shot.x > canvas.width){
                rocketShots = deleteObjectFromArray(rocketShots, shot);
            }
        });
    });

}


/// Enemies
let ufoSpawnCount = 1;

function spawnUfos(){
    const randomHeight = Math.random() * (canvas.height - 50) + 5;

    if(ufoSpawnCount % 5 === 0){
        ufos.push(new FastUfo(canvas.width, randomHeight, ufoSpeed));
        ufoSpawnCount = 1;
    } else {
        ufos.push(new NormalUfo(canvas.width, randomHeight, ufoSpeed));
        ufoSpawnCount ++;
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
            createShot(rocketShots, rocket.x + rocket.width, rocket.y + rocket.height/4);
            lastShotTime = currentTime;
        }
    }

    //move objects
    ufos.forEach(function(ufo){
        ufo.move();
    });
    rocketShots.forEach(function(shot){
        shot.move(shotSpeed);
    });

    //delet explosion after lifetime
    explosions.forEach(function(explosion){
        if(Date.now() > explosion.initTime + explosionLifetime){
            explosions = deleteObjectFromArray(explosions, explosion);
        }
    });
}


function draw(){ // redraw Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx, canvas);

    // draw objects
    drawIfVisible(ctx, rocket);
    ufos.forEach(function(ufo){
        drawIfVisible(ctx, ufo);
    })
    rocketShots.forEach(function(shot){
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