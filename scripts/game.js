import { MovingLayeredBackground } from './objects/background.js';
import { NormalUfo, FastUfo, Boss } from './objects/enemies.js';
import { Rocket } from './objects/player.js';
import { keyState } from './functionality/inputHandler.js';
import { collision, deleteObjectFromArray } from './functionality/eventHandler.js';
import { endGamePopup } from './functionality/popup.js';

/// Settings 
const rocketSpeed = 12;
let lives = 5;

let ufoSpeed = 5;
const ufoSpeedChange = 0.1;
let ufoSpawnRate = 4000;
const minSpawnRate = 1000;

const maxShots = 12;
const reloadTime = 2000;
 
const explosionLifetime = 150;

const bossCooldown = 60000;

/// Initializes
let score = 0;
let gameRunning = true;

let bossActive = false;
let bossCount = 1;
let lastBossTime = Date.now();

let ammoCount;
let canvas;
let ctx;
let updateInterval;
let collisionInterval;
let drawFrame; 

let ufos = [];
let rocketShots = [];
let enemyShots = [];
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
    setTimeout(() => {
        spawnUfos();
    }, 4000);
    
    collisionInterval = setInterval(checkCollision, 1000/25);
    draw();
}

function endGame(){
    gameRunning = false;
    setTimeout(() => {
        window.cancelAnimationFrame(drawFrame); // stop drawing
        clearInterval(updateInterval);
        clearInterval(collisionInterval);
    }, 50);

    endGamePopup(score);
}
    


/// Collision
function checkCollision(){
    ufos.forEach(function(ufo){         // Collision Ufo -> Rocket
        if(collision(rocket, ufo)){
            explosions.push(rocket.explode());

            ufos = deleteObjectFromArray(ufos, ufo);

            endGame();
  
        }
        if(ufo.x + ufo.width < 0){      // Collision Ufo -> End Zone
            ufos = deleteObjectFromArray(ufos, ufo);

            if(gameRunning === true){
                lives--;
                if(lives < 1){
                    explosions.push(rocket.explode());
                    
                    endGame();
                }
            }
        }

        rocketShots.forEach(function(shot){   // Collision Shot -> Ufo
            if(collision(ufo, shot)){
                explosions.push(ufo.explode());
                score += ufo.points;

                rocketShots = deleteObjectFromArray(rocketShots, shot)
                ufos = deleteObjectFromArray(ufos, ufo);

                ufoSpeed += ufoSpeedChange;
            }           
        });
    });

    rocketShots.forEach(function(shot){   // Collision Shot -> Ufo
        if(shot.x > canvas.width){
            rocketShots = deleteObjectFromArray(rocketShots, shot);
        }

        bosses.forEach(function(boss){
            if(collision(shot, boss)){
                boss.hit();
                rocketShots = deleteObjectFromArray(rocketShots, shot);

                if(boss.hp <= 0){
                    explosions.push(...boss.explode(7));
                    score += boss.points;

                    bosses = deleteObjectFromArray(bosses, boss);

                    setTimeout(() => {
                        spawnUfos();
                    }, 2000);
                    
                    lastBossTime = Date.now();
                    bossActive = false;
                    bossCount++;
                }
            }
        });
    });

    enemyShots.forEach(function(enemyShot){ // Collision EnemyShots -> Rocket
        if(collision(rocket, enemyShot)){
            explosions.push(rocket.explode());

            enemyShots = deleteObjectFromArray(enemyShots, enemyShot);

            endGame();
        }
        if(enemyShot.x + enemyShot.width < 0){      // Collision EnemyShots -> End Zone
            enemyShots = deleteObjectFromArray(enemyShots, enemyShot);
        }
    });
}


/// Enemies
let ufoSpawnCount = 1;

function spawnUfos(){
    if (bossActive) {
        return;
    }

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
    
    if(!bossActive){
        setTimeout(spawnUfos, nextSpawn); 
    }
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
        if(currentTime - rocket.lastShotTime >= rocket.shotCooldown && ammoCount > 0){
            rocketShots.push(rocket.shoot());
            rocket.lastShotTime = currentTime;
            ammoCount--; 
        }     
    }

    // reload ammo
    if (currentTime - rocket.lastShotTime >= reloadTime){
        ammoCount = maxShots;
    }

    // move objects
    ufos.forEach(function(ufo){
        ufo.move();
    });
    rocketShots.forEach(function(shot){
        shot.move();
    });
    bosses.forEach(function(boss) { // + boss logic
        if(boss.x > canvas.width - boss.width) {
            boss.move();
        }

        boss.homingCanon.aim(rocket.y, 0.05)

        const homingShot = boss.homingCanon.shoot();
        if(homingShot) {
            enemyShots.push(homingShot);
        }
        const rapidShot = boss.rapidfire();
        if(rapidShot){
            enemyShots.push(...rapidShot);
        }
    });
    enemyShots.forEach(function(enemyShot){
        enemyShot.move();
    });

    if(currentTime - lastBossTime >= bossCooldown && !bossActive){
        bossActive = true;
        bosses.push(new Boss(canvas, Math.min(bossCount, 5), 10, "Spacemo"));
    }

    // delete explosion after lifetime
    explosions.forEach(function(explosion){
        if(currentTime > explosion.initTime + explosionLifetime){
            explosions = deleteObjectFromArray(explosions, explosion);
        }
    });
}

const hudMargin = 30;
const ammoSize = {width: 10, height: 20, padding: 5};
const bossBar = {width: 1/3*document.getElementById('gameCanvas').width, height: 20, padding: 3};

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
    enemyShots.forEach(function(enemyShot){
        enemyShot.draw(ctx);
    })
    bosses.forEach(function(boss){
        boss.draw(ctx);
    })

    //// HUD
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    
    /// Score
    ctx.fillText(`Score: ${score}`, canvas.width - 120, hudMargin);

    /// Lives
    let livesTxt = 'Lives: ';
    for (let i = 0; i < lives; i++) {
        livesTxt += '🤍';
    }
    ctx.fillText(livesTxt, hudMargin, hudMargin);
    
    ctx.beginPath();
    ctx.strokeStyle = "white";

    /// Ammo
    // munition
    for (let i = 0; i < ammoCount; i++) {
        ctx.fillRect(hudMargin + i*(ammoSize.padding + ammoSize.width), 
            canvas.height - hudMargin - ammoSize.height, 
            ammoSize.width, ammoSize.height); 
    }
    // boarder
    ctx.rect(hudMargin - ammoSize.padding,
        canvas.height - hudMargin - ammoSize.height - ammoSize.padding, 
        maxShots * ammoSize.width + (maxShots+1) * ammoSize.padding, 
        ammoSize.height + 2*ammoSize.padding
    );
    // reload bar
    let percentageReloadtimer = Math.min(1 ,(Date.now()-rocket.lastShotTime)/reloadTime); 
    ctx.fillRect(hudMargin - ammoSize.padding, 
        canvas.height - hudMargin - ammoSize.height - 3*ammoSize.padding, 
        percentageReloadtimer * (maxShots * ammoSize.width + (maxShots+1) * ammoSize.padding), 
        ammoSize.padding
    );

    ctx.stroke();


    /// Boss Bar
    if (bossActive) {
        ctx.textAlign = "center";
        ctx.fillStyle = "darkred";
        ctx.font = "bold 30px Arial";
        // Boss Text
        ctx.fillText(bosses[0].name, canvas.width/2, 1.5*hudMargin);

        ctx.beginPath();
        ctx.strokeStyle = "darkred";

        // border
        ctx.rect(bossBar.width - bossBar.padding,
            1.5*hudMargin + 2*bossBar.padding,
            bossBar.width + 2*bossBar.padding,
            bossBar.height + 2*bossBar.padding
        );
        // hp bar
        let percentageBossHP = Math.min(1 ,bosses[0].hp/bosses[0].maxHP);
        ctx.fillRect(bossBar.width,
            1.5*hudMargin + 3*bossBar.padding,
            percentageBossHP * bossBar.width,
            bossBar.height
        );

        ctx.stroke();
    }
    
    drawFrame = requestAnimationFrame(draw);
}

export { startGame };