// Three.js 场景、相机、渲染器初始化
import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  return scene;
}

export function createCamera({ fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 1000 } = {}) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 2, 5);
  return camera;
}

export function createRenderer({ antialias = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x222222);
  return renderer;
} 