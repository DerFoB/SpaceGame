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

export class Boss extends Enemy {
    constructor(canvas) {
        const canonWidth = 80;
        const canonHeight = 40;
        super(canvas.width + 2/3*canonWidth, 0, 80, canvas.height, 'img/enemies/BossTemp.png', 20, 0.5);
        this.canon = new Canon(canvas.width, canvas.height/2 - canonHeight/2, canonWidth, canonHeight, this.speed);
        this.canonWidth = canonWidth;
        this.canonHeight = canonHeight;
    }

    draw(ctx){
        super.draw(ctx);
        this.canon.draw(ctx);
    }

    move() {
        super.move();
        this.canon.move();
    }
}

class Canon extends Gameobject {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height, 'img/enemies/BossCanonTemp.png');
        this.speed = speed;
    }

    move() {
        this.x -= this.speed;
    }
}