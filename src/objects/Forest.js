// src/objects/Forest.js
import * as THREE from 'three';
import Tree from './Tree.js';

export default class Forest {
    constructor({
        count = 30,
        areaX = [-200, 200],
        areaZ = [-400, -200],
        y = -100,
        scaleRange = [0.7, 1.2]
    } = {}) {
        this.group = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (areaX[1] - areaX[0]) + areaX[0];
            const z = Math.random() * (areaZ[1] - areaZ[0]) + areaZ[0];
            const scale = scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]);
            const tree = new Tree({
                position: new THREE.Vector3(x, y, z),
                scale
            });
            this.group.add(tree.group);
        }
    }
}