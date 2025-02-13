import { MovingLayeredBackground } from './objects/background.js';
import { NormalUfo, FastUfo, Boss } from './objects/enemies.js';
import { Rocket } from './objects/player.js';
import { createShot } from './objects/shots.js';
import { createExplosion } from './objects/explosion.js';
import { keyState } from './functionality/inputHandler.js';
import { collision, deleteObjectFromArray } from './functionality/eventHandler.js';
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
const maxShots = 6;
const reloadTime = 2000;
 
const explosionLifetime = 150;

/// Initializes
let score = 0;
let gameRunning = true;

let lastShotTime = 0;
let ammoCount;
let canvas;
let ctx;
let updateInterval;

let ufos = [];
let rocketShots = [];
let explosions = [];
let bosses = [];
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
    rocket = new Rocket(40, canvas.height/2-25, 100, 45, 'img/rocket/rocket.png', rocketSpeed);
    ammoCount = maxShots;

    updateInterval = setInterval(update, 1000/25);
    spawnUfos();
    bosses.push(new Boss(canvas, 3));
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
                if(lives < 1){
                    let explosion = createExplosion(rocket);
                    explosions.push(explosion);
                    
                    endGame();
                }
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

    if (Math.random() < 0.1) { // random chance to fast spawn ufo
        nextSpawn = minSpawnRate
    } else {
        // randomize and fasten Ufo spawns
        ufoSpawnRate = Math.max(minSpawnRate, ufoSpawnRate * 0.95);
        nextSpawn = Math.random() * 1000 + ufoSpawnRate;
    }
    
    setTimeout(spawnUfos, nextSpawn); 
}


/// Basics
function update(){
    let currentTime = Date.now();

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
        if (currentTime - lastShotTime >= shotCooldown && ammoCount > 0) {
            createShot(rocketShots, rocket.x + rocket.width, rocket.y + rocket.height/4);
            lastShotTime = currentTime;
            ammoCount--; 
        }
    }

    // reload ammo
    if (currentTime - lastShotTime >= reloadTime){
        ammoCount = maxShots;
    }

    // move objects
    ufos.forEach(function(ufo){
        ufo.move();
    });
    rocketShots.forEach(function(shot){
        shot.move(shotSpeed);
    });
    bosses.forEach(function(boss) {
        if (boss.x > canvas.width - boss.width) {
            boss.move();
        }
    });

    // delete explosion after lifetime
    explosions.forEach(function(explosion){
        if(Date.now() > explosion.initTime + explosionLifetime){
            explosions = deleteObjectFromArray(explosions, explosion);
        }
    });
}

const hudMargin = 30;
const ammoInnerPadding = 5;
const ammoSize = 20;

function draw(){ // redraw Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx, canvas);

    // draw objects
    rocket.draw(ctx);
    ufos.forEach(function(ufo){
        ufo.draw(ctx);
    })
    rocketShots.forEach(function(shot){
        shot.draw(ctx);
    })
    explosions.forEach(function(explosion){
        explosion.draw(ctx);
    })
    bosses.forEach(function(boss){
        boss.draw(ctx);
    })

    /// HUD
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // Score
    ctx.fillText(`Score: ${score}`, canvas.width - 120, hudMargin);

    // Lives
    let livesTxt = 'Lives: ';
    for (let i = 0; i < lives; i++) {
        livesTxt += '🤍';
    }
    ctx.fillText(livesTxt, hudMargin, hudMargin);
    
    ctx.beginPath();
    ctx.strokeStyle = "white";

    // Ammo
    for (let i = 0; i < ammoCount; i++) {
        ctx.fillRect(hudMargin + i*(ammoInnerPadding + ammoSize), 
            canvas.height - hudMargin - ammoSize, 
            ammoSize, ammoSize); 
    }
    ctx.rect(hudMargin - ammoInnerPadding,
        canvas.height - hudMargin - ammoSize - ammoInnerPadding, 
        maxShots * ammoSize + (maxShots+1) * ammoInnerPadding, 
        ammoSize + 2*ammoInnerPadding);

    // Reload
    let percentageReloadtimer = Math.min(1 ,(Date.now()-lastShotTime)/reloadTime); 
    ctx.fillRect(hudMargin - ammoInnerPadding, 
        canvas.height - hudMargin - ammoSize - 3*ammoInnerPadding, 
        percentageReloadtimer * (maxShots * ammoSize + (maxShots+1) * ammoInnerPadding), 
        ammoInnerPadding); 

    ctx.stroke();

    requestAnimationFrame(draw);
}

export { startGame };