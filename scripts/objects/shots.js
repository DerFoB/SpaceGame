import { Gameobject } from "./gameObject.js";

export class Shot extends Gameobject {
    constructor(x, y, width, height, imgSrc, speed) {
        super(x, y, width, height, imgSrc);
        this.speed = speed;
    }

    move() {
        this.x += this.speed;
    }
}

