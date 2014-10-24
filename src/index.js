var SceneManager = require('./lib/SceneManager.js'),
    AsteroidScene = require('./lib/AsteroidScene.js'),
    Audio = require('./lib//Audio.js'),
    utils = require('./utils/utils.js');

var audioAnalyzer = new Audio('../assets/sound/Biome - Shaman.mp3');
var SM = new SceneManager(document.getElementById('render'));
var glitching = false;

var scenes = [
    new AsteroidScene()
];

(function() {
    registerScenes();

    audioAnalyzer.load(function() {
        audioAnalyzer.play(0, 32, 3);
        requestAnimationFrame(analyze);
        SM.play(0);
    });
})();

function analyze() {
    requestAnimationFrame(analyze);
    var stream = audioAnalyzer.getFrequencyAnalysis();
    var a = utils.average(stream);
    if (a > 101.5 && a < 102.5 && glitching === false) {
        glitching = true;
        SM.getCurrentScene().glitch();
        resetGlitch();
    }
}

function resetGlitch() {
    setTimeout(function() {
        console.log('RESET');
        glitching = false;
    }, 2000);
}

function registerScenes() {
    for (var i = 0, j = scenes.length; i < j; i++) {
        SM.register(scenes[i]);
    }
}