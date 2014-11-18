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
        stats.domElement.style.opacity = 0;

        document.body.appendChild(stats.domElement);
    }
}

/**
 * Set WebGL renderer and append it to body
 */
SceneManager.prototype.initRender = function() {
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.appendChild(this.renderer.domElement);
    this.EE.emit('render:init');
};

/**
 * Render
 */
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
        if (stats.domElement.style.opacity < 1) {
            stats.domElement.style.opacity = 1;
        }
        stats.update();
    }
};

/**
 * Prerender a scene to increase performances
 */
SceneManager.prototype.prerender = function(s) {
    if(s.composer) {
        s.composer.render();
    } else {
        this.renderer.render(
            s.scene,
            s.camera
        );
    }
};

/**
 * Init scene and save it
 */
SceneManager.prototype.register = function(scene) {
    scene.EE.addOnceListener('scene:init', function() {
        for(var i = 0; i < 10; i++) {
            this.prerender(scene);
        }

        this.scenes.push(scene);
        this.EE.emitEvent('scene:register');
    }.bind(this));
    scene.init(this.renderer);
};

/**
 * Adapt renderer size on window size
 */
SceneManager.prototype.onWindowResize = function(first_argument) {
    for (var i = 0, j = this.scenes.length; i < j; i++) {
        this.scenes[i].onWindowResize();
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * Play the scene with the id given
 */
SceneManager.prototype.play = function(id) {
    var j = this.scenes.length;
    if(id < 0 || id > j || id == j) return;

    this.scenePlaying = id;
};

/**
 * Stop rendering
 */
SceneManager.prototype.stop = function() {
    if (true === debug) {
        stats.domElement.style.opacity = 0;
    }
    cancelAnimationFrame(this.raf);
};

module.exports = SceneManager;