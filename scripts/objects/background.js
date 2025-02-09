export class MovingBackground {
    constructor(speed, src) {
        this.x = 0;
        this.speed = speed;
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

export class MovingLayeredBackground {
    constructor(speed, srcBase, srcMiddle, srcFront) {
        this.speed = speed;
        this.layers = [
            { x: 0, speedFactor: 0.3, image: this.createImage(srcBase) },
            { x: 0, speedFactor: 0.5, image: this.createImage(srcMiddle) },
            { x: 0, speedFactor: 1.0, image: this.createImage(srcFront) }
        ];
    }

    createImage(src) {
        let img = new Image();
        img.src = src;
        return img;
    }

    draw(ctx, canvas) {
        this.layers.forEach(layer => {
            ctx.drawImage(layer.image, layer.x, 0, canvas.width, canvas.height);
            ctx.drawImage(layer.image, layer.x + canvas.width - 1, 0, canvas.width, canvas.height);

            layer.x -= layer.speedFactor * this.speed;

            if (layer.x <= -canvas.width) {
                layer.x = 0;
            }
        });
    }
}