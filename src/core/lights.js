// Three.js 光照系统
import * as THREE from 'three';

export function createLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  return { ambientLight, directionalLight };
} 