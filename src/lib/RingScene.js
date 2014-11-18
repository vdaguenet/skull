'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    Text3D = require('./Text3D.js'),
    AbstractScene = require('./AbstractScene.js'),
    utils = require('../utils/utils.js');

function RingScene() {
    this.scene = undefined;
    this.group = undefined;
    this.rings = [];
    this.atTop = false;
    this.bluriness = 4;
    this.light = undefined;
    // Center of the column
    this.center = {
        x: 0,
        y: -50,
        z: 0
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

    var ratio = 2;
    var space = 10;
    var positions = [];

    var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var fonts = ['arial narrow', 'berthold akzidenz grotesk be', 'droid sans', 'gentilis', 'helvetiker', 'jaycons', 'mf rusty', 'optimer'];

    var text, geometry, material, mesh,
        letter, font,
        x, z, m,
        nbRun, nbLetter = 0;


    // Stack of rings
    for (var a = 0; a < this.nbRings; a++) {
        this.group = new THREE.Object3D();
        this.group.position.set(this.center.x, this.center.y, this.center.z);
        this.group.rotation.y = -Math.PI/6;
        this.scene.add(this.group);

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

            this.rings.push(this.group);
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
    hblur.uniforms['h'].value = this.bluriness / window.innerWidth;
    vblur.uniforms['v'].value = this.bluriness / window.innerHeight;
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
    this.scene.fog = new THREE.Fog(0x000000, 0.5, -50);
};

RingScene.prototype.initLights = function() {
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 2, 2);
    this.scene.add(this.light);
};

RingScene.prototype.animate = function() {
    this.rings.forEach(function (ring, i) {

        if(this.atTop === true) {
            ring.position.y += (0 - ring.position.y) * 0.0002;
            ring.rotation.x += ((-Math.PI/2) - ring.rotation.x) * 0.0001;

            this.bluriness += (6 - this.bluriness) * 0.0001;
            this.composer.passes[1].uniforms['h'].value = this.bluriness / window.innerWidth;
            this.composer.passes[2].uniforms['v'].value = this.bluriness / window.innerHeight;

            if (ring.position.y > -5) {

                if(i%2 === 0) {
                    ring.rotation.y -= 0.001;
                } else {
                    ring.rotation.y += 0.001;
                }
                ring.position.z += 0.006;
            }
        } else {
            ring.position.y -= 0.01;
        }

        if(ring.position.y < -150) {
            this.atTop = true;
        }

    }.bind(this));
};

module.exports = RingScene;