// src/main.js
import * as THREE from 'three';
import { initScene, getScene, getCamera, getRenderer, updateWindowSize } from './core/sceneSetup.js';
import { createFloor } from './core/floor.js';
import { createBasicLights, createPhysicalLights } from './core/lights.js';
import { createControls } from './core/controls.js';
import Lion from './objects/Lion.js';
import Fan from './objects/Fan.js';
import Forest from './objects/Forest.js';
import Island from './objects/Island.js';
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
lion.threegroup.position.set(0, -10, 0);

scene.add(lion.threegroup);

// 创建风扇
const fan = new Fan();
fan.threegroup.position.set(0, 0, 350);
scene.add(fan.threegroup);

// 创建森林
const forest = new Forest({
  count: 2,
  areaX: [-200, -100],
  areaZ: [10, -30],
  y: 0,
  scaleRange: [30, 100] 
});

scene.add(forest.group);

// 创建岛屿
const island = new Island({ position: new THREE.Vector3(0, -200, -300), scale: 1 });
scene.add(island.group);

// 创建控制器
// const controls = createControls(camera, renderer); // 注释掉控制器

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
  
  // 狮子跳跃
  if (event.code === 'Space') {
    event.preventDefault(); // 防止页面滚动
    lion.jump();
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
  
  // 更新森林动画
  forest.update(deltaTime, windStrength);
  
  // 更新狮子
  if (isBlowing) {
    lion.cool(xTarget, yTarget, deltaTime);
    windStrength = lerp(windStrength, 1.0, deltaTime * 2);
  } else {
    lion.look(xTarget, yTarget);
    windStrength = lerp(windStrength, 0.0, deltaTime * 5);
  }
  
  // 更新狮子跳跃
  lion.updateJump(deltaTime);
  
  // 更新风扇速度显示
  fanSpeed = fan.speed;
  
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