'use strict';

function Text3D(text, font, color) {
    // Font
    this.text = text;
    this.font = font;
    this.weight = 'normal';
    this.style = 'normal';
    this.size = 60;
    // Geometry
    this.height = 1;
    this.curveSegments = 1;
    this.bevelEnabled = true;
    this.bevelThickness = 20;
    this.bevelSize = 4;
    this.setGeometry();
    // Material
    this.color = color;
    this.shading = THREE.SmoothShading;
    this.wireframe = false;
    this.setMaterial();
}

Text3D.prototype.setGeometry = function() {
    this.geometry = new THREE.TextGeometry(this.text, {
        size: this.size,
        height: this.height,
        curveSegments: this.curveSegments,

        font: this.font,
        weight: this.weight,
        style: this.style,

        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelEnabled: this.bevelEnabled,

        material: 0,
        extrudeMaterial: 1
    });
};

Text3D.prototype.getGeometry = function() {
    return this.geometry;
};

Text3D.prototype.setMaterial = function() {
    this.material = new THREE.MeshPhongMaterial({
        color: this.color,
        shading: this.shading,
        wireframe: this.wireframe
    });
};

Text3D.prototype.getMaterial = function() {
    return this.material;
};


module.exports = Text3D;

// Intersting
// DepthMaterial + wireframe
