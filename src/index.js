var EventEmitter = require('wolfy87-eventemitter'),
    ee = new EventEmitter(),
    SceneManager = require('./lib/SceneManager.js'),
    AsteroidScene = require('./lib/AsteroidScene.js'),
    RingScene = require('./lib/RingScene.js'),
    Audio = require('./lib/Audio.js'),
    utils = require('./utils/utils.js');

var audioAnalyzer = new Audio('../assets/sound/Biome - Shaman.mp3');
var SM = new SceneManager(document.getElementById('render'));
var glitching = false;
var switching = false;
var raf;
var scenes = [
    new AsteroidScene(),
    new RingScene(),
];

(function() {
    registerScenes();

    ee.addOnceListener('sound:load', function() {
        console.log('%cSound loaded!', 'color: #0000ff');
        playSound();
    });
})();

function registerScenes() {
    var j = scenes.length;
    var scenesRegistered  = 0;

    SM.EE.addListener('scene:register', function() {
        scenesRegistered++;
        console.log('%cRegister scene '+ scenesRegistered, 'color: #0000ff');
        if(scenesRegistered == j) {
            console.log('%cAll scenes registered!', 'color: #0000ff');
            loadSound();
        }
    });

    for (var i = 0; i < j; i++) {
        SM.register(scenes[i]);
    }
}

function loadSound () {
    audioAnalyzer.load(function() {
        ee.emitEvent('sound:load');
    });
}

function playSound () {
    audioAnalyzer.play(0, 32, 45, {
        fadeInDuration: 3,
        fadeOutDuration: 2
    });
    raf = requestAnimationFrame(analyze);
    var id = Math.floor(utils.random(0, scenes.length));
    SM.play(id);
    SM.render();
}

function analyze() {
    raf = requestAnimationFrame(analyze);
    var stream = audioAnalyzer.getFrequencyAnalysis();

    if(false === stream) {
        onEnd();
        return;
    }

    var a = utils.average(stream),
        id;
    if (a > 101.5 && a < 102.5 && glitching === false) {
        glitching = true;
        SM.glitch();
        id = Math.floor(utils.random(0, scenes.length));
        SM.play(id);
        resetGlitch();
    }

    if(a > 72.7 && a < 73.5 && false === switching) {
        console.log("SWITCH", a);
        id = Math.floor(utils.random(0, scenes.length));
        SM.play(id);
        switching = true;
        resetSwitch();
    }
}

function resetGlitch() {
    setTimeout(function() {
        glitching = false;
    }, 1700);
}

function resetSwitch() {
    setTimeout(function() {
        switching = false;
    }, 200);
}

function onEnd() {
    console.log("ON END");
    cancelAnimationFrame(raf);
    SM.stop();
}