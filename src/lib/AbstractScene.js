/**
 * Abstract Scene class
 * Each scene will inherit this class and get the same structure
 */

'use strict';

function AbstractScene() {
    this.camera = undefined;
    this.renderer = undefined;
    this.raf = undefined;
    this.composer = undefined;
}

/**
 * Adapt scene size on window size
 */
AbstractScene.prototype.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

/**
 * Animate scene
 * This method must be override
 */
AbstractScene.prototype.animate = function() {
    console.warn("You must override animate method.");
};

module.exports = AbstractScene;