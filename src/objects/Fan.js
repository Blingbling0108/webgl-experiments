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
        this.redMat = new THREE.MeshLambertMaterial({
            color: 0xad3525,
            flatShading: true
        });
        
        // 灰色材质（核心）
        this.greyMat = new THREE.MeshLambertMaterial({
            color: 0x653f4c,
            flatShading: true
        });
        
        // 黄色材质（球体）
        this.yellowMat = new THREE.MeshLambertMaterial({
            color: 0xfdd276,
            flatShading: true
        });
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

    update(xTarget, yTarget, deltaTime, isBlowing) {
        // 更新吹风状态
        this.isBlowing = isBlowing;
        
        // 使风扇朝向固定点（模拟原始代码中的 lookAt 行为）
        this.threegroup.lookAt(new THREE.Vector3(0, 80, 60));
        
        // 计算目标位置（基于鼠标位置）
        const tPosX = this.rule3(xTarget, -200, 200, -250, 250);
        const tPosY = this.rule3(yTarget, -200, 200, 250, -250);
        
        // 平滑移动风扇到目标位置
        this.threegroup.position.x += (tPosX - this.threegroup.position.x) * deltaTime * 4;
        this.threegroup.position.y += (tPosY - this.threegroup.position.y) * deltaTime * 4;
        
        // 根据吹风状态更新螺旋桨速度
        this.updatePropellerSpeed(deltaTime);
        
        // 应用螺旋桨旋转
        this.propeller.rotation.z += this.speed;
    }

    updatePropellerSpeed(deltaTime) {
        // 计算目标速度（基于吹风状态）
        const targetSpeed = this.isBlowing ? 15 * deltaTime : 5 * deltaTime;
        
        if (this.isBlowing && this.speed < targetSpeed) {
            // 吹风状态：加速
            this.acc += 0.01 * deltaTime;
            this.speed += this.acc;
        } else if (!this.isBlowing) {
            // 非吹风状态：减速
            this.acc = 0;
            this.speed *= Math.pow(0.4, deltaTime);
            
            // 确保速度不会变为负值
            if (this.speed < 0.001) {
                this.speed = 0;
            }
        }
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