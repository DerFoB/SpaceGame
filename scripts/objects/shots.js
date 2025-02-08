import { Gameobject } from "./gameObject.js";

class Shot extends Gameobject {
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
    }

    move(speed) {
        this.x += speed;
    }
}

export function createShot(arr, initX, initY){
    let shot = new Shot(initX, initY, 40, 20, '../../img/laser.png');
    arr.push(shot);
}