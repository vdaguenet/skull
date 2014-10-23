'use strict';

function AbstractScene() {
    this.camera = null;
    this.renderer = null;
    this.raf = null;
}

AbstractScene.prototype.initRender = function() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

AbstractScene.prototype.getRendererElement = function() {
    return this.renderer.domElement;
};

AbstractScene.prototype.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

AbstractScene.prototype.animate = function() {
    console.warn('Animate method must be override');
};

AbstractScene.prototype.play = function() {
    if (!this.raf) {
        this.animate();
    }
};

AbstractScene.prototype.stop = function() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
};

module.exports = AbstractScene;