'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    Text3D = require('./Text3D.js'),
    AbstractScene = require('./AbstractScene.js'),
    utils = require('../utils/utils.js');

function RingScene() {
    this.scene = null;
    this.group = null;
    this.light = null;
    // Center of the spiarl
    this.center = {
        x: 7,
        y: -50,
        z: 4,
    };
    this.radius = 60;
    this.nbRings = 20;
    this.EE = new EventEmitter();
}

utils.inherit(RingScene, AbstractScene);

RingScene.prototype.init = function(renderer) {
    this.renderer = renderer;
    this.initCamera();
    this.initScene();

    this.group = new THREE.Object3D();
    this.group.position.set(this.center.x, this.center.y, this.center.z);
    this.scene.add(this.group);

    var ratio = 2;
    var space = 10;
    var positions = [];

    var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var fonts = ['arial narrow', 'berthold akzidenz grotesk be', 'droid sans', 'gentilis', 'helvetiker', 'jaycons', 'mf rusty', 'optimer', 'stixgeneral'];

    var text, geometry, material, mesh,
        letter, font,
        x, z, m,
        nbRun, nbLetter = 0;

    // Spiral of 10 rings
    for (var a = 0; a < this.nbRings; a++) {
        x = 0;
        z = this.radius;
        m = 5 - 4 * this.radius;
        nbRun = Math.floor(0.71*this.radius);

        // Bresenham algorithm to create each ring
        while (x <= z) {
            positions = [
                {x: x + this.center.x, y: this.center.y+a*10.5, z: z+this.center.z},
                {x: z + this.center.x, y: this.center.y+a*10.5, z:x + this.center.z},
                {x: z + this.center.x, y: this.center.y+a*10.5, z:-x + this.center.z},
                {x: x + this.center.x, y: this.center.y+a*10.5, z:-z + this.center.z},
                {x: -x + this.center.x, y: this.center.y+a*10.5, z:-z + this.center.z},
                {x: -z + this.center.x, y: this.center.y+a*10.5, z:-x + this.center.z},
                {x: -z + this.center.x, y: this.center.y+a*10.5, z:x + this.center.z},
                {x: -x + this.center.x, y: this.center.y+a*10.5, z:z + this.center.z},
            ];

            if(x%space === 0) {
                for (var i = 0, j = positions.length; i < j; i++) {
                    letter = letters[Math.floor(utils.random(0, letters.length))];
                    font = fonts[Math.floor(utils.random(0, fonts.length))];
                    text = new Text3D(letter, font, 0xff1100, {
                        size: 4,
                        curveSegments: 2,
                        bevelEnabled: false
                    });
                    geometry = text.getGeometry();
                    material = text.getMaterial();

                    mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
                    this.group.add(mesh);
                    nbLetter++;
                }
            }

            if (m > 0) {
                z--;
                m = m - 8 * z;
            }
            x++;
            m = m + 8 * x + 4;
        }
    }

    this.initLights();
    this.postProcessing();

    this.EE.emit('scene:init');
};

RingScene.prototype.postProcessing = function() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass( new THREE.RenderPass(this.scene, this.camera));

    var hblur = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
    var vblur = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );

    var bluriness = 4;

    hblur.uniforms['h'].value = bluriness / window.innerWidth;
    vblur.uniforms['v'].value = bluriness / window.innerHeight;
    this.composer.addPass(hblur);
    this.composer.addPass(vblur);

    var vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
    vignettePass.uniforms.darkness.value = 1.3;
    vignettePass.renderToScreen = true;
    this.composer.addPass(vignettePass);
};

RingScene.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 100;
};

RingScene.prototype.initScene = function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
};

RingScene.prototype.initLights = function() {
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 2, 2);
    this.scene.add(this.light);
};

RingScene.prototype.animate = function() {
    this.group.rotation.y -= 0.001;
};

module.exports = RingScene;