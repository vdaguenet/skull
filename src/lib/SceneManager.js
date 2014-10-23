'use strict';

var utils = require('../utils/utils.js');

function SceneManager(el) {
    this.el = el;
    this.scenes = [];
    this.scenePlaying = null;

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
}

SceneManager.prototype.register = function(scene) {
    scene.init();
    this.scenes.push(scene);
    this.appendRenderers();
};

SceneManager.prototype.appendRenderers = function() {
    utils.removeChildNodes(this.el);
    for (var i = 0, j = this.scenes.length; i < j; i++) {
        this.el.appendChild(this.scenes[i].getRendererElement());
    }
};

SceneManager.prototype.onWindowResize = function(first_argument) {
    for (var i = 0, j = this.scenes.length; i < j; i++) {
        this.scenes[i].onWindowResize();
    }
};

SceneManager.prototype.play = function(id) {
    this.scenes[id].play();
    this.scenes[id].getRendererElement().style.opacity = 1;
    this.scenePlaying = id;
};

SceneManager.prototype.switch = function(id) {
    if (this.scenePlaying) {
        this.scenes[this.scenePlaying].stop();
        this.scenes[this.scenePlaying].getRendererElement().style.opacity = 0;
    }
    this.play(id);
};

module.exports = SceneManager;