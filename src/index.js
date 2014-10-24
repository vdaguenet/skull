var SceneManager = require('./lib/SceneManager.js'),
    AsteroidScene = require('./lib/AsteroidScene.js'),
    Audio = require('./lib//Audio.js');

var audioAnalyzer = new Audio('../assets/sound/Biome - Shaman.mp3');
var SM = new SceneManager(document.getElementById('render'));

var scenes = [
    new AsteroidScene()
];

(function() {
    registerScenes();

    audioAnalyzer.load(function() {
        audioAnalyzer.play();
        requestAnimationFrame(analyze);
        SM.play(0);
    });
})();

function analyze() {
    requestAnimationFrame(analyze);
    var stream = audioAnalyzer.getFrequencyAnalysis();
    // console.log(SM);
    // console.log(stream);
}

function registerScenes() {
    for (var i = 0, j = scenes.length; i < j; i++) {
        SM.register(scenes[i]);
    }
}