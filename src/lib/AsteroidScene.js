'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    Text3D = require('./Text3D.js'),
    AbstractScene = require('./AbstractScene.js'),
    utils = require('../utils/utils.js');

function AsteroidScene() {
    this.scene = null;
    this.group = null;
    this.light = null;
    this.EE = new EventEmitter();
}

utils.inherit(AsteroidScene, AbstractScene);

AsteroidScene.prototype.init = function(renderer) {
    this.renderer = renderer;
    this.initCamera();
    this.initScene();

    this.group = new THREE.Object3D();
    this.scene.add(this.group);

    var text = new Text3D('TOTO', 'stixgeneral', 0xffffff);
    var geometry = text.getGeometry();
    var material = text.getMaterial();

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.7, Math.random() - 0.7, Math.random() - 0.7).normalize();
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
    this.group.add(mesh);

    // Change geometry and material for spheres
    geometry = new THREE.SphereGeometry(1, 4, 4);
    material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shading: THREE.FlatShading
    });

    for (var i = 0; i < 60; i++) {

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(utils.random(0, 1) - 0.5, utils.random(0, 1) - 0.5, utils.random(0, 1) - 0.5).normalize();
        mesh.position.multiplyScalar(Math.random() * 400);
        mesh.rotation.set(utils.random(0, 2), utils.random(0, 2), utils.random(0, 2));
        mesh.scale.x = mesh.scale.y = mesh.scale.z = utils.random(0, 50);
        this.group.add(mesh);

    }

    this.initLights();
    this.postProcessing();

    this.EE.emitEvent('scene:init');
};

AsteroidScene.prototype.postProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

    var effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms['scale'].value = 4;
    this.composer.addPass(effect);

    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.0015;
    effect.renderToScreen = true;
    this.composer.addPass(effect);
};

AsteroidScene.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 400;
};

AsteroidScene.prototype.initScene = function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
};

AsteroidScene.prototype.initLights = function() {
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);
};

AsteroidScene.prototype.animate = function() {
    this.group.rotation.x += 0.005;
    this.group.rotation.y += 0.01;
};

module.exports = AsteroidScene;