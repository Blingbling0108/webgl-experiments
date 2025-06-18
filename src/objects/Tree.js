// src/objects/Tree.js
import * as THREE from 'three';
import Trunc from './Trunc.js';

export default class Tree {
  constructor(complex = false) {
    this.mesh = new THREE.Object3D();
    this.trunc = new Trunc(complex);
    this.mesh.add(this.trunc.mesh);
    
    // 设置树木位置和旋转
    this.mesh.position.y = -10;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
    
    // 随机缩放
    const scale = 0.8 + Math.random() * 0.4;
    this.mesh.scale.set(scale, scale, scale);
  }
}