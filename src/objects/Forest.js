// src/objects/Forest.js
import * as THREE from 'three';
import Trunc from './Trunc.js';

export default class Forest {
    constructor(count, size, minX, maxX) {
        this.group = new THREE.Group();
        this.count = count;
        this.size = size;
        this.minX = minX;
        this.maxX = maxX;
        
        this.createTrees();
    }
    
    createTrees() {
        for (let i = 0; i < this.count; i++) {
            const x = Math.random() * (this.maxX - this.minX) + this.minX;
            const z = Math.random() * this.size - this.size / 2;
            
            const complex = Math.random() > 0.5; // 50% 概率生成复杂树木
            const tree = new Trunc(complex);
            
            tree.mesh.position.set(x, 0, z);
            tree.mesh.scale.setScalar(Math.random() * 0.5 + 0.5); // 随机缩放
            
            this.group.add(tree.mesh);
        }
    }
}