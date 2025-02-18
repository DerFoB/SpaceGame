import { Gameobject } from "./gameObject.js";

export class Explosion extends Gameobject {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
        this.initTime = Date.now();
    }
}