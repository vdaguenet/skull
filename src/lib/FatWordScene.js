'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    AbstractScene = require('./AbstractScene.js'),
    Text3D = require('./Text3D.js'),
    utils = require('../utils/utils.js');

function FatWordScene() {
    this.scene = undefined;
    this.object = undefined;
    this.EE = new EventEmitter();
}

utils.inherit(FatWordScene, AbstractScene);

FatWordScene.prototype.init = function(renderer) {
    this.renderer = renderer;
    this.initCamera();
    this.initScene();

    var txt = new Text3D('TYPOGRAPHY', 'berthold akzidenz grotesk be', 0xffffff, {
        weight: 'normal',
        style: 'normal',
        size: 50,
        // Geometry
        height: 40,
        curveSegments: 4,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1,
        // Material
        shading: THREE.SmoothShading,
        wireframe: false
    });
    var geometry = txt.getGeometry();
    var material = txt.getMaterial();
    this.object = new THREE.Mesh(geometry, material);
    this.object.position.set(-200, -40, -120);
    this.object.rotation.set(-0.3, 0, 0.2);
    this.scene.add(this.object);

    this.initLights();
    this.postProcessing();
    this.EE.emit('scene:init');
};

FatWordScene.prototype.postProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass( new THREE.RenderPass(this.scene, this.camera));

    var focusPass = new THREE.ShaderPass(THREE.FocusShader);
    this.composer.addPass(focusPass);

    var sepiaPass = new THREE.ShaderPass(THREE.SepiaShader);
    this.composer.addPass(sepiaPass);

    var filmPass = new THREE.FilmPass(0.5, 0.35, 648, false);
    filmPass.renderToScreen = true;
    this.composer.addPass(filmPass);
};

FatWordScene.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.y = 5;
    this.camera.position.z = 100;
};

FatWordScene.prototype.initScene = function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffffff, 1, 1000);
};

FatWordScene.prototype.initLights = function() {
    this.scene.add(new THREE.AmbientLight(0x222222));

    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(0, 0, 1);
    this.scene.add(this.light);
};

FatWordScene.prototype.animate = function() {
    this.object.position.z += (0 - this.object.position.z) * 0.007;

    this.object.rotation.x += (0 - this.object.rotation.x) * 0.006;

    if(this.object.position.z >= -15) {
        // Reset animation
        this.object.position.set(-200, -40, -120);
        this.object.rotation.set(-0.3, 0, 0.2);
    }
};

module.exports = FatWordScene;