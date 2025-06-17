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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // 主方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(200, 300, 200);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.left = -600;
    mainLight.shadow.camera.right = 600;
    mainLight.shadow.camera.top = 600;
    mainLight.shadow.camera.bottom = -600;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 2000;
    scene.add(mainLight);
    
    // 辅助光源
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-200, 200, 100);
    scene.add(fillLight);
    
    // 轮廓光
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 200, -300);
    rimLight.castShadow = true;
    scene.add(rimLight);
    
    return {
        ambientLight,
        mainLight,
        fillLight,
        rimLight
    };
}

// 创建动态光照系统（随时间变化）
export function createDynamicLights(scene) {
    const lights = createBasicLights(scene);
    
    // 添加点光源作为特效光源
    const effectLight = new THREE.PointLight(
        0xff5555, // 颜色
        1, // 强度
        500 // 距离
    );
    effectLight.position.set(0, 100, 300);
    effectLight.castShadow = true;
    scene.add(effectLight);
    
    // 存储灯光状态
    let time = 0;
    const lightState = {
        effectLight,
        intensity: 1,
        pulseSpeed: 2,
        colors: [0xff5555, 0x55ff55, 0x5555ff],
        colorIndex: 0
    };
    
    // 添加更新方法
    lights.update = (deltaTime) => {
        time += deltaTime;
        
        // 脉冲效果
        lightState.intensity = 0.8 + Math.sin(time * lightState.pulseSpeed) * 0.2;
        effectLight.intensity = lightState.intensity;
        
        // 每3秒切换颜色
        if (Math.floor(time) % 3 === 0) {
            lightState.colorIndex = (lightState.colorIndex + 1) % lightState.colors.length;
            effectLight.color.set(lightState.colors[lightState.colorIndex]);
        }
    };
    
    return lights;
}

// 添加光源辅助器（开发环境使用）
function addLightHelpers(scene, lights) {
    const helpers = [];
    
    lights.forEach(light => {
        let helper;
        
        if (light instanceof THREE.DirectionalLight) {
            helper = new THREE.DirectionalLightHelper(light, 5);
        } 
        else if (light instanceof THREE.PointLight) {
            helper = new THREE.PointLightHelper(light, 5);
        }
        else if (light instanceof THREE.RectAreaLight) {
            helper = new THREE.RectAreaLightHelper(light);
        }
        else if (light instanceof THREE.SpotLight) {
            helper = new THREE.SpotLightHelper(light);
        }
        
        if (helper) {
            scene.add(helper);
            helpers.push(helper);
        }
    });
    
    return helpers;
}

// 根据环境调整光照强度
export function adjustLightingForEnvironment(scene, envType) {
    const lights = scene.children.filter(child => child.isLight);
    
    lights.forEach(light => {
        switch(envType) {
            case 'sunset':
                if (light.isDirectionalLight) {
                    light.intensity *= 0.7;
                    light.color.set(0xffcc99);
                }
                break;
                
            case 'night':
                if (light.isAmbientLight) {
                    light.intensity = 0.2;
                } else {
                    light.intensity *= 0.4;
                }
                break;
                
            case 'overcast':
                if (light.isDirectionalLight) {
                    light.intensity *= 0.5;
                    light.color.set(0xccccff);
                }
                break;
                
            default: // 日光环境
                // 保持默认值
        }
    });
}