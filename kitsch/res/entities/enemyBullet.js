class EnemyBullet extends Entity {
    constructor() {
        super();

        this.moveX = 0;
        this.moveY = 0;

        this.delay = 800;

        this.angle = 0;

        this.speed = 4;
    }

    draw() {
        sm.drawSprite(context, 'bullet', this.posX, this.posY, this.angle);
    }

    update() {
        getPhysicManager().update(this);
    }

    onTouchEntity(entity) {
        if(entity.name.includes('player')) {
            console.log(`KILLED U`);
            //getGameManager().reloadScene();
            this.kill();
        }
    }

    onTouchMap(idx) {
        this.kill();
    }

    kill() {
        getGameManager().kill(this);
    }
}