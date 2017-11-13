// Initialization

var levelBriefDuration = 8000;
var gameSpeed = 20;

var mm  = new mapManager();
var sm  = new spriteManager();
var em  = new eventsManager();
var pm  = new physicManager();
var gm  = new gameManager();
var hm  = new hudManager();
var am  = new audioManager();
var scm = new scoreManager();

function getCurrentContext() { return context; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return em; }
function getSpriteManager() { return sm; }
function getGameManager() { return gm; }
function getPhysicManager() { return pm; }
function getMapManager() { return mm; }
function getHudManager() { return hm; }
function getAudioManager() { return am; }
function getScoreManager() { return scm; }

function completedLevel(l) {
    startLevel(l + 1);
}

function startLevel(l) {
    if(l < gameScenes.length) {
        getAudioManager().stopAll();
        getAudioManager().play(gameScenes[l].music, { looping: true });
        getAudioManager().filter.frequency.value = getAudioManager().lowFrequency;

        getScoreManager().currentLevel = l;
        getScoreManager().save();

        getGameManager().clearScreen();
        getHudManager().drawHero(gameScenes[l].hero);
        getHudManager().drawTitleText(gameScenes[l].title);
        getHudManager().drawSubtitleText(gameScenes[l].subtitle);
        getHudManager().drawLevelHint(gameScenes[l].hint)

        setTimeout( () => {
            getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
            getGameManager().loadScene(gameScenes[l]);
        }, levelBriefDuration);

    } else {

        let totalScore = 0;
        for(let s of getScoreManager().storage) {
            totalScore += s.score;
        }

        getScoreManager().save();

        getGameManager().clearScreen();
        getHudManager().drawHero('endlevel');
        getHudManager().drawTitleText('CONGRATULATIONS,  YOU  FINISHED  THE  GAME!');
        getHudManager().drawSubtitleText(`Your total score: ${totalScore}`);

    }
}

// On game resources load
function resourcesLoaded() {

    // Loading start level
    setTimeout( () => { startLevel(getScoreManager().currentLevel) }, 100 );

    console.log('loaded all');
    //getHudManager().drawHero('endlevel');
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function div(val, by){
    return (val - val % by) / by;
}

function scoreboard(en) {
    let scoreboardElement = document.getElementById('scoreboard');
    let scoreboardTextElement = document.getElementById('scoreboard-text');
    if(en) {
        scoreboardTextElement.innerHTML = '';
        scoreboardElement.style.display = 'block';

        for(let i = 0; i < gameScenes.length; i++) {
            scoreboardTextElement.innerHTML += (`<b>${gameScenes[i].title}</b><br />`);
            scoreboardTextElement.innerHTML += (`Enemies killed: ${getScoreManager().storage[i].killed}<br />`);
            scoreboardTextElement.innerHTML += (`Shots fired: ${getScoreManager().storage[i].fired}<br />`);
            scoreboardTextElement.innerHTML += (`Time: ${getScoreManager().storage[i].time}<br />`);
            scoreboardTextElement.innerHTML += (`Score: ${getScoreManager().storage[i].score}<br /><br />`);
        }

    } else {
        scoreboardElement.style.display = 'none';
    }
}

function musicInfo(en) {
    let miElement = document.getElementById('musicInfo');
    if(en) {
        miElement.style.display = 'block';
    } else {
        miElement.style.display = 'none';
    }
}

function launch() {
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome) {
        alert(`Please use Google Chrome.`);
    } else {
        getScoreManager().load();
        getGameManager().loadResources();
        document.getElementById('overlay').style.display = 'none';
    }
}

// Starting
//launch();
//document.getElementById('overlay').style.display = 'none';
