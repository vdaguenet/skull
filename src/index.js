var SceneManager = require('./lib/SceneManager.js'),
    AsteroidScene = require('./lib/AsteroidScene.js'),
    Audio = require('./lib//Audio.js');

var audioAnalyzer = new Audio('../assets/sound/Biome - Shaman.mp3');

(function() {
    var sm = new SceneManager(document.getElementById('render'));
    var s = new AsteroidScene();
    sm.register(s);
    sm.play(0);
    audioAnalyzer.load(function() {
        audioAnalyzer.play();
        requestAnimationFrame(analyze);
    });
})();

function analyze() {
    requestAnimationFrame(analyze);
    var stream = audioAnalyzer.getFrequencyAnalysis();
    console.log(stream);
}