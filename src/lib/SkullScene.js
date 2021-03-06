'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    AbstractScene = require('./AbstractScene.js'),
    utils = require('../utils/utils.js');

function SkullScene() {
    this.scene = undefined;
    this.object = undefined;
    this.light = undefined;
    this.EE = new EventEmitter();
}

utils.inherit(SkullScene, AbstractScene);

SkullScene.prototype.init = function(renderer) {
    this.renderer = renderer;

    var loader = new THREE.OBJLoader( new THREE.LoadingManager() );
    loader.load( './assets/obj/evil-skull.obj', function ( object ) {
        this.initCamera();
        this.initScene();

        this.object = object;
        this.object.position.y = 1.25;
        this.object.position.z = 88;
        this.object.rotation.x = -0.15;
        this.object.scale.x = this.object.scale.y = this.object.scale.z = 6;
        this.scene.add( object );

        this.initLights();
        this.postProcessing();
        this.EE.emit('scene:init');
    }.bind(this), this.onProgress, this.onError );

};

SkullScene.prototype.postProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

    var sepiaPass = new THREE.ShaderPass(THREE.SepiaShader);
    this.composer.addPass(sepiaPass);

    var glitchPass = new THREE.GlitchPass();
    glitchPass.goWild = true;
    glitchPass.renderToScreen = true;
    this.composer.addPass(glitchPass);
};

SkullScene.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 100;
};

SkullScene.prototype.initScene = function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
};

SkullScene.prototype.initLights = function() {
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 2, 2);
    this.scene.add(this.light);
};

SkullScene.prototype.animate = function() {};

SkullScene.prototype.onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
};

SkullScene.prototype.onError = function ( xhr ) {
    console.error('Can\'t load file.');
};

module.exports = SkullScene;