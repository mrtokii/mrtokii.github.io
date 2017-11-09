class Enemy extends Entity {
    constructor() {
        super();

        this.health = 0;
        this.ammo = 0;

        this.moveX = 0;
        this.moveY = 0;
        this.speed = 1;
        this.angle = 0;

        this.difficulty = 0.1;

        this.canFire = true;
        this.canTestFire = true;
        this.noObstacles = false;

        this.spotRadius = 300;
    }

    draw() {
        sm.drawSprite(context, 'enemy-shooting', this.posX, this.posY, this.angle);
    }

    update() {
        let distanceToPlayer = Math.sqrt( Math.pow(this.posX - getGameManager().player.posX, 2) + Math.pow(this.posY - getGameManager().player.posY, 2) );

        if( distanceToPlayer < this.spotRadius && distanceToPlayer > 32) {

            let playerDelta = {
                x: getGameManager().player.posX - this.posX,
                y: getGameManager().player.posY - this.posY
            };
            this.angle = Math.atan2(playerDelta.y, playerDelta.x);
            if(this.angle < 0)
                this.angle += Math.PI * 2;

            this.speed = 1;
            this.testFire();

            if(this.noObstacles) {
                this.fire();
            }

        } else {
            this.speed = 0;
        }

        getPhysicManager().update(this);
    }

    onTouchEntity(entity) {

    }

    fire() {
        if(this.canFire) {
            let bullet = new EnemyBullet();

            bullet.sizeX = 8;
            bullet.sizeY = 8;

            bullet.name = 'ebullet' + (++getGameManager().fireNum);

            bullet.angle = this.angle;

            bullet.posX = this.posX;
            bullet.posY = this.posY;

            bullet.posX = this.posX + this.sizeX / 2 - 4 + Math.cos(this.angle) * 4;
            bullet.posY = this.posY + this.sizeY / 2 - 4 + Math.sin(this.angle) * 4;

            getGameManager().entities.push(bullet);

            getAudioManager().playWorldSound('res/sounds/shot.mp3', this.posX, this.posY);

            this.canFire = false;
            setTimeout( () => {
                let entity = getGameManager().entity(this.name);
                if(entity !== null) entity.canFire = true;
            }, bullet.delay);
        }

    }

    testFire() {
        if(this.canTestFire) {
            let sampleBullet = new TestBullet();

            sampleBullet.sizeX = 8;
            sampleBullet.sizeY = 8;

            sampleBullet.name = 'tbullet' + (++getGameManager().fireNum);

            sampleBullet.angle = this.angle;

            sampleBullet.posX = this.posX + this.sizeX / 2;
            sampleBullet.posY = this.posY + this.sizeY / 2;

            sampleBullet.creator = this.name;

            getGameManager().entities.push(sampleBullet);

            this.canTestFire = false;
            setTimeout( () => {
                let entity = getGameManager().entity(this.name);
                if(entity !== null) entity.canTestFire = true;
            }, sampleBullet.delay);
        }

    }

    kill() {
        let body = new EnemyBody();
        body.name = 'ebody' + (++getGameManager().fireNum);
        body.angle = this.angle - Math.PI;
        body.sizeX = 32;
        body.sizeY = 32;
        body.posX = this.posX;
        body.posY = this.posY;

        getGameManager().entities.unshift(body);

        getGameManager().kill(this);
    }
}