import * as THREE from 'three';
import Rain from './Rain.js';

export default class Cloud {
  constructor({ position = new THREE.Vector3(0, 0, 0), scale = 1 } = {}) {
    this.group = new THREE.Group();
    // 云朵由多个不同大小的方块组合，形成纵深感
    this.cloudParts = [
      { x: 0, y: 0, z: 0, s: 18 },
      { x: 15, y: 2, z: 2, s: 13 },
      { x: -14, y: 3, z: -2, s: 12 },
      { x: 8, y: 7, z: -6, s: 10 },
      { x: -8, y: 5, z: 7, s: 9 },
      { x: 0, y: -2, z: 10, s: 7 }
    ];
    this.meshes = [];
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    this.cloudParts.forEach((part, i) => {
      const geom = new THREE.BoxGeometry(part.s, part.s, part.s);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(part.x, part.y, part.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
      this.meshes.push(mesh);
    });
    this.rain = new Rain();
    this.group.add(this.rain.points);
    this.group.position.copy(position);
    this.group.scale.setScalar(scale);
    this.time = Math.random() * Math.PI * 2;
  }

  update(delta) {
    this.rain.update(delta);
    this.time += delta;
    this.meshes.forEach((mesh, i) => {
      // 每个方块上下浮动和左右轻微摆动，带有错位感
      const base = this.cloudParts[i];
      mesh.position.y = base.y + Math.sin(this.time * 0.8 + i) * 1.2 + Math.cos(this.time * 0.5 + i) * 0.5;
      mesh.position.x = base.x + Math.cos(this.time * 0.6 + i * 1.2) * 1.1;
    });
  }
} 