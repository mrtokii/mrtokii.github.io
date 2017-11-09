class EnemyBody extends Entity {
    constructor() {
        super();

        this.moveX = 0;
        this.moveY = 0;
        this.speed = 0;
        this.angle = 0;

        this.ammo = 2;
    }

    draw() {
        sm.drawSprite(context, 'enemy-body', this.posX, this.posY, this.angle);
    }

    update() {
        //getPhysicManager().update(this);
    }

    onTouchEntity(entity) {

    }

    kill() {
        getGameManager().kill(this);
    }
}