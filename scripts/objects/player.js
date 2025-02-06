import { Gameobject } from "./gameObject.js";

export class Rocket extends Gameobject{
    constructor(x, y, width, height, imgSrc, speed) {
        super(x, y, width, height, imgSrc);
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
}