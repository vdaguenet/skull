'use strict';

function Text3D(text, font, color, params) {
    params = params || {};
    // Font
    this.text = text;
    this.font = font;
    this.weight = params.weight || 'normal';
    this.style = params.style || 'normal';
    this.size = params.size || 60;
    // Geometry
    this.height = params.height || 1;
    this.curveSegments = params.curveSegments || 1;
    this.bevelEnabled = (params.bevelEnabled !== undefined) ? params.bevelEnabled : true;
    this.bevelThickness = params.bevelThickness || 20;
    this.bevelSize = params.bevelThickness || 4;
    this.setGeometry();
    // Material
    this.color = color;
    this.shading = params.shading || THREE.SmoothShading;
    this.wireframe = (params.wireframe !== undefined) ? params.wireframe : false;
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