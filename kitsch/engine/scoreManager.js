class scoreManager {
    constructor() {
        this.score = [];
        this.killed = [];
        this.fired = [];

        this.clearAll();
    }

    clearCurrentRecording() {
        this.score[this.currentLevel] = 0;
        this.killed[this.currentLevel] = 0;
        this.fired[this.currentLevel] = 0;
    }

    enemyKilled(hardness) {
        this.score[this.currentLevel] += Math.floor(200 * hardness);
        this.killed[this.currentLevel]++;
        //console.log(`Enemy Killed (${this.currentKills()})`);
    }

    shotFired() {
        this.fired[this.currentLevel]++;
        //console.log(`Shot fired (${this.currentShots()})`);
    }

    currentScore() {
        return this.score[this.currentLevel];
    }

    currentShots() {
        return this.fired[this.currentLevel];
    }

    currentKills() {
        return this.killed[this.currentLevel];
    }

    clearAll() {
        this.score = [];
        this.killed = [];
        this.fired = [];

        for(let i = 0; i < gameScenes.length; i++) {
            this.score[i] = 0;
            this.killed[i] = 0;
            this.fired[i] = 0;
        }

        this.currentLevel = 0;
    }


}