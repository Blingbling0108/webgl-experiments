// main.js - 应用入口
import { initScene, getScene, getCamera, getRenderer } from './core/sceneSetup.js';
import { createFloor } from './core/floor.js';
import { createBasicLights } from './core/lights.js';
import { createControls } from './core/controls.js';
import Lion from './objects/Lion.js';
import Fan from './objects/Fan.js';
import { rule3, clamp, lerp } from './utils/math.js';
import '../styles/main.css';
import { addAxesHelper } from './utils/helpers.js';
import { FPSCounter } from './counter.js';

// 初始化场景、相机、渲染器
initScene();
const scene = getScene();
const camera = getCamera();
const renderer = getRenderer();

// 灯光
createBasicLights(scene);

// 地板
createFloor(scene);

// 辅助器
addAxesHelper(scene, 200);

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

// 帧率计数器
const fpsCounter = new FPSCounter({ position: 'top-right' });

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
