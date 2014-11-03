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

AbstractScene.prototype.glitch = function() {
    if(!this.canGlitch) return;

    if(!this.composer) {
        this.composer = new THREE.EffectComposer(this.renderer);
    }
    var glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    this.composer.addPass(glitchPass);
};

module.exports = AbstractScene;