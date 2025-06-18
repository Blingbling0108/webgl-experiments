// src/objects/Foliage.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import { rangeRandom, rangeRandomInt } from '../utils/math.js';

export default class Foliage {
  constructor(size, color = null) {
    this.size = size;
    
    // 创建树叶球体
    const foliageColor = color || Colors.getRandomFrom(Colors.pinks);
    const geometry = new THREE.SphereGeometry(
      this.size, 
      rangeRandomInt(6, 10), // 宽度分段
      rangeRandomInt(6, 10)  // 高度分段
    );
    
    const material = new THREE.MeshStandardMaterial({
      color: foliageColor,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    
    // 添加噪声使树叶更自然
    this.addNoise(this.mesh.geometry, this.size * 0.1);
    
    // 添加子树叶
    this.addSubFoliage();
  }
  
  addNoise(geometry, intensity) {
    const position = geometry.attributes.position;
    const vertices = [];
    
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      
      vertices.push(
        x + (Math.random() - 0.5) * intensity,
        y + (Math.random() - 0.5) * intensity,
        z + (Math.random() - 0.5) * intensity
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
  }
  
  addSubFoliage() {
    // 在树叶球体上添加小叶子
    const subCount = rangeRandomInt(3, 6);
    for (let i = 0; i < subCount; i++) {
      const subSize = this.size * (0.3 + Math.random() * 0.2);
      const subGeometry = new THREE.SphereGeometry(
        subSize,
        rangeRandomInt(4, 6),
        rangeRandomInt(4, 6)
      );
      
      const subMaterial = new THREE.MeshStandardMaterial({
        color: Colors.getRandomFrom(Colors.pinks),
        roughness: 0.8,
        metalness: 0.1,
        flatShading: true
      });
      
      const subFoliage = new THREE.Mesh(subGeometry, subMaterial);
      
      // 在球体表面随机分布
      const angle = Math.random() * Math.PI * 2;
      const distance = this.size * (0.7 + Math.random() * 0.3);
      subFoliage.position.x = Math.cos(angle) * distance;
      subFoliage.position.z = Math.sin(angle) * distance;
      subFoliage.position.y = rangeRandom(-this.size, this.size);
      
      this.mesh.add(subFoliage);
    }
  }
}