'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    utils = require('../utils/utils.js');

var stats,
    debug = true;

function SceneManager(el) {
    this.el = el;
    this.EE = new EventEmitter();
    this.scenes = [];
    this.scenePlaying = null;
    this.renderer = null;
    this.initRender();
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    if (true === debug) {
        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);
    }
}

SceneManager.prototype.initRender = function() {
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.appendChild(this.renderer.domElement);
    this.EE.emit('render:init');
};

SceneManager.prototype.render = function() {
    this.raf = requestAnimationFrame(this.render.bind(this));

    this.scenes[this.scenePlaying].animate();

    if(this.scenes[this.scenePlaying].composer) {
        this.scenes[this.scenePlaying].composer.render();
    } else {
        this.renderer.render(
            this.scenes[this.scenePlaying].scene,
            this.scenes[this.scenePlaying].camera
        );
    }

    if (true === debug) {
        stats.update();
    }
};

SceneManager.prototype.register = function(scene) {
    scene.EE.addOnceListener('scene:init', function() {
        this.scenes.push(scene);
        this.EE.emitEvent('scene:register');
    }.bind(this));
    scene.init(this.renderer);
};

SceneManager.prototype.onWindowResize = function(first_argument) {
    for (var i = 0, j = this.scenes.length; i < j; i++) {
        this.scenes[i].onWindowResize();
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

SceneManager.prototype.play = function(id) {
    var j = this.scenes.length;
    if(id < 0 || id > j || id == j) return;

    console.log('play scene', id);
    this.scenePlaying = id;
};

SceneManager.prototype.stop = function() {
    cancelAnimationFrame(this.raf);
};

module.exports = SceneManager;