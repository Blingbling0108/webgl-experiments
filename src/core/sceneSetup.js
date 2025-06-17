// src/core/SceneSetup.js
import * as THREE from 'three';

// 导出的变量
export let scene, camera, renderer;
export let HEIGHT, WIDTH, windowHalfX, windowHalfY;

// 初始化场景
export function initScene() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xebe5e7);
    
    // 设置窗口尺寸
    updateWindowSize();
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(
        60, // 视野角度
        WIDTH / HEIGHT, // 宽高比
        1, // 近裁剪面
        2000 // 远裁剪面
    );
    camera.position.z = 800;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
        alpha: true, // 允许透明度
        antialias: true, // 开启抗锯齿
        powerPreference: "high-performance" // 高性能模式
    });
    
    // 设置渲染器参数
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用软阴影
    
    // 添加到DOM
    const container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', onWindowResize);
    
    // 可选：添加性能统计
    // initStats();
}

// 更新窗口尺寸
export function updateWindowSize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    
    if (renderer) {
        renderer.setSize(WIDTH, HEIGHT);
    }
    
    if (camera) {
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    }
}

// 窗口大小变化处理
function onWindowResize() {
    updateWindowSize();
}

// 获取场景对象
export function getScene() {
    return scene;
}

// 获取相机对象
export function getCamera() {
    return camera;
}

// 获取渲染器对象
export function getRenderer() {
    return renderer;
}

// 可选：初始化性能统计
function initStats() {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    
    function animate() {
        stats.update();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}