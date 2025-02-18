import { Gameobject } from "./gameObject.js";

export class Shot extends Gameobject {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
    }

    move(speed) {
        this.x += speed;
    }
}

