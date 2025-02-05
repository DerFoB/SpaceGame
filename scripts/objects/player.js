export class Rocket {
    constructor(x, y, width, height, imgSrc, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}