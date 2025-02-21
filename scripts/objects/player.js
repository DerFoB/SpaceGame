import { Gameobject } from "./gameObject.js";
import { Shot } from "./shots.js";
import { Explosion } from "./explosion.js";

export class Rocket extends Gameobject{
    constructor(x, y, width, height, imgSrc, speed) {
        super(x, y, width, height, imgSrc);
        this.speed = speed;
        this.shotCooldown = 300;
        this.lastShotTime = 0;
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

    shoot() {
        return new Shot(this.x + this.width, this.y + this.height/4, 40, 20, '../../img/shots/laser.png', 15);
    }

    explode() {
        this.visible = false;
        return new Explosion(this.x-10, this.y-10, this.width+20, this.height+20, '../../img/explosion.png');
    }
}