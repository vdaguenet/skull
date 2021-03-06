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
var home = document.querySelector('.home');
var homeTitle = document.querySelector('.title');
var homeSubtitle = document.querySelector('.subtitle');
var startButton = document.querySelector('.start');
var startLeft = document.querySelector('.start .part-left');
var startRight = document.querySelector('.start .part-right');
var loading = document.querySelector('.loading');
var loaderBg = document.querySelector('.loader-bg');
var loader = document.querySelector('.loader');
var render = document.getElementById('render');
var endPage = document.querySelector('.end');

// Sound and scenes part
var audioAnalyzer = new Audio('./assets/sound/Biome - Shaman.mp3');
var SM = new SceneManager(render);
var scenes = [
    new SkullScene(),
    new RingScene(),
    new AsteroidScene(),
    new FatWordScene()
];

var lastGlitch = 0;
var lastSwitch = 0;
var load = 0;
var raf;
var tlTransitionHomeIn = new TimelineMax();
var tlButtonStart;
var rendering = false;

document.addEventListener("DOMContentLoaded", function() {
    TweenMax.set([
            loading,
            render,
            endPage
        ],
        {autoAlpha: 0, display: 'none'}
    );

    startButton.addEventListener('click', function (event) {
        var tl = new TimelineMax({
            onComplete: function () {
                loadAssets();
            }
        });
        tl.fromTo(startButton, 0.6,
            {alpha: 1, x: 0},
            {alpha: 0, x: 200, ease: Expo.easeOut},
            0);
        tl.fromTo(loading, 0.6,
            {autoAlpha: 0, display: 'none', x: -100},
            {autoAlpha: 1, display: 'block', x: 0, ease: Expo.easeOut},
            0.3);
    }, false);

    startButton.addEventListener('mouseover', function (event) {
        tlButtonStart = new TimelineMax();
        tlButtonStart.fromTo(startLeft, 0.15, {x: 0}, {x: -12, ease: Expo.easeIn}, 0);
        tlButtonStart.fromTo(startRight, 0.15, {x: 0}, {x: 12, ease: Expo.easeIn}, 0);
        tlButtonStart.fromTo(startLeft, 0.15, {y:0}, {y: -4, ease: Expo.easeOut}, 0.15);
        tlButtonStart.fromTo(startRight, 0.15, {y:0}, {y: 4, ease: Expo.easeOut}, 0.15);

    }, false);

    startButton.addEventListener('mouseout', function (event) {
        if(tlButtonStart) {
            tlButtonStart.kill();
        }
        tlButtonStart.reverse();
    }, false);

    homeTransitionIn();

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
}, false);

function homeTransitionIn () {
    var letters = document.querySelectorAll('.subtitle-letter');

    tlTransitionHomeIn.fromTo(homeTitle, 0.9,
        {alpha: 0, y: -500},
        {alpha: 1, y: 0, ease: Expo.easeOut, delay: 0.1},
        0);
    tlTransitionHomeIn.staggerFromTo(letters, 0.7,
        {alpha: 0, y: 100},
        {alpha: 1, y: 0, ease: Expo.easeOut},
        0.08);
    tlTransitionHomeIn.fromTo(startButton, 0.6,
        {alpha: 0, y: 100},
        {alpha: 1, y: 0, ease: Expo.easeOut},
        3.4);
}

/**
 * Main
 */
function loadAssets () {
    ee.addListener('loader:update', function(value) {
        updateLoader(value, function() {
            startVisualization();
        });
    });

    loadSound();
    registerScenes();
}

/**
 * Register each scene on the Scene Manager
 */
function registerScenes() {
    var j = scenes.length;
    var scenesRegistered  = 0;

    SM.EE.addListener('scene:register', function() {

        scenesRegistered++;
        console.log('%cRegister scene '+ scenesRegistered, 'color: #0000ff');
        load += 80 / scenes.length;
        ee.emitEvent('loader:update', [load]);
        if(scenesRegistered == j) {
            console.log('%cAll scenes registered!', 'color: #0000ff');
            return;
        }

        SM.register(scenes[scenesRegistered]);
    });

    SM.register(scenes[scenesRegistered]);
}

/**
 * Load the sound in the buffer
 */
function loadSound () {
    audioAnalyzer.load(function() {
        console.log('%cSound loaded!', 'color: #0000ff');
        load += 20;
        ee.emitEvent('loader:update', [load]);
    });
}

/**
 * Play sound, start its analyze and render the first scene
 */
function startVisualization () {
    audioAnalyzer.play(0, 49, 33, {
        fadeInDuration: 3,
        fadeOutDuration: 6
    });
    raf = requestAnimationFrame(analyze);
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
        if (false === rendering) {
            SM.render();
            TweenMax.set(render, {autoAlpha: 1, display: 'block'});
            rendering = true;
        }
        lastSwitch = Date.now();
    }
}

/**
 * End of experience
 */
function onEnd() {
    cancelAnimationFrame(raf);
    SM.stop();

    var img = document.querySelector('.end img');
    var texts = document.querySelectorAll('.end p');

    var tl = new TimelineMax();
    tl.to(render, 0.3, {autoAlpha: 0, display: 'none', ease: Expo.easeOut}, 0);
    tl.set(endPage, {autoAlpha: 1, display: 'block'});
    tl.fromTo(img, 0.8,
        {alpha: 0, y: -300},
        {alpha: 1, y: 0, ease: Expo.easeOut, delay: 0.1});
    tl.staggerFromTo(texts, 0.9,
        {alpha: 0, x: -200},
        {alpha: 1, x: 0, ease: Expo.easeOut},
        0.08);
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
function updateLoader (percent, onLoad) {
    TweenMax.to(loader, 0.3, {x: percent/100*loaderBg.offsetWidth});

    if(percent == 100) {
        var tl = new TimelineMax({
            onComplete: function () {
                if(onLoad && typeof(onLoad) === 'function') {
                    onLoad();
                }
            }
        });
        tl.staggerFromTo(
            [
                loading,
                homeSubtitle,
                homeTitle
            ],
            0.9,
            {alpha: 1, y: 0},
            {alpha: 0, y: 100, delay: 0.1, ease: Expo.easeOut},
            0.08);
        tl.fromTo(home, 0.2,
            {autoAlpha: 1, display: 'block'},
            {autoAlpha: 0, display: 'none', ease: Expo.easeOut},
            0.8);
    }
}