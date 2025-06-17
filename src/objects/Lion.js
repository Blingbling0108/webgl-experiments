// Lion.js - 狮子3D对象
import * as THREE from 'three';

export class Lion extends THREE.Group {
  constructor() {
    super();
    // 这里可以添加狮子的身体、头部等部件
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.6, 2),
      new THREE.MeshStandardMaterial({ color: 0xffc107 })
    );
    this.add(body);
  }
} 