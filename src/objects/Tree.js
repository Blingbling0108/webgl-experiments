// src/objects/Tree.js
import * as THREE from 'three';
import Trunc from './Trunc.js';

export default class Tree {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.trunc = new Trunc();
    this.mesh.add(this.trunc.mesh);
  }
}