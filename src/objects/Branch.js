// src/objects/Branch.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import { rangeRandom } from '../utils/math.js';
import Foliage from './Foliage.js';

export default class Branch {
  constructor(height, thickness, trunkColor, colorPalette, complex = false) {
    // 树枝参数
    this.length = height;
    this.radius = thickness;
    
    // 创建树枝几何体
    const geometry = new THREE.CylinderGeometry(
      this.radius, 
      this.radius * 0.7, 
      this.length, 
      8 // 分段数
    );
    
    // 创建材质
    const material = new THREE.MeshStandardMaterial({
      color: trunkColor || Colors.grey_d,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });
    
    // 创建树枝网格
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2; // 水平方向
    
    // 添加用户数据便于识别
    this.mesh.userData = { type: 'branch', length: this.length };
    
    // 添加轻微弯曲效果
    this.mesh.rotation.z = rangeRandom(-0.2, 0.2);
    this.mesh.rotation.y = rangeRandom(-0.2, 0.2);
    
    // 如果是复杂树枝，添加树叶
    if (complex && colorPalette) {
      this.addFoliage(colorPalette);
    }
  }
  
  addFoliage(colorPalette) {
    const foliageCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < foliageCount; i++) {
      const foliageSize = this.radius * (2 + Math.random() * 2);
      const foliage = new Foliage(foliageSize, Colors.getRandomFrom(colorPalette));
      
      // 在树枝上随机分布
      const position = (i / foliageCount) * this.length - this.length / 2;
      foliage.mesh.position.set(position, 0, 0);
      
      this.mesh.add(foliage.mesh);
    }
  }
}