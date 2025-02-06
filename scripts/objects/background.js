export class MovingBackground {
    constructor(src) {
        this.x = 0;
        this.speed = 0.5;
        this.image = new Image();
        this.image.src = src;
    }

    draw(ctx, canvas) {
        ctx.drawImage(this.image, this.x, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, this.x + canvas.width-1, 0, canvas.width, canvas.height);
    
        this.x -= this.speed;
    
        // Reset image as soon as it is completely out of the canvas
        if (this.x <= -canvas.width) {
            this.x = 0;
        }
    }
}