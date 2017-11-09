class Scene {
    constructor() {
        this.sceneName = '';
        this.title = '';
        this.subtitle = '';
        this.map = '';
    }
}

var gameScenes = [];

let intro = new Scene();
intro.sceneName = 'intro';
intro.title = 'Chapter I';
intro.subtitle = 'Tutorial';
intro.map = 'intro.json';

let disco = new Scene();
disco.sceneName = 'disco';
disco.title = 'Chapter II';
disco.subtitle = 'aye';
disco.map = 'disco.json';

gameScenes.push(intro);
gameScenes.push(disco);

