class Enemy {
    constructor(x, y, width, height, imgSrc, points, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
        this.points = points;
        this.speed = speed;
    }

    move() {
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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

