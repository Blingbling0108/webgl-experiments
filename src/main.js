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
import Bird from './objects/Bird.js';
import Cloud from './objects/Cloud.js';
import Mushroom from './objects/Mushroom.js';

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
lion.threegroup.position.set(0, -20, 0);

scene.add(lion.threegroup);

// 创建风扇
const fan = new Fan();
fan.threegroup.position.set(0, 0, 350);
scene.add(fan.threegroup);

// 创建森林
const forest = new Forest({
  count: 2,
  areaX: [-350, -100],
  areaZ: [-100, -200],
  y: -80,
  scaleRange: [50, 150] 
});

scene.add(forest.group);

// 创建蘑菇
const mushroom1 = new Mushroom();
mushroom1.group.position.set(290, -120, -150);
mushroom1.group.scale.setScalar(2);
scene.add(mushroom1.group);

const mushroom2 = new Mushroom();
mushroom2.group.position.set(-240, -120, -60);
mushroom2.group.scale.setScalar(1.5);
scene.add(mushroom2.group);

const mushroom3 = new Mushroom();
mushroom3.group.position.set(-280, -120, -10);
scene.add(mushroom3.group);

// 创建岛屿
const island = new Island({ position: new THREE.Vector3(0, -200, -300), scale: 1 });
scene.add(island.group);

// 创建右侧小鸡
const bird2 = new Bird();
scene.add(bird2.group);

// 创建云朵并放在狮子右上方
const cloud = new Cloud({ position: new THREE.Vector3(170, 180, 150), scale: 4 });
scene.add(cloud.group);

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
    camera.position.set(0, -100, 800);
    camera.lookAt(0, 0, 0);
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

// Saturn土星环参数
const parameters = {
  minRadius : 35,
  maxRadius : 65,
  minSpeed:.02,
  maxSpeed:.03,
  particles:400,
  minSize:.5,
  maxSize:1.8,
};

class Saturn {
  constructor() {
    const geomPlanet = new THREE.TetrahedronGeometry(20,2);
    const noise = 5;
    // 兼容BufferGeometry顶点扰动
    const position = geomPlanet.attributes.position;
    for (let i = 0; i < position.count; i++) {
      position.setX(i, position.getX(i) + (-noise/2 + Math.random()*noise));
      position.setY(i, position.getY(i) + (-noise/2 + Math.random()*noise));
      position.setZ(i, position.getZ(i) + (-noise/2 + Math.random()*noise));
    }
    position.needsUpdate = true;
    const matPlanet = new THREE.MeshStandardMaterial({ color: 0xee5624, roughness: 0.9, emissive: 0x270000, flatShading: true });
    this.planet = new THREE.Mesh(geomPlanet, matPlanet);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;
  }
}

// 创建土星环并加入场景
const saturn = new Saturn();
saturn.planet.position.set(0, 80, -100);

// 添加背景音乐
const bgm = new Audio('calm2.ogg');
bgm.loop = true;
bgm.volume = 0.5;
window.addEventListener('click', () => {
  if (bgm.paused) bgm.play();
});
// 自动尝试播放（部分浏览器需用户交互后才允许）
bgm.play().catch(() => {});

// 添加风声音效
const windAudio = new Audio('wind.ogg');
windAudio.loop = true;
windAudio.volume = 0.7;

// 摄像机动画参数
let cameraAnim = {
  running: true,
  fromZ: 2000,
  toZ: camera.position.z,
  duration: 1.8, // 秒
  startTime: null
};
camera.position.z = cameraAnim.fromZ;

window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('start-overlay');
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    overlay.classList.add('rip');
    setTimeout(() => {
      overlay.style.display = 'none';
      cameraAnim.running = true;
      cameraAnim.startTime = null;
    }, 1000); // 动画时长
  });
});

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

  // 更新云朵（包含下雨效果）
  cloud.update(deltaTime);

  // 计算狮子视线角度
  const tempHA = (mousePos.x - windowHalfX) / 200;
  const tempVA = (mousePos.y - windowHalfY) / 200;
  const lionHAngle = Math.min(Math.max(tempHA, -Math.PI/3), Math.PI/3);
  const lionVAngle = Math.min(Math.max(tempVA, -Math.PI/3), Math.PI/3);

  // 小鸡害羞逻辑，只有当狮子视线小于-45度（-Math.PI/4）才害羞
  if (lionHAngle < -Math.PI/4 && !bird2.intervalRunning) {
    bird2.lookAway(true);
    bird2.intervalRunning = true;
    bird2.behaviourInterval = setInterval(() => {
      bird2.lookAway(false);
    }, 1500);
  } else if (lionHAngle >= -Math.PI/4 && bird2.intervalRunning) {
    bird2.stare();
    clearInterval(bird2.behaviourInterval);
    bird2.intervalRunning = false;
  }
  // 小鸡动画更新
  bird2.look(bird2.shyAngles.h, bird2.shyAngles.v);
  bird2.bodyBird.material.color.setRGB(bird2.color.r, bird2.color.g, bird2.color.b);

  saturn.planet.rotation.y -= .01;

  // 摄像机入场动画
  if (cameraAnim.running) {
    if (!cameraAnim.startTime) cameraAnim.startTime = performance.now();
    const t = Math.min((performance.now() - cameraAnim.startTime) / (cameraAnim.duration * 1000), 1);
    camera.position.z = cameraAnim.fromZ + (cameraAnim.toZ - cameraAnim.fromZ) * t;
    if (t >= 1) cameraAnim.running = false;
  }

  // 渲染场景
  renderer.render(scene, camera);
}

// 启动动画循环
animate();

// 窗口大小变化处理
window.addEventListener('resize', () => {
  updateWindowSize();
});

// 鼠标控制风扇交互
window.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});
window.addEventListener('mousedown', () => {
  isBlowing = true;
  if (windAudio.paused) windAudio.play();
});
window.addEventListener('mouseup', () => {
  isBlowing = false;
  windAudio.pause();
  windAudio.currentTime = 0;
});