class scoreManager {
    constructor() {
        this.clearAll();
    }

    clearCurrentRecording() {
        this.score[this.currentLevel] = 0;
    }

    enemyKilled(hardness) {
        this.score[this.currentLevel] += Math.floor(200 * hardness);
    }

    currentScore() {
        return this.score[this.currentLevel];
    }

    clearAll() {
        this.score = [];

        for(let i = 0; i < gameScenes.length; i++) {
            this.score[i] = 0;
        }

        this.currentLevel = 0;
    }


}