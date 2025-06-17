// src/objects/Fan.js
import * as THREE from 'three';

export default class Fan {
    constructor() {
        this.threegroup = new THREE.Group();
        this.createMaterials();
        this.createCore();
        this.createPropeller();
        this.createSphere();
    }

    createMaterials() {
        this.redMat = new THREE.MeshLambertMaterial({ color: 0xad3525, flatShading: true });
        this.greyMat = new THREE.MeshLambertMaterial({ color: 0x653f4c, flatShading: true });
        this.yellowMat = new THREE.MeshLambertMaterial({ color: 0xfdd276, flatShading: true });
    }

    createCore() {
        const coreGeom = new THREE.BoxGeometry(10, 10, 20);
        this.core = new THREE.Mesh(coreGeom, this.greyMat);
        this.threegroup.add(this.core);
    }

    createPropeller() {
        const propGeom = new THREE.BoxGeometry(10, 30, 2);
        propGeom.translate(0, 25, 0);
        this.propeller = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            const prop = new THREE.Mesh(propGeom, this.redMat);
            prop.position.z = 15;
            prop.rotation.z = (Math.PI / 2) * i;
            this.propeller.add(prop);
        }
        this.threegroup.add(this.propeller);
    }

    createSphere() {
        const sphereGeom = new THREE.BoxGeometry(10, 10, 3);
        this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
        this.sphere.position.z = 15;
        this.threegroup.add(this.sphere);
    }
}