class physicManager {
    constructor() {

    }

    update(obj) {
        if(obj.moveX === 0 && obj.moveY === 0 && obj.angle === null)
            return 'stop';

        //console.log(`Position: ${obj.posX}, ${obj.posY}`);
        let newX, newY;

        if(obj.angle === null) {
            newX = obj.posX + Math.floor(obj.moveX * obj.speed);
            newY = obj.posY + Math.floor(obj.moveY * obj.speed);
        } else {
            newX = obj.posX + Math.cos(obj.angle) * obj.speed;
            newY = obj.posY + Math.sin(obj.angle) * obj.speed;
        }

        let newCenterX = Math.floor(newX + obj.sizeX / 2.0);
        let newCenterY = Math.floor(newY + obj.sizeY / 2.0);

        let ts = getMapManager().getTilesetIdx(newCenterX, newCenterY);
        let tsX = getMapManager().getTilesetIdx(newCenterX, Math.floor(obj.posY + obj.sizeY / 2.0));
        let tsY = getMapManager().getTilesetIdx(Math.floor(obj.posX + obj.sizeX / 2.0), newCenterY);

        let e = this.entityAtXY(obj, newX, newY);

        if(e !== null && obj.onTouchEntity) {
            obj.onTouchEntity(e);
        }

        if(e !== null && obj.name.includes('enemy') && (e.name.includes('enemy') || e.name.includes('player')))
            return 'break';

        if(!this.walkable(ts) && obj.onTouchMap)
            obj.onTouchMap(ts);

        if(this.walkable(ts)/* && e === null*/) {
            obj.posX = newX;
            obj.posY = newY;
        } else if(this.walkable(tsX)) {
            obj.posX = newX;
        } else if(this.walkable(tsY)) {
            obj.posY = newY;
        } else {
            return 'break';
        }



        return 'move';
    }

    distance(from, to) {
        return Math.sqrt( Math.pow(from.x - to.x, 2) + Math.pow(from.x - to.y, 2) );
    }

    walkable(idx) {
        let blocks = gameScenes[getScoreManager().currentLevel].walkable;

        for(let block of blocks) {
            if( idx === block )
                return true;
        }

        return false;
    }

    entityAtXY(obj, x, y) {
        for(let entity of getGameManager().entities) {
            if(entity.name !== obj.name) {
                if(x + obj.sizeX < entity.posX ||
                   y + obj.sizeY < entity.posY ||
                   x > entity.posX + entity.sizeX ||
                   y > entity.posY + entity.sizeY
                ) continue;

                return entity;
            }
        }
        return null;
    }
}