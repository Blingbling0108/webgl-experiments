// Three.js 控制与事件处理
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
} 