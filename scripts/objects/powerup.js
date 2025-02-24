import { Gameobject } from "./gameObject.js";

class PowerUp extends Gameobject {
    constructor(x, y, width, height, imgSrc, speed) {
        super(x, y, width, height, imgSrc);
        this.speed = speed;
    }

    move() {
        this.y += this.speed;
    }

    activate() {
        throw new Error("Method 'activate()' must be implemented in subclass");
    }
}

export class MediKit extends PowerUp {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height, "../../img/powerup/medkit.png", speed);
    }

    activate(player, maxHP){
        if(player.hp < maxHP) {
            player.hp++;
        }
    }
}