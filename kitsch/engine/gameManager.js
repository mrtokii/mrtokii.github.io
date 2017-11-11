class gameManager {
    constructor() {
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;
        this.player = null;
        this.laterKill = [];

        this.worldUpdateTimer = null;

        this.pause = false;
    }

    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    update() {
        if(this.player === null) {
            return;
        }

        if(getEventsManager().action['pause']) {

            this.togglePause();
            getEventsManager().action['pause'] = false;
        }

        if(!this.pause) {

            //console.log(`Update world`);

            this.player.moveX = 0;
            this.player.moveY = 0;

            if(getEventsManager().action['up']) this.player.moveY = -1;
            if(getEventsManager().action['down']) this.player.moveY = 1;
            if(getEventsManager().action['left']) this.player.moveX = -1;
            if(getEventsManager().action['right']) this.player.moveX = 1;

            if(getEventsManager().action['fire']) this.player.fire();

            if(getEventsManager().action['restart']) {
                this.reloadScene();
                getEventsManager().action['restart'] = false;
            }

            for(let entity of this.entities) {
                try { entity.update(); } catch(ex) { console.log(`Error updating entity ${entity.name}`); }
            }

            for(let i = 0; i < this.laterKill.length; i++) {
                let idx = this.entities.indexOf(this.laterKill[i]);
                if(idx > -1)
                    this.entities.splice(idx, 1);
            }

            if(this.laterKill.length > 0) {
                this.laterKill.length = 0;
            }

            this.draw(getCurrentContext());
        }

    }

    togglePause() {
        if(this.pause) {
            console.log(`UNPAUSE`);
            getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
            this.pause = false;
        } else {
            console.log(`PAUSE`);
            getAudioManager().frequencyRamp(140, 1);
            //getGameManager().clearScreen();
            getHudManager().drawTitleText('Pause');
            getHudManager().drawSubtitleText('Press  \`P\`  to  continue');
            this.pause = true;
        }
    }

    entity(name) {
        for(let i = 0; i < this.entities.length; i++) {
            if(this.entities[i].name === name) {
                return this.entities[i];
            }
        }
        return null;
    }

    draw() {
        if(this.player !== null) {
            getMapManager().centerAt(this.player.posX, this.player.posY);

            getMapManager().draw(getCurrentContext());


            for(let entity of this.entities) {
                entity.draw(getCurrentContext());
            }

            getHudManager().drawGameHud();
        }


    }

    loadScene(sc) {
        this.clearScreen();

        getMapManager().jsonLoaded = false;
        getMapManager().imagesLoaded = false;
        getMapManager().imgLoadCounter = 0;
        getMapManager().camera = {x: 0, y: 0, w: 800, h: 600};

        getMapManager().loadMap('res/maps/' + sc.map);

        console.log(`Loading scene "${sc.sceneName}"`);
        setTimeout(this.loadSceneFinish, 10);
    }

    clearScreen() {
        getCurrentContext().fillStyle = "black";
        getCurrentContext().fillRect(0, 0, getCurrentCanvas().width, getCurrentCanvas().height);
    }

    stopScene() {
        clearInterval(this.worldUpdateTimer);


        this.entities = [];
        this.player = null;

        this.clearScreen();
    }

    levelCompleted() {

        if( getEventsManager().action['fire'] ) {

            completedLevel(getScoreManager().currentLevel);

        } else {
            getGameManager().stopScene();
            getAudioManager().frequencyRamp(140, 1);
            getHudManager().drawHero('endlevel');
            getHudManager().drawEndLevel();
            setTimeout( getGameManager().levelCompleted, 20 );
        }

    }

    reloadScene() {
        this.stopScene();
        getScoreManager().clearCurrentRecording();

        getMapManager().parseMap(JSON.stringify(getMapManager().mapData));
        getMapManager().parseEntities();

        getGameManager().play();
    }

    playerPosOnScreen() {
        var scaleX = getCurrentCanvas().getBoundingClientRect().width / getCurrentCanvas().offsetWidth;
        var scaleY = getCurrentCanvas().getBoundingClientRect().height / getCurrentCanvas().offsetHeight;

        let x = getCurrentCanvas().getBoundingClientRect().left +
            (getGameManager().player.posX + Math.floor(getGameManager().player.sizeX / 2.0) - getMapManager().camera.x) * scaleX;
        let y = getCurrentCanvas().getBoundingClientRect().top +
            (getGameManager().player.posY + Math.floor(getGameManager().player.sizeY / 2.0) - getMapManager().camera.y) * scaleY;

        return { x, y };
    }

    loadSceneFinish(sc) {
        console.log(`Loading scene:`);
        let jobs = 2;

        if( getMapManager().jsonLoaded ) {
            jobs--;
            console.log(`[S]: Map JSON loaded`);
        }

        if( getMapManager().imagesLoaded ) {
            jobs--;
            console.log(`[S]: Map images loaded`);
        }

        if( jobs === 0 ) {
            console.log(`[S]: COMPLETE`);

            // Launching
            getGameManager().reloadScene();
        } else {
            setTimeout(getGameManager().loadSceneFinish, 50);
        }

    }

    loadResources() {
        console.log(`Loading resources:`);
        getHudManager().drawLoadingScreen();

        getSpriteManager().loadAtlas('res/images/sprites.png', 'res/images/sprites.json');
        getEventsManager().setup(getCurrentCanvas());

        getAudioManager().init();
        getAudioManager().loadArray([
            'res/sounds/timecop-loop.mp3',
            'res/sounds/pacemaker-loop.mp3',
            'res/sounds/riot-loop.mp3',
            'res/sounds/death.mp3',
            'res/sounds/death2.mp3',
            'res/sounds/death3.mp3',
            'res/sounds/death4.mp3',
            'res/sounds/death5.mp3',
            'res/sounds/pickup.mp3',
            'res/sounds/miss.mp3',
            'res/sounds/miss2.mp3',
            'res/sounds/miss3.mp3',
            'res/sounds/miss4.mp3',
            'res/sounds/miss5.mp3',
            'res/sounds/miss6.mp3',
            'res/sounds/miss7.mp3',
            'res/sounds/shot.mp3'
        ]);

        setTimeout(this.loadResourcesFinish, 10);
    }

    loadResourcesFinish() {
        //console.log(`Loading resources:`);
         let jobs = 3;

        if( getSpriteManager().jsonLoaded ) {
            jobs--;
            //console.log(`[R]: Atlas JSON loaded`);
        }

        if( getSpriteManager().imageLoaded ) {
            jobs--;
            //console.log(`[R]: Atlas image loaded`);
        }

        if( getAudioManager().loaded ) {
            jobs--;
            //console.log(`[R]: Sounds loaded`);
        }

        if( jobs === 0 ) {
            console.log(`[R]: COMPLETE`);
            resourcesLoaded();
        } else {
            setTimeout(getGameManager().loadResourcesFinish, 10);
        }

    }

    play() {
        this.worldUpdateTimer = setInterval(updateWorld, gameSpeed);
    }

}

function updateWorld() {
    getGameManager().update();
}