// src/objects/Fan.js
import * as THREE from 'three';

export default class Fan {
    constructor() {
        this.isBlowing = false;
        this.speed = 0;
        this.acc = 0;
        this.threegroup = new THREE.Group();
        
        // 创建材质
        this.createMaterials();
        
        // 创建风扇组件
        this.createCore();
        this.createPropeller();
        this.createSphere();
        
        // 设置初始位置
        this.threegroup.position.z = 350;
        
        // 启用阴影
        this.setupShadows();
    }

    createMaterials() {
        // 红色材质（螺旋桨）
        this.redMat = new THREE.MeshStandardMaterial({ color: 0xad3525, roughness: 0.3, metalness: 0.2 });
        
        // 灰色材质（核心）
        this.greyMat = new THREE.MeshStandardMaterial({ color: 0x653f4c, roughness: 0.3, metalness: 0.2 });
        
        // 黄色材质（球体）
        this.yellowMat = new THREE.MeshStandardMaterial({ color: 0xfdd276, roughness: 0.3, metalness: 0.2 });
    }

    createCore() {
        // 风扇核心（长方体）
        const coreGeom = new THREE.BoxGeometry(10, 10, 20);
        this.core = new THREE.Mesh(coreGeom, this.greyMat);
        this.threegroup.add(this.core);
    }

    createPropeller() {
        // 单个螺旋桨叶片
        const propGeom = new THREE.BoxGeometry(10, 30, 2);
        // 将几何体向上平移，使旋转中心在底部
        propGeom.translate(0, 25, 0);
        
        // 创建螺旋桨组
        this.propeller = new THREE.Group();
        
        // 创建四个螺旋桨叶片
        for (let i = 0; i < 4; i++) {
            const prop = new THREE.Mesh(propGeom, this.redMat);
            // 设置初始位置和旋转
            prop.position.z = 15;
            prop.rotation.z = (Math.PI / 2) * i;
            this.propeller.add(prop);
        }
        
        this.threegroup.add(this.propeller);
    }

    createSphere() {
        // 风扇前部的球体
        const sphereGeom = new THREE.BoxGeometry(10, 10, 3);
        this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
        this.sphere.position.z = 15;
        this.threegroup.add(this.sphere);
    }

    setupShadows() {
        // 为所有组件启用阴影
        this.threegroup.traverse(object => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    update(xTarget, yTarget, deltaTime) {
        // 运动中心和范围参考原始代码
        this.threegroup.lookAt(new THREE.Vector3(0, 80, 60));
        const tPosX = this.rule3(xTarget, -200, 200, -250, 250);
        const tPosY = this.rule3(yTarget, -200, 200, 250, -250);
        this.threegroup.position.x += (tPosX - this.threegroup.position.x) * deltaTime * 4;
        this.threegroup.position.y += (tPosY - this.threegroup.position.y) * deltaTime * 4;
        // 风扇转动逻辑
        const targetSpeed = this.isBlowing ? 15 * deltaTime : 5 * deltaTime;
        if (this.isBlowing && this.speed < targetSpeed) {
            this.acc += 0.01 * deltaTime;
            this.speed += this.acc;
        } else if (!this.isBlowing) {
            this.acc = 0;
            this.speed *= Math.pow(0.4, deltaTime);
            if (this.speed < 0.001) this.speed = 0;
        }
        this.propeller.rotation.z += this.speed;
    }

    rule3(v, vmin, vmax, tmin, tmax) {
        // 将输入值从范围 [vmin, vmax] 映射到 [tmin, tmax]
        const nv = Math.max(Math.min(v, vmax), vmin);
        const dv = vmax - vmin;
        const pc = (nv - vmin) / dv;
        const dt = tmax - tmin;
        return tmin + pc * dt;
    }
}