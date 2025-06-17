// src/main.js
import * as THREE from 'three';
import { initScene, getScene, getCamera, getRenderer, updateWindowSize } from './core/sceneSetup.js';
import { createFloor } from './core/floor.js';
import { createBasicLights, createPhysicalLights } from './core/lights.js';
import { createControls } from './core/controls.js';
import Lion from './objects/Lion.js';
import Fan from './objects/Fan.js';
import { rule3, clamp, lerp } from './utils/math.js';
import { addAxesHelper } from './utils/helpers.js';
import { FPSCounter } from './utils/counter.js';
import './styles/main.css';

// 初始化场景、相机、渲染器
initScene();
const scene = getScene();
const camera = getCamera();
const renderer = getRenderer();

// 创建灯光系统
const lights = createPhysicalLights(scene);

// 创建地板
createFloor(scene);

// 创建狮子
const lion = new Lion();
lion.threegroup.position.set(-2, 0.3, 0);
scene.add(lion.threegroup);

// 创建风扇
const fan = new Fan();
fan.threegroup.position.set(0, 0, 350);
scene.add(fan.threegroup);

// 创建控制器
// const controls = createControls(camera, renderer); // 注释掉控制器

// 创建帧率计数器
const fpsCounter = new FPSCounter({ 
  position: 'top-right',
  showGraph: true,
  graphColor: '#ff6b6b'
});

// 添加说明文本
const instructions = document.createElement('div');
instructions.id = 'instructions';
instructions.innerHTML = `
  <div class="instruction-content">
    <h1>3D 交互狮子</h1>
    <p>点击并拖动鼠标使风扇吹风</p>
    <p>狮子会对风作出反应</p>
    <div class="keyboard-controls">
      <div class="key"><kbd>W</kbd> <span>前进</span></div>
      <div class="key"><kbd>S</kbd> <span>后退</span></div>
      <div class="key"><kbd>A</kbd> <span>左移</span></div>
      <div class="key"><kbd>D</kbd> <span>右移</span></div>
      <div class="key"><kbd>Q</kbd> <span>上移</span></div>
      <div class="key"><kbd>E</kbd> <span>下移</span></div>
      <div class="key"><kbd>R</kbd> <span>重置场景</span></div>
    </div>
    <div class="stats">
      <div class="stat">
        <span class="label">风扇速度:</span>
        <span id="fan-speed" class="value">0</span>
      </div>
      <div class="stat">
        <span class="label">风力强度:</span>
        <span id="wind-strength" class="value">0</span>
      </div>
    </div>
  </div>
`;
document.body.appendChild(instructions);

// 添加版权信息
const credits = document.createElement('div');
credits.id = 'credits';
credits.innerHTML = `
  <p>Three.js 交互演示 | 基于 <a href="https://codepen.io/Yakudoo/pen/YXxmYR" target="_blank">Lion by Yakudoo</a></p>
  <p>使用 Three.js r136 构建</p>
`;
document.body.appendChild(credits);

// 状态变量
let isBlowing = false;
let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let fanSpeed = 0;
let windStrength = 0;
const clock = new THREE.Clock();
let deltaTime = 0;

// 相机移动速度
const cameraMoveSpeed = 5;

// 处理键盘输入
const keysPressed = {};

document.addEventListener('keydown', (event) => {
  keysPressed[event.key.toLowerCase()] = true;
  
  // 重置场景
  if (event.key === 'r' || event.key === 'R') {
    camera.position.set(0, 0, 800);
    camera.lookAt(0, 50, 0);
  }
});

document.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});

// 更新相机位置
function updateCameraPosition(deltaTime) {
  const speed = cameraMoveSpeed * deltaTime;
  
  if (keysPressed['w']) {
    camera.position.z -= speed;
  }
  if (keysPressed['s']) {
    camera.position.z += speed;
  }
  if (keysPressed['a']) {
    camera.position.x -= speed;
  }
  if (keysPressed['d']) {
    camera.position.x += speed;
  }
  if (keysPressed['q']) {
    camera.position.y += speed;
  }
  if (keysPressed['e']) {
    camera.position.y -= speed;
  }
  
  camera.lookAt(0, 0, 0);
}

// 更新UI显示
function updateUI() {
  document.getElementById('fan-speed').textContent = fanSpeed.toFixed(2);
  document.getElementById('wind-strength').textContent = windStrength.toFixed(2);
}

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  
  // 更新时间增量
  deltaTime = clock.getDelta();
  
  // 更新控制器
  // if (controls && controls.update) {
  //   controls.update(deltaTime);
  // }
  
  // 更新相机位置
  // updateCameraPosition(deltaTime);
  
  // 计算鼠标位置相对于屏幕中心
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  const xTarget = mousePos.x - windowHalfX;
  const yTarget = mousePos.y - windowHalfY;
  
  // 更新风扇
  fan.isBlowing = isBlowing;
  fan.update(xTarget, yTarget, deltaTime);
  
  // 更新狮子
  if (isBlowing) {
    lion.cool(xTarget, yTarget, deltaTime);
    windStrength = lerp(windStrength, 1.0, deltaTime * 2);
  } else {
    lion.look(xTarget, yTarget);
    windStrength = lerp(windStrength, 0.0, deltaTime * 5);
  }
  
  // 更新风扇速度显示
  fanSpeed = fan.speed;
  
  // 更新UI
  updateUI();
  
  // 狮子始终正视前方
  lion.threegroup.rotation.set(0, 0, 0);
  
  // 渲染场景
  renderer.render(scene, camera);
}

// 启动动画循环
animate();

// 窗口大小变化处理
window.addEventListener('resize', () => {
  updateWindowSize();
  
  // 更新说明位置
  instructions.style.top = `${window.innerHeight - instructions.offsetHeight - 20}px`;
});

// 鼠标控制风扇交互
window.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});
window.addEventListener('mousedown', () => {
  isBlowing = true;
});
window.addEventListener('mouseup', () => {
  isBlowing = false;
});