import { Gameobject } from "./gameObject.js";
import { Explosion } from "./explosion.js";
import { Shot } from "./shots.js";

class Enemy extends Gameobject {
    constructor(x, y, width, height, imgSrc, points, speed) {
        super(x, y, width, height, imgSrc);
        this.points = points;
        this.speed = speed;
    }

    move() {
        this.x -= this.speed;
    }

    explode() {
        this.visible = false;
        return new Explosion(this.x-10, this.y-10, this.width+20, this.height+20, '../../img/explosion.png');
    }
}

export class NormalUfo extends Enemy {
    constructor(x, y, speed) {
        super(x, y, 100, 40, 'img/enemies/normalUfo.png', 1, speed);
    }
}

export class FastUfo extends Enemy {
    constructor(x, y, speed) {
        super(x, y, 80, 30, 'img/enemies/fastUfo.png', 2, 1.2*speed);
    }
}

export class Boss extends Enemy {
    constructor(canvas, nrOfCanons) {
        const canonWidth = 80;
        const canonHeight = 40;
        super(canvas.width + 2/3*canonWidth, 0, 80, canvas.height, 'img/enemies/boss.png', 20, 0.5);
        this.canons = []
        for (let i = 1; i <= nrOfCanons; i++) {
            let canvasOffset = 100 // so canons are better spread
            let canonY =  i*((canvas.height+canvasOffset)/(nrOfCanons+1)) - canonHeight/2 - canvasOffset/2;
            this.canons.push(new Canon(canvas.width, canonY, canonWidth, canonHeight, this.speed));
            
        }
        this.homingCanon = new HomingCanon(canvas.width + 40, canvas.height/2 - canonHeight/2, 
            canonWidth, canonHeight, this.speed);
        this.canonWidth = canonWidth;
        this.canonHeight = canonHeight;
    }

    draw(ctx){
        super.draw(ctx);
        this.canons.forEach(function(canon){
            canon.draw(ctx);
        });
        this.homingCanon.draw(ctx);
    }

    move() {
        super.move();
        this.canons.forEach(function(canon){
            canon.move();
        }); 
        this.homingCanon.move();
    }

    rapidfire(){
        let shots = [];
        for (let canon of this.canons) {
            if (Date.now() - canon.lastShotTime >= canon.shotCooldown) {
                canon.lastShotTime = Date.now();
                shots.push(canon.shoot());
            }
        }
        return shots.length > 0 ? shots : null;
    }
}

class Canon extends Gameobject {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height, 'img/enemies/rapidcanon.png');
        this.speed = speed;
        this.lastShotTime = Date.now();
        this.shotCooldown = 1000;
    }

    move() {
        this.x -= this.speed;
    }

    shoot() {
        return new Shot(this.x, this.y, this.width*1.2 , this.height, 
            '../../img/shots/enemylaser.png', -20);
    }
}

class HomingCanon extends Gameobject {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height, 'img/enemies/homingcanon.png');
        this.speed = speed;
        this.shooting = false;
        this.charging = false;
        this.chargeProgress = 0;
        this.chargeMax = 50;
        this.reloadCooldown = 2500;
        this.lastShotTime = Date.now();
    }

    move() {
        this.x -= this.speed;
    }

    aim(targetY, followSpeed) {
         // followspeed in percentage: 0.01 is slow, 1 is as fast as target
        if (!this.charging) {
            this.y += (targetY - this.y) * followSpeed;
        }
    }

    shoot() {
        if (Date.now() - this.lastShotTime >= this.reloadCooldown) {
            this.charging = true;
            this.chargeProgress++;
            if (this.chargeProgress >= this.chargeMax && 
                this.charging && 
                this.chargeProgress >= this.chargeMax) {
                    this.charging = false;
                    this.chargeProgress = 0;
                    this.lastShotTime = Date.now();
                    return new Shot(this.x, this.y, this.width/1.1, this.height, 
                        '../../img/shots/enemylaser.png', -40);
            }
        }
        return null;
    }

    drawChargeIndicator(ctx) {
        if (this.charging) {
            const alpha = this.chargeProgress / this.chargeMax;
            ctx.fillStyle = `rgba(255, 130, 150, ${alpha})`;
            ctx.fillRect(0, this.y, this.x+20, this.height);

            /*Alternative with Image 
            ctx.globalAlpha = alpha;
            ctx.drawImage(this.loadingBarImg, 0, this.y, this.x, this.height);
            ctx.globalAlpha = 1.0;
            */
        }
    }

    draw(ctx) {
        if (this.visible === true) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            this.drawChargeIndicator(ctx);
        }
    }
}
