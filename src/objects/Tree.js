// src/objects/Tree.js
import * as THREE from 'three';
import { Colors } from '../utils/colors.js';

export default class Tree {
  constructor({ position = new THREE.Vector3(0, 0, 0), scale = 1 } = {}) {
    // 使用colors.js中的颜色
    const leafColors = Colors.leafGreens;
    const stemColors = Colors.stemColors;
    
    // 统一几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // 随机材质
    const leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: Colors.getRandomFrom(leafColors) });
    const leaveLightMaterial = new THREE.MeshLambertMaterial({ color: Colors.getRandomFrom(leafColors) });
    const leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({ color: Colors.getRandomFrom(leafColors) });
    const stemMaterial = new THREE.MeshLambertMaterial({ color: Colors.getRandomFrom(stemColors) });

    // 树干
    const stem = new THREE.Mesh(geometry, stemMaterial);
    stem.position.set(0, 0, 0);
    stem.scale.set(
      0.25 + Math.random() * 0.15,
      1.2 + Math.random() * 0.7,
      0.25 + Math.random() * 0.15
    );
    stem.castShadow = true;
    stem.receiveShadow = true;

    // 创建更多树叶块
    const leaves = [];
    
    // 添加更多树叶块 - 更分散的分布
    const leafPositions = [
      // 主要树叶块
      { x: 0, y: 1.2, z: 0, scale: [0.9, 1.7, 0.9] },
      { x: 0, y: 1.2, z: 0, scale: [1.0, 0.4, 1.0] },
      
      // 外围树叶块 - 更分散
      { x: 0.8, y: 1.6, z: 0.8, scale: [0.7, 0.7, 0.7] },
      { x: -0.7, y: 1.3, z: -0.7, scale: [0.6, 0.6, 0.6] },
      { x: 0.7, y: 1.8, z: -0.8, scale: [0.6, 0.6, 0.6] },
      { x: -0.6, y: 1.5, z: 0.7, scale: [0.5, 0.5, 0.5] },
      { x: 0.9, y: 1.4, z: -0.3, scale: [0.4, 0.4, 0.4] },
      { x: -0.8, y: 1.7, z: 0.3, scale: [0.4, 0.4, 0.4] },
      
      // 更远的外围树叶块
      { x: 1.1, y: 1.2, z: 0.1, scale: [0.3, 0.3, 0.3] },
      { x: -1.0, y: 1.4, z: -0.2, scale: [0.3, 0.3, 0.3] },
      { x: 0.3, y: 2.0, z: 0.9, scale: [0.3, 0.3, 0.3] },
      { x: -0.4, y: 1.9, z: -1.0, scale: [0.3, 0.3, 0.3] },
      
      // 顶部树叶块
      { x: 0.2, y: 2.2, z: 0.4, scale: [0.2, 0.2, 0.2] },
      { x: -0.3, y: 2.1, z: 0.6, scale: [0.2, 0.2, 0.2] },
      { x: 0.5, y: 2.0, z: -0.5, scale: [0.2, 0.2, 0.2] },
      { x: -0.5, y: 2.0, z: -0.3, scale: [0.2, 0.2, 0.2] },
      
      // 底部外围树叶块
      { x: 0.6, y: 1.0, z: 0.9, scale: [0.2, 0.2, 0.2] },
      { x: -0.7, y: 1.1, z: 0.8, scale: [0.2, 0.2, 0.2] },
      { x: 0.8, y: 1.0, z: -0.6, scale: [0.2, 0.2, 0.2] },
      { x: -0.9, y: 1.0, z: -0.7, scale: [0.2, 0.2, 0.2] },
      
      // 更远的外围树叶块
      { x: 1.3, y: 1.3, z: 0.4, scale: [0.15, 0.15, 0.15] },
      { x: -1.2, y: 1.5, z: 0.5, scale: [0.15, 0.15, 0.15] },
      { x: 0.4, y: 1.8, z: 1.2, scale: [0.15, 0.15, 0.15] },
      { x: -0.6, y: 1.7, z: -1.3, scale: [0.15, 0.15, 0.15] },
      
      // 顶部小树叶块
      { x: 0.1, y: 2.4, z: 0.7, scale: [0.1, 0.1, 0.1] },
      { x: -0.2, y: 2.3, z: 0.8, scale: [0.1, 0.1, 0.1] },
      { x: 0.7, y: 2.2, z: -0.2, scale: [0.1, 0.1, 0.1] },
      { x: -0.8, y: 2.2, z: -0.1, scale: [0.1, 0.1, 0.1] }
    ];

    leafPositions.forEach((pos, index) => {
      const leafMaterial = new THREE.MeshLambertMaterial({ 
        color: Colors.getRandomFrom(leafColors)
      });
      
      const leaf = new THREE.Mesh(geometry, leafMaterial);
      leaf.position.set(pos.x, pos.y, pos.z);
      leaf.scale.set(
        pos.scale[0] + Math.random() * 0.2,
        pos.scale[1] + Math.random() * 0.2,
        pos.scale[2] + Math.random() * 0.2
      );
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      leaves.push(leaf);
    });

    // 组合
    this.group = new THREE.Group();
    leaves.forEach(leaf => this.group.add(leaf));
    this.group.add(stem);

    // 随机微调旋转
    this.group.rotation.y = Math.random() * Math.PI * 2;
    this.group.rotation.x = Math.random() * 0.2 - 0.1;
    
    // 支持外部缩放和位置
    this.group.position.copy(position);
    this.group.scale.setScalar(scale);

    // 动画相关属性
    this.leaves = leaves;
    this.initialPositions = leaves.map(leaf => leaf.position.clone()); // 保存初始位置
    this.animationTime = Math.random() * Math.PI * 2; // 随机起始时间
    this.animationSpeed = 0.5 + Math.random() * 0.5; // 随机动画速度
    this.windInfluence = 0.1 + Math.random() * 0.2; // 随机风力影响
  }

  // 更新树叶动画 - 位置移动而非摆动
  update(deltaTime, windStrength = 0) {
    this.animationTime += deltaTime * this.animationSpeed;
    
    // 为每个树叶应用不同的位置移动
    this.leaves.forEach((leaf, index) => {
      const initialPos = this.initialPositions[index];
      
      // 左右移动 (X轴)
      const xMove = Math.sin(this.animationTime + index * 0.5) * 0.1;
      
      // 上下移动 (Y轴)
      const yMove = Math.sin(this.animationTime * 0.8 + index * 0.3) * 0.05;
      
      // 前后移动 (Z轴)
      const zMove = Math.cos(this.animationTime * 1.2 + index * 0.7) * 0.08;
      
      // 风力影响 - 增加移动幅度
      const windXMove = Math.sin(this.animationTime * 2 + index * 0.3) * windStrength * this.windInfluence * 0.3;
      const windYMove = Math.sin(this.animationTime * 1.5 + index * 0.4) * windStrength * this.windInfluence * 0.2;
      const windZMove = Math.cos(this.animationTime * 2.5 + index * 0.6) * windStrength * this.windInfluence * 0.25;
      
      // 应用位置移动
      leaf.position.x = initialPos.x + xMove + windXMove;
      leaf.position.y = initialPos.y + yMove + windYMove;
      leaf.position.z = initialPos.z + zMove + windZMove;
    });
  }
}