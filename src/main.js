// main.js - 应用入口
import { initScene, getScene, getCamera, getRenderer } from './core/sceneSetup.js';
import { createFloor } from './core/floor.js';
import { createLights } from './core/lights.js';
import { createControls } from './core/controls.js';
import Lion from './objects/Lion.js';
import Fan from './objects/Fan.js';
import '../styles/main.css';

// 初始化场景、相机、渲染器
initScene();
const scene = getScene();
const camera = getCamera();
const renderer = getRenderer();

// 灯光
const { ambientLight, directionalLight } = createLights();
scene.add(ambientLight);
scene.add(directionalLight);

// 地板
createFloor(scene);

// 狮子
const lion = new Lion();
lion.threegroup.position.set(-2, 0.3, 0);
scene.add(lion.threegroup);

// 风扇
const fan = new Fan();
fan.threegroup.position.set(2, 0.25, 0);
scene.add(fan.threegroup);

// 控制器
const controls = createControls(camera, renderer);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
