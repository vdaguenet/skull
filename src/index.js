var SceneManager = require('./lib/SceneManager.js'),
    AsteroidScene = require('./lib/AsteroidScene.js'),
    RingScene = require('./lib/RingScene.js'),
    Audio = require('./lib/Audio.js'),
    utils = require('./utils/utils.js');

var audioAnalyzer = new Audio('../assets/sound/Biome - Shaman.mp3');
var SM = new SceneManager(document.getElementById('render'));
var glitching = false;
var raf;

var scenes = [
    new AsteroidScene(),
    new RingScene(),
];

(function() {
    registerScenes();

    audioAnalyzer.load(function() {
        audioAnalyzer.play(0, 32, 45, {
            fadeInDuration: 3,
            fadeOutDuration: 2
        });
        raf = requestAnimationFrame(analyze);
        SM.play(1);
    });
})();

function analyze() {
    raf = requestAnimationFrame(analyze);
    var stream = audioAnalyzer.getFrequencyAnalysis();

    if(false === stream) {
        onEnd();
        return;
    }

    var a = utils.average(stream);
    if (a > 101.5 && a < 102.5 && glitching === false) {
        glitching = true;
        SM.getCurrentScene().glitch();
        resetGlitch();
    }
}

function resetGlitch() {
    setTimeout(function() {
        glitching = false;
    }, 1700);
}

function registerScenes() {
    for (var i = 0, j = scenes.length; i < j; i++) {
        SM.register(scenes[i]);
    }
}

function onEnd() {
    console.log("ON END");
    cancelAnimationFrame(raf);
}