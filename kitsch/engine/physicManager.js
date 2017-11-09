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


        let ts = getMapManager().getTilesetIdx(Math.floor(newX + obj.sizeX / 2.0), Math.floor(newY + obj.sizeY / 2.0));
        //console.log(`COODRS: ${Math.floor(newX + obj.sizeX / 2.0)}, ${Math.floor(newY + obj.sizeY / 2.0)}`);
        let e = this.entityAtXY(obj, newX, newY);

        if(e !== null && obj.onTouchEntity) {
            obj.onTouchEntity(e);
        }

        if(ts !== 7 && obj.onTouchMap)
            obj.onTouchMap(ts);

        if(ts === 7/* && e === null*/) {
            obj.posX = newX;
            obj.posY = newY;
        } else {
            return 'break';
        }

        return 'move';
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