'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    AbstractScene = require('./AbstractScene.js'),
    utils = require('../utils/utils.js');

function GlitchScene() {
    this.scene = null;
    this.EE = new EventEmitter();
}

utils.inherit(GlitchScene, AbstractScene);

GlitchScene.prototype.init = function(renderer) {
    this.renderer = renderer;
    this.initCamera();
    this.initScene();

    this.group = new THREE.Object3D();
    this.scene.add(this.group);

    var mesh;
    var geometry = new THREE.SphereGeometry(1, 4, 4);
    var material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        shading: THREE.FlatShading
    });

    for (var i = 0; i < 60; i++) {

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(utils.random(0, 1) - 0.5, utils.random(0, 1) - 0.5, utils.random(0, 1) - 0.5).normalize();
        mesh.position.multiplyScalar(Math.random() * 800);
        mesh.rotation.set(utils.random(0, 2), utils.random(0, 2), utils.random(0, 2));
        mesh.scale.x = mesh.scale.y = mesh.scale.z = utils.random(0, 50);
        this.group.add(mesh);

    }

    this.initLights();
    this.postProcessing();
    this.EE.emit('scene:init');
};

GlitchScene.prototype.postProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass( new THREE.RenderPass(this.scene, this.camera));
    var glitchPass = new THREE.GlitchPass();
    glitchPass.goWild = true;
    glitchPass.renderToScreen = true;
    this.composer.addPass(glitchPass);
};

GlitchScene.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 100;
};

GlitchScene.prototype.initScene = function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
};

GlitchScene.prototype.initLights = function() {
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 2, 2);
    this.scene.add(this.light);
};

GlitchScene.prototype.animate = function() {
};

module.exports = GlitchScene;