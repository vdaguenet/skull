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

// DOM elements
var render = document.getElementById('render');
var loading = document.querySelector('.loading');
var loader = document.querySelector('.loader');
var endPage = document.querySelector('.end');
// Sound and scenes part
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

/**
 * Main
 */
(function() {
    TweenMax.set(render, {autoAlpha: 0, display: 'none'});
    TweenMax.set(endPage, {autoAlpha: 0, display: 'none'});

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    registerScenes();

    ee.addOnceListener('sound:load', function() {
        load += 10;
        updateLoader(load, function() {
            console.log('%cSound loaded!', 'color: #0000ff');
            playSound();
        });
    });
})();

/**
 * Register each scene on the Scene Manager
 */
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

/**
 * Load the sound in the buffer
 */
function loadSound () {
    audioAnalyzer.load(function() {
        ee.emitEvent('sound:load');
    });
}

/**
 * Play sound, start its analyze and render the first scene
 */
function playSound () {
    audioAnalyzer.play(0, 41, 50, {
        fadeInDuration: 3,
        fadeOutDuration: 4
    });
    raf = requestAnimationFrame(analyze);
    SM.play(1);
    SM.render();
}

/**
 * Analyse sound and display scene in fact of frequency
 */
function analyze() {
    raf = requestAnimationFrame(analyze);
    var stream = audioAnalyzer.getFrequencyAnalysis();

    if(false === stream) {
        onEnd();
        return;
    }

    var a = utils.average(stream),
        id;
    // Glitch on clap
    if (a > 100.5 && a < 102.5) {
        if(Date.now() - lastGlitch < 500) {
            // Don't replay glitch before 0.5s
            return;
        }
        // Play glitch scene
        SM.play(0);
        lastSwitch = lastGlitch = Date.now();

        return;
    }
    // Change scene on specific frequency
    if(a > 78 && a < 88) {
        if(Date.now() - lastSwitch < 300) {
            // Don't change scene before 0.3s
            return;
        }

        playRandomScene();
        lastSwitch = Date.now();
    }
}

/**
 * End of experience
 */
function onEnd() {
    cancelAnimationFrame(raf);
    SM.stop();

    var h1 = document.querySelector('.end h1');
    var sub = document.querySelector('.sub-title');
    var tl = new TimelineMax();
    tl.fromTo(render, 0.6, {autoAlpha: 1, display: 'block'}, {autoAlpha: 0, display: 'none', ease: Expo.easeInOut}, 0);
    tl.fromTo(endPage, 0.6, {autoAlpha: 0, display: 'none'}, {autoAlpha: 1, display: 'block', ease: Expo.easeInOut}, 0);
    tl.staggerFromTo([h1, sub], 0.7, {alpha: 0, y: 100}, {alpha: 1, y: 0, ease: Expo.easeOut}, 0.08);
}

/**
 * Select and display a random scene
 */
function playRandomScene() {
    id = Math.floor(utils.random(1, scenes.length));
    SM.play(id);
}

/**
 * Update loading bar
 */
function updateLoader (percent, callback) {
    var loaderBg = document.querySelector('.loader-bg');
    TweenMax.to(loader, 0.3, {x: percent/100*loaderBg.offsetWidth});

    if(percent == 100) {
        var tl = new TimelineMax();
        tl.fromTo(loading, 0.4, {autoAlpha: 1, display: 'block'}, {autoAlpha: 0, display: 'none', ease: Expo.easeInOut});
        tl.fromTo(render, 0.4, {autoAlpha: 0, display: 'none'}, {autoAlpha: 1, display: 'block', ease: Expo.easeInOut}, 0.2);
        if(callback && typeof(callback) === 'function') {
            tl.addCallback(callback, 0.5);
        }
    }
}