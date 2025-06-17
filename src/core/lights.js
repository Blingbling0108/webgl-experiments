// src/core/Lights.js
import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

// 创建基础光照系统
export function createBasicLights(scene) {
    // 半球光 - 提供基础环境光照
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    scene.add(hemiLight);

    // 主方向光（产生阴影）
    const shadowLight = new THREE.DirectionalLight(0xffffff, 1.2);
    shadowLight.position.set(200, 400, 200);
    shadowLight.castShadow = true;
    shadowLight.shadow.bias = -0.001;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    shadowLight.shadow.camera.left = -600;
    shadowLight.shadow.camera.right = 600;
    shadowLight.shadow.camera.top = 600;
    shadowLight.shadow.camera.bottom = -600;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 2000;
    scene.add(shadowLight);

    // 背光
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-100, 200, 50);
    backLight.castShadow = true;
    backLight.shadow.bias = -0.001;
    scene.add(backLight);

    return { hemiLight, shadowLight, backLight };
}

// 创建高级光照系统（带物理效果）
export function createPhysicalLights(scene) {
    // 环境光 - 提供基础环境光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    
    // 主方向光
    const mainLight = new THREE.DirectionalLight(0xfff8e7, 4);
    mainLight.position.set(300, 500, 300);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.left = -800;
    mainLight.shadow.camera.right = 800;
    mainLight.shadow.camera.top = 800;
    mainLight.shadow.camera.bottom = -800;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 2500;
    scene.add(mainLight);
    
    // 辅助光源
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-300,500, 300);
    scene.add(fillLight);
    
    // 轮廓光
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 300, -400);
    rimLight.castShadow = true;
    scene.add(rimLight);
    
    return {
        ambientLight,
        mainLight,
        fillLight,
        rimLight
    };
}





