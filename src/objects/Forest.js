// src/objects/Forest.js
import * as THREE from 'three';
import Trunc from './Trunc.js';

export default class Forest {
    constructor(count, size, minX, maxX, minZ = 0, maxZ = 0, options = {}) {
        // 优化默认参数：树干和树枝适度放大，树叶适度缩小
        const defaultTrunkScale = { min: 0.8, max: 1.1 };
        const defaultBranchScale = { min: 0.7, max: 1.0 };
        const defaultFoliageScale = { min: 0.3, max: 0.6 };
        this.options = {
            trunkScale: defaultTrunkScale,
            branchScale: defaultBranchScale,
            foliageScale: defaultFoliageScale,
            ...options
        };
        this.group = new THREE.Group();
        this.count = count;
        this.size = size;
        this.minX = minX;
        this.maxX = maxX;
        this.minZ = minZ;
        this.maxZ = maxZ;
        
        this.createTrees();
    }
    
    createTrees() {
        for (let i = 0; i < this.count; i++) {
            const x = Math.random() * (this.maxX - this.minX) + this.minX;
            const z = Math.random() * this.size - this.size / 2;
            
            const complex = Math.random() > 0.5; // 50% 概率生成复杂树木
            const tree = new Trunc(complex);
            
            tree.mesh.position.set(x, 0, z);
            
            this.group.add(tree.mesh);
        }
    }
}