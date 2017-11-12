class EnemyBullet extends Entity {
    constructor() {
        super();

        this.moveX = 0;
        this.moveY = 0;

        this.delay = 600;

        this.angle = 0;

        this.speed = 13;
    }

    draw() {
        sm.drawSprite(context, 'bullet', this.posX, this.posY, this.angle);
    }

    update() {
        getPhysicManager().update(this);
    }

    onTouchEntity(entity) {
        if(entity.name.includes('player')) {



            let dist = Math.sqrt(Math.pow( (this.posX + this.sizeX/2) - (entity.posX + entity.sizeX/2), 2) + Math.pow( (this.posY + this.sizeY/2) - (entity.posY + entity.sizeY/2) , 2));
            if( dist < 15 ) {

                if(!getGameManager().cheats.baguvix) {
                    console.log(`KILLED PLAYER`);
                    getGameManager().reloadScene();
                }

                this.kill();
            } else {
                let missSounds = [
                    'res/sounds/miss.mp3',
                    'res/sounds/miss2.mp3',
                    'res/sounds/miss3.mp3',
                    'res/sounds/miss4.mp3',
                    'res/sounds/miss5.mp3',
                    'res/sounds/miss6.mp3',
                    'res/sounds/miss7.mp3',
                    'res/sounds/miss.mp3'
                ];
                getAudioManager().play(missSounds[Math.floor(Math.random() * 7)]);
                //console.log(`Almost killed: ${dist}!`);
            }

        }
    }

    onTouchMap(idx) {
        this.kill();
    }

    kill() {
        getGameManager().kill(this);
    }
}