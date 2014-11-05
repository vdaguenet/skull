'use strict';

function AbstractScene() {
    this.camera = null;
    this.renderer = null;
    this.raf = null;
    this.composer = null;
    this.canGlitch = false;
}

AbstractScene.prototype.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

AbstractScene.prototype.animate = function() {};

module.exports = AbstractScene;