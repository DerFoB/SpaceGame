import { Gameobject } from "./gameObject.js";

class Explosion extends Gameobject {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
        this.initTime = Date.now();
    }
}

export function createExplosion(obj) {
    obj.visible = false;
    return new Explosion(obj.x-10, obj.y-10, obj.width+20, obj.height+20, '../../img/explosion.png');
}