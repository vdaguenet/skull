var EventEmitter = require('wolfy87-eventemitter'),
    ee = new EventEmitter(),
    TweenMax = require('TweenMax'),
    SceneManager = require('./lib/SceneManager.js'),
    AsteroidScene = require('./lib/AsteroidScene.js'),
    FatWordScene = require('./lib/FatWordScene.js'),
    RingScene = require('./lib/RingScene.js'),
    SkullScene = require('./lib/SkullScene.js'),
    Audio = require('./lib/Audio.js'),
    utils = require('./utils/utils.js');

var render = document.getElementById('render');
var loading = document.querySelector('.loading');
var loader = document.querySelector('.loader');

var audioAnalyzer = new Audio('../assets/sound/Biome - Shaman.mp3');
var SM = new SceneManager(render);
var scenes = [
    new SkullScene(),
    new RingScene(),
    new AsteroidScene(),
    new FatWordScene(),
];

var lastGlitch = 0;
var lastSwitch = 0;
var load = 0;
var raf;

(function() {
    TweenMax.set(render, {autoAlpha: 0, display: 'none'});

    registerScenes();

    ee.addOnceListener('sound:load', function() {
        load += 10;
        updateLoader(load, function() {
            console.log('%cSound loaded!', 'color: #0000ff');
            playSound();
        });
    });
})();

function registerScenes() {
    var j = scenes.length;
    var scenesRegistered  = 0;

    SM.EE.addListener('scene:register', function() {
        scenesRegistered++;
        console.log('%cRegister scene '+ scenesRegistered, 'color: #0000ff');
        load = scenesRegistered/j * 90;
        updateLoader(load);
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
    audioAnalyzer.play(0, 41, 50, {
        fadeInDuration: 3,
        fadeOutDuration: 4
    });
    raf = requestAnimationFrame(analyze);
    SM.play(1);
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
    if (a > 100.5 && a < 102.5) {
        if(Date.now() - lastGlitch < 700) {
            // Don't replay glitch before 0.7s
            return;
        }
        // Play glitch scene
        SM.play(0);
        lastGlitch = Date.now();

        return;
    }
    if(a > 78 && a < 88) {
        if(Date.now() - lastSwitch < 600) {
            // Don't change scene before 0.6s
            return;
        }

        playRandomScene();
        lastSwitch = Date.now();
    }
}

function onEnd() {
    console.log("ON END");
    cancelAnimationFrame(raf);
    SM.stop();
}

function playRandomScene() {
    id = Math.floor(utils.random(1, scenes.length));
    SM.play(id);
}

function updateLoader (percent, callback) {
    var loaderBg = document.querySelector('.loader-bg');
    TweenMax.to(loader, 0.3, {x: percent/100*loaderBg.offsetWidth});
    if(percent == 100) {
        var tl = new TimelineMax();
        tl.fromTo(loading, 0.4, {autoAlpha: 1, display: 'block'}, {autoAlpha: 0, display: 'none', ease: Expo.easeOut});
        tl.fromTo(render, 0.4, {autoAlpha: 0, display: 'none'}, {autoAlpha: 1, display: 'block', ease: Expo.easeOut}, 0.2);
        if(callback && typeof(callback) === 'function') {
            tl.addCallback(callback, 0.5);
        }
    }
}