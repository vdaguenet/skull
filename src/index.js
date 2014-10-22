var Scene = require('./lib/Scene.js');

(function() {
    var s = new Scene(document.getElementById('render'));
    s.init();
    s.animate();
})();