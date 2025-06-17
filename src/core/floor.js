// src/core/Floor.js
import * as THREE from 'three';

// 创建地板并添加到场景
export function createFloor(scene) {
    // 地板几何体 - 使用平面几何体
    const floorGeometry = new THREE.PlaneGeometry(1000, 500);
    
    // 地板材质 - 使用基本材质
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // 更亮的白色
        roughness: 0.3, // 适度粗糙
        metalness: 0.2, // 适度金属反光
        side: THREE.DoubleSide // 双面渲染
    });
    
    // 创建地板网格
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    // 旋转地板使其水平
    floor.rotation.x = -Math.PI / 2;
    
    // 设置地板位置
    floor.position.y = -100;
    
    // 启用阴影
    floor.receiveShadow = true;
    
    // 添加到场景
    scene.add(floor);
    
    return floor;
}

// 高级功能：创建带纹理的地板
export function createTexturedFloor(scene, texturePath) {
    return new Promise((resolve) => {
        // 使用纹理加载器
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(texturePath, (texture) => {
            // 设置纹理参数
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(20, 10); // 重复纹理
            
            // 创建带纹理的材质
            const floorMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.8,
                metalness: 0.2
            });
            
            // 创建地板几何体
            const floorGeometry = new THREE.PlaneGeometry(1000, 500);
            
            // 创建地板网格
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -100;
            floor.receiveShadow = true;
            
            // 添加物理材质特性
            addPhysicsProperties(floor);
            
            scene.add(floor);
            resolve(floor);
        });
    });
}

// 添加物理属性（用于可能的物理引擎集成）
function addPhysicsProperties(floor) {
    // 添加物理属性
    floor.userData.physics = {
        mass: 0, // 静态物体
        shape: 'box',
        size: [1000, 1, 500]
    };
}