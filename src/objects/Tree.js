// src/objects/Tree.js
import * as THREE from 'three';
import Trunc from './Trunc.js';

export default class Tree {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.trunc = new Trunc();
    this.mesh.add(this.trunc.mesh);
    
    // 随机旋转和缩放
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
    const scale = 0.7 + Math.random() * 0.6;
    this.mesh.scale.set(scale, scale, scale);
  }
}