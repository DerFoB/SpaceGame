import { Gameobject } from "./gameObject.js";

class Enemy extends Gameobject {
    constructor(x, y, width, height, imgSrc, points, speed) {
        super(x, y, width, height, imgSrc);
        this.points = points;
        this.speed = speed;
    }

    move() {
        this.x -= this.speed;
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

