var SceneManager = require('./lib/SceneManager.js');
var AsteroidScene = require('./lib/AsteroidScene.js');

(function() {
    var sm = new SceneManager(document.getElementById('render'));
    var s = new AsteroidScene();
    sm.register(s);
    sm.play(0);
})();