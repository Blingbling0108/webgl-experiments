// main.js - 应用入口
import { createScene, createCamera, createRenderer } from './core/sceneSetup.js';
import { createLights } from './core/lights.js';
import { createFloor } from './core/floor.js';
import { createControls } from './core/controls.js';
import Lion from './objects/Lion.js';
import { Fan } from './objects/Fan.js';
import { resizeRendererToDisplaySize } from './utils/helpers.js';
import '../styles/main.css';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
document.body.appendChild(renderer.domElement);

// 灯光
const { ambientLight, directionalLight } = createLights();
scene.add(ambientLight);
scene.add(directionalLight);

// 地板
const floor = createFloor();
scene.add(floor);

// 狮子
const lion = new Lion();
lion.threegroup.position.set(-2, 0.3, 0);
scene.add(lion.threegroup);

// 风扇
const fan = new Fan();
fan.position.set(2, 0.25, 0);
scene.add(fan);

// 控制器
const controls = createControls(camera, renderer);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  resizeRendererToDisplaySize(renderer);
  renderer.render(scene, camera);
}
animate();
