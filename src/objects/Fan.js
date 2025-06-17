// Fan.js - 风扇3D对象
import * as THREE from 'three';

export class Fan extends THREE.Group {
  constructor() {
    super();
    // 这里可以添加风扇的底座和叶片
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x90caf9 })
    );
    this.add(base);
  }
} 