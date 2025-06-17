// Three.js 地板创建
import * as THREE from 'three';

export function createFloor({ size = 20, color = 0x888888 } = {}) {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
} 