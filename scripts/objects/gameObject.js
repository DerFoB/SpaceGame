export class Gameobject {
    constructor(x, y, width, height, imgSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
        this.visible = true;
    }

    move() {
        throw new Error("Method 'move()' must be implemented in subclass");
    }

    draw(ctx) {
        if (this.visible === true) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}