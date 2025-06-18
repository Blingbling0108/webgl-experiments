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
        this.trees = []; // 存储所有树实例
        this.minDistance = 50; // 最小间距
        
        for (let i = 0; i < count; i++) {
            let x, z;
            let attempts = 0;
            const maxAttempts = 100; // 最大尝试次数
            
            // 尝试生成符合间距要求的位置
            do {
                x = Math.random() * (areaX[1] - areaX[0]) + areaX[0];
                z = Math.random() * (areaZ[1] - areaZ[0]) + areaZ[0];
                attempts++;
            } while (this.isTooClose(x, z) && attempts < maxAttempts);
            
            const scale = scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]);
            const tree = new Tree({
                position: new THREE.Vector3(x, y, z),
                scale
            });
            this.group.add(tree.group);
            this.trees.push(tree); // 保存树实例
        }
    }

    // 检查新位置是否与现有树太近
    isTooClose(newX, newZ) {
        for (const tree of this.trees) {
            const treeX = tree.group.position.x;
            const treeZ = tree.group.position.z;
            
            // 计算X轴距离
            const xDistance = Math.abs(newX - treeX);
            
            // 如果X轴距离小于最小间距，则太近
            if (xDistance < this.minDistance) {
                return true;
            }
        }
        return false;
    }

    // 更新所有树的动画
    update(deltaTime, windStrength = 0) {
        this.trees.forEach(tree => {
            tree.update(deltaTime, windStrength);
        });
    }
}