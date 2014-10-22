'use strict';

function Scene(el) {
    this.el = el;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.composer = null;
    this.object = null;
    this.light = null;
}

Scene.prototype.init = function() {

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.appendChild(this.renderer.domElement);

    //
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 400;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);

    this.object = new THREE.Object3D();
    this.scene.add(this.object);

    var geometry = new THREE.SphereGeometry(1, 4, 4);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
    });

    for (var i = 0; i < 100; i++) {

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.position.multiplyScalar(Math.random() * 400);
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
        this.object.add(mesh);

    }

    this.scene.add(new THREE.AmbientLight(0x222222));

    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);

    // postprocessing
    this.initPostProcessing();


    window.addEventListener('resize', this.onWindowResize.bind(this), false);
};

Scene.prototype.initPostProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

    var effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms['scale'].value = 4;
    this.composer.addPass(effect);

    var effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.0015;
    effect.renderToScreen = true;
    this.composer.addPass(effect);
};

Scene.prototype.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

Scene.prototype.animate = function() {

    requestAnimationFrame(this.animate.bind(this));

    this.object.rotation.x += 0.005;
    this.object.rotation.y += 0.01;

    this.composer.render();
};

module.exports = Scene;