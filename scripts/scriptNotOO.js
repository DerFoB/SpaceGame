let KEY_SPACE = false;  //32
let KEY_UP = false;     //38
let KEY_DOWN = false;   //40

let rocketSpeed = 12;
let rocketSpeedChange = 0.2;
let ufoSpeed = 8;
let shotSpeed =  15;
let shotCooldown = 300;
let ufoSpawnRate = 5000;
let minSpawnRate = 1000;

let score = 0;

let lastShotTime = 0;
let canvas;
let ctx;
let updateInterval;
let backgroundImage = new Image();

let rocket = {
    x: 40,
    y: 200,
    width: 100,
    height: 50,
    src: 'img/rocket.png'
};

let ufos = [];
let shots = [];

document.onkeydown = function(e) { //gedrückt
    if (e.key === " "){ // Space
        KEY_SPACE = true;
    }
    if (e.key === "ArrowUp"){ // ArrowUp
        KEY_UP = true;
    }
    if (e.key === "ArrowDown"){ // ArrowDown
        KEY_DOWN = true;
    }
}
document.onkeyup = function(e) { //losgelassen
    if (e.key === " "){ // Space
        KEY_SPACE = false;
    }
    if (e.key === "ArrowUp"){ // ArrowUp
        KEY_UP = false;
    }
    if (e.key === "ArrowDown"){ // ArrowDown
        KEY_DOWN = false;
    }
}

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

function checkCollision(){
    ufos.forEach(function(ufo){
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

            score -= 1;
            if(score < 0){
                endGame();
            }
        }

        shots.forEach(function(shot){
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

                score += 1;
                ufoSpeed += rocketSpeedChange;
            }
            if(shot.x > canvas.width){
                shots = shots.filter(u => u != shot);
            }
        });
    });

}

function createShot(){
    let shot = {
        x: rocket.x + rocket.width,
        y: rocket.y + rocket.height/4,
        width: 40,
        height: 20,
        src: 'img/laser.png',
        img: new Image()
    };
    shot.img.src = shot.src //load picture
    shots.push(shot)
}

function spawnUfos(){
    createUfos();
    
    ufoSpawnRate = Math.max(minSpawnRate, ufoSpawnRate * 0.95);

    let nextSpawn = Math.random() * 1000 + ufoSpawnRate;
    
    setTimeout(spawnUfos, nextSpawn); 
}

function createUfos(){
    let ufo = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 50) + 5,
        width: 100,
        height: 40,
        src: 'img/ufo.png',
        img: new Image()
    };
    ufo.img.src = ufo.src //load picture
    ufos.push(ufo)
}

function update(){
    if(KEY_UP){
        rocket.y -= rocketSpeed; 
    }
    if(KEY_DOWN){
        rocket.y += rocketSpeed;
    }
    if(KEY_SPACE){
        let currentTime = Date.now();
        if (currentTime - lastShotTime >= shotCooldown) { 
            createShot();
            lastShotTime = currentTime;
        }
    }

    ufos.forEach(function(ufo){
        ufo.x -= ufoSpeed;
    });
    shots.forEach(function(shot){
        shot.x += shotSpeed;
    });
}

function loadImages(){
    backgroundImage.src = 'img/spaceBackground.jpg'
    rocket.img = new Image();
    rocket.img.src = rocket.src;
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

    ufos.forEach(function(ufo){
        ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
    })
    shots.forEach(function(shot){
        ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
    })

    // show Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);

    requestAnimationFrame(draw);
}