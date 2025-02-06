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

    speedChange(speedChange) {
        this.speed += speedChange;
    }
}

export class NormalUfo extends Enemy {
    constructor(x, y) {
        super(x, y, 100, 40, 'img/enemies/normalUFo.png', 1, 5);
    }
}

export class FastUfo extends Enemy {
    constructor(x, y) {
        super(x, y, 80, 30, 'img/enemies/fastUfo.png', 2, 8);
    }
}

