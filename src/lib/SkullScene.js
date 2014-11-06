'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    AbstractScene = require('./AbstractScene.js'),
    utils = require('../utils/utils.js');

function SkullScene() {
    this.scene = null;
    this.object = null;
    this.light = null;
    this.EE = new EventEmitter();
}

utils.inherit(SkullScene, AbstractScene);

SkullScene.prototype.init = function(renderer) {
    this.renderer = renderer;
    this.initCamera();
    this.initScene();

    var loader = new THREE.OBJLoader( new THREE.LoadingManager() );
    loader.load( '../assets/obj/evil-skull.obj', function ( object ) {
        this.object = object;
        this.object.position.y = 1.25;
        this.object.position.z = 88;
        this.object.rotation.x = -0.15;
        this.object.scale.x = this.object.scale.y = this.object.scale.z = 6;
        this.scene.add( object );

    }.bind(this), this.onProgress, this.onError );

    this.initLights();
    this.postProcessing();
    this.EE.emit('scene:init');
};

SkullScene.prototype.postProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

    var sepiaPass = new THREE.ShaderPass(THREE.SepiaShader);
    this.composer.addPass(sepiaPass);

    var rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    rgbPass.uniforms['amount'].value = 0.003;
    this.composer.addPass(rgbPass);

    var effectHBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    effectHBlur.uniforms[ 'h' ].value = 0.4 / window.innerWidth;
    this.composer.addPass(effectHBlur);

    var effectVBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    effectVBlur.uniforms[ 'v' ].value = 0.4 / window.innerHeight;
    this.composer.addPass(effectVBlur);

    var filmPass = new THREE.FilmPass(0.5, 0.35, 648, false);
    this.composer.addPass(filmPass);

    var glitchPass = new THREE.GlitchPass();
    this.composer.addPass(glitchPass);

    var vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
    vignettePass.uniforms[ "darkness" ].value = 1.6;
    vignettePass.renderToScreen = true;
    this.composer.addPass(vignettePass);

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

SkullScene.prototype.animate = function() {
    // this.object.rotation.y -= 0.001;
};

SkullScene.prototype.onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
};

SkullScene.prototype.onError = function ( xhr ) {
};

module.exports = SkullScene;