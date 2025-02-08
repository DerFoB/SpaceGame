import { Gameobject } from "./gameObject.js";

class Explosion extends Gameobject {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
        this.initTime = Date.now();
    }
}

export function createExplosion(obj) {
    obj.visible = false;
    return new Explosion(obj.x, obj.y, obj.width, obj.height, '../../img/boom.png');
}