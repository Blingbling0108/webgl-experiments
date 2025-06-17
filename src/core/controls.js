// src/core/Controls.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 状态对象
let state = {
  isBlowing: false,
  mousePos: { x: 0, y: 0 },
  keysPressed: {},
  cameraEnabled: true,
  orbitControls: null,
  touchStartPos: { x: 0, y: 0 },
  touchDistance: 0,
  isPinching: false
};

/**
 * 创建控制器系统
 * @param {THREE.Camera} camera - 相机对象
 * @param {THREE.WebGLRenderer} renderer - 渲染器对象
 * @param {THREE.Scene} scene - 场景对象（可选，用于射线检测）
 * @returns {Object} 控制对象API
 */
export function createControls(camera, renderer, scene = null) {
  // 初始化鼠标位置
  state.mousePos = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
  
  // 创建轨道控制器
  state.orbitControls = new OrbitControls(camera, renderer.domElement);
  state.orbitControls.enableDamping = true;
  state.orbitControls.dampingFactor = 0.05;
  state.orbitControls.enableZoom = true;
  state.orbitControls.zoomSpeed = 1.0;
  state.orbitControls.enablePan = true;
  state.orbitControls.panSpeed = 0.5;
  state.orbitControls.rotateSpeed = 0.5;
  state.orbitControls.screenSpacePanning = true;
  
  // 设置控制器范围限制
  state.orbitControls.minDistance = 300;
  state.orbitControls.maxDistance = 1200;
  state.orbitControls.minPolarAngle = Math.PI / 6; // 30度
  state.orbitControls.maxPolarAngle = Math.PI / 2; // 90度
  
  // 事件监听器
  setupEventListeners(renderer.domElement);
  
  // 返回控制API
  return {
    update,
    getMousePos,
    getIsBlowing,
    toggleCameraControl,
    isCameraEnabled,
    dispose,
    getOrbitControls: () => state.orbitControls
  };
}

/**
 * 设置事件监听器
 * @param {HTMLElement} canvas - 渲染器canvas元素
 */
function setupEventListeners(canvas) {
  // 鼠标事件
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  
  // 触摸事件
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchend', handleTouchEnd);
  canvas.addEventListener('touchmove', handleTouchMove);
  
  // 键盘事件
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // 上下文菜单事件
  canvas.addEventListener('contextmenu', handleContextMenu);
}

/**
 * 更新控制器状态
 * @param {number} deltaTime - 时间增量
 */
function update(deltaTime) {
  if (state.orbitControls && state.cameraEnabled) {
    state.orbitControls.update(deltaTime);
  }
}

/**
 * 获取当前鼠标位置
 * @returns {Object} 鼠标位置 {x, y}
 */
function getMousePos() {
  return state.mousePos;
}

/**
 * 获取吹风状态
 * @returns {boolean} 是否正在吹风
 */
function getIsBlowing() {
  return state.isBlowing;
}

/**
 * 切换相机控制状态
 * @param {boolean} enabled - 是否启用相机控制
 */
function toggleCameraControl(enabled) {
  state.cameraEnabled = enabled;
  if (state.orbitControls) {
    state.orbitControls.enabled = enabled;
  }
}

/**
 * 检查相机控制是否启用
 * @returns {boolean} 相机控制状态
 */
function isCameraEnabled() {
  return state.cameraEnabled;
}

/**
 * 清理事件监听器
 */
function dispose() {
  const canvas = state.orbitControls ? state.orbitControls.domElement : null;
  
  if (canvas) {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('contextmenu', handleContextMenu);
  }
  
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
  
  if (state.orbitControls) {
    state.orbitControls.dispose();
  }
}

// 事件处理函数
function handleMouseMove(event) {
  state.mousePos.x = event.clientX;
  state.mousePos.y = event.clientY;
}

function handleMouseDown(event) {
  // 右键用于相机控制，不触发吹风
  if (event.button === 2) return;
  
  state.isBlowing = true;
  
  // 如果是左键，阻止默认行为（如文本选择）
  if (event.button === 0) {
    event.preventDefault();
  }
}

function handleMouseUp() {
  state.isBlowing = false;
}

function handleTouchStart(event) {
  if (event.touches.length === 1) {
    // 单指触摸 - 吹风
    state.isBlowing = true;
    state.mousePos.x = event.touches[0].clientX;
    state.mousePos.y = event.touches[0].clientY;
    state.touchStartPos.x = event.touches[0].clientX;
    state.touchStartPos.y = event.touches[0].clientY;
  } else if (event.touches.length === 2) {
    // 双指触摸 - 缩放/旋转
    state.isPinching = true;
    state.isBlowing = false;
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    state.touchDistance = Math.sqrt(dx * dx + dy * dy);
  }
  
  // 阻止触摸事件的默认行为（如滚动）
  event.preventDefault();
}

function handleTouchEnd(event) {
  if (event.touches.length === 0) {
    // 所有手指离开
    state.isBlowing = false;
    state.isPinching = false;
  } else if (event.touches.length === 1) {
    // 只剩一个手指，切换为吹风模式
    state.isBlowing = true;
    state.isPinching = false;
    state.mousePos.x = event.touches[0].clientX;
    state.mousePos.y = event.touches[0].clientY;
  }
}

function handleTouchMove(event) {
  if (state.isPinching && event.touches.length === 2) {
    // 双指缩放/旋转处理
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算缩放比例
    const zoomFactor = distance / state.touchDistance;
    if (state.orbitControls) {
      state.orbitControls.dollyIn(zoomFactor > 1 ? 1.1 : 0.9);
    }
    
    state.touchDistance = distance;
    
    // 计算旋转角度
    const startAngle = Math.atan2(
      state.touchStartPos.y - window.innerHeight / 2,
      state.touchStartPos.x - window.innerWidth / 2
    );
    
    const currentAngle = Math.atan2(
      (event.touches[0].clientY + event.touches[1].clientY) / 2 - window.innerHeight / 2,
      (event.touches[0].clientX + event.touches[1].clientX) / 2 - window.innerWidth / 2
    );
    
    const angleDelta = currentAngle - startAngle;
    if (state.orbitControls) {
      state.orbitControls.rotateLeft(angleDelta * 0.5);
    }
    
    state.touchStartPos.x = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    state.touchStartPos.y = (event.touches[0].clientY + event.touches[1].clientY) / 2;
  } else if (state.isBlowing && event.touches.length === 1) {
    // 单指移动 - 更新鼠标位置
    state.mousePos.x = event.touches[0].clientX;
    state.mousePos.y = event.touches[0].clientY;
  }
  
  event.preventDefault();
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  state.keysPressed[key] = true;
  
  // 空格键切换相机控制
  if (key === ' ') {
    toggleCameraControl(!state.cameraEnabled);
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  state.keysPressed[event.key.toLowerCase()] = false;
}

function handleContextMenu(event) {
  event.preventDefault();
}

/**
 * 检查按键状态
 * @param {string} key - 按键名称
 * @returns {boolean} 按键是否按下
 */
export function isKeyPressed(key) {
  return !!state.keysPressed[key.toLowerCase()];
}