// src/objects/Lion.js
import * as THREE from 'three';

export default class Lion {
    constructor() {
        this.windTime = 0;
        this.bodyInitPositions = [];
        this.maneParts = [];
        this.mustaches = [];
        this.threegroup = new THREE.Group();
        
        // 材质定义
        this.yellowMat = new THREE.MeshLambertMaterial({ 
            color: 0xfdd276, 
            flatShading: true 
        });
        this.redMat = new THREE.MeshLambertMaterial({ 
            color: 0xad3525, 
            flatShading: true 
        });
        this.pinkMat = new THREE.MeshLambertMaterial({ 
            color: 0xe55d2b, 
            flatShading: true 
        });
        this.whiteMat = new THREE.MeshLambertMaterial({ 
            color: 0xffffff, 
            flatShading: true 
        });
        this.purpleMat = new THREE.MeshLambertMaterial({ 
            color: 0x451954, 
            flatShading: true 
        });
        this.greyMat = new THREE.MeshLambertMaterial({ 
            color: 0x653f4c, 
            flatShading: true 
        });
        this.blackMat = new THREE.MeshLambertMaterial({ 
            color: 0x302925, 
            flatShading: true 
        });

        // 创建狮子各部分
        this.createBody();
        this.createLimbs();
        this.createHead();
        this.createMane();
        this.createFaceDetails();

        // 设置阴影
        this.setupShadows();

        // 初始化目标值
        this.initTargetValues();
    }

    createBody() {
        // 身体
        var bodyGeom = new THREE.CylinderGeometry(30,80, 140, 4);
        this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
        this.body.position.z = -60;
        this.body.position.y = -30;
        this.bodyVertices = [0,1,2,3,4,10];

        // BufferGeometry 顶点操作
        var position = this.body.geometry.attributes.position;
        for (var i=0; i<this.bodyVertices.length; i++) {
            var idx = this.bodyVertices[i];
            var x = position.getX(idx);
            var y = position.getY(idx);
            position.setZ(idx, 70);
            this.bodyInitPositions.push({x: x, y: y, z: 70});
        }
        position.needsUpdate = true;
        
        this.threegroup.add(this.body);
    }

    createLimbs() {
        // 膝盖
        const kneeGeom = new THREE.BoxGeometry(25, 80, 80);
        kneeGeom.translate(0, 50, 0); // 使用矩阵变换

        this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
        this.leftKnee.position.set(65, -110, -20);
        this.leftKnee.rotation.z = -0.3;

        this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
        this.rightKnee.position.set(-65, -110, -20);
        this.rightKnee.rotation.z = 0.3;

        // 脚
        const footGeom = new THREE.BoxGeometry(40, 20, 20);

        this.backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.backLeftFoot.position.set(75, -90, 30);

        this.backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.backRightFoot.position.set(-75, -90, 30);

        this.frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.frontRightFoot.position.set(-22, -90, 40);

        this.frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.frontLeftFoot.position.set(22, -90, 40);

        this.threegroup.add(
            this.leftKnee,
            this.rightKnee,
            this.backLeftFoot,
            this.backRightFoot,
            this.frontRightFoot,
            this.frontLeftFoot
        );
    }

    createHead() {
        // 头部组
        this.head = new THREE.Group();
        this.head.position.y = 60;

        // 脸部
        const faceGeom = new THREE.BoxGeometry(80, 80, 80);
        this.face = new THREE.Mesh(faceGeom, this.yellowMat);
        this.face.position.z = 135;

        // 耳朵
        const earGeom = new THREE.BoxGeometry(20, 20, 20);
        this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
        this.rightEar.position.set(-50, 50, 105);
        this.leftEar = new THREE.Mesh(earGeom, this.yellowMat);
        this.leftEar.position.set(50, 50, 105);

        // 鼻子
        const noseGeom = new THREE.BoxGeometry(40, 40, 20);
        this.nose = new THREE.Mesh(noseGeom, this.greyMat);
        this.nose.position.set(0, 25, 170);

        // 添加到头部组
        this.head.add(this.face, this.rightEar, this.leftEar, this.nose);
        this.threegroup.add(this.head);
    }

    createMane() {
        // 鬃毛组
        this.mane = new THREE.Group();
        this.mane.position.set(0, -10, 80);

        const maneGeom = new THREE.BoxGeometry(40, 40, 15);

        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                const manePart = new THREE.Mesh(maneGeom, this.redMat);
                manePart.position.x = (j * 40) - 60;
                manePart.position.y = (k * 40) - 60;

                // 确定振幅和偏移量
                let amp, zOffset;
                if ((j === 0 && k === 0) || (j === 0 && k === 3) || 
                    (j === 3 && k === 0) || (j === 3 && k === 3)) {
                    amp = -10 - Math.floor(Math.random() * 5);
                    zOffset = -5;
                } else if (j === 0 || k === 0 || j === 3 || k === 3) {
                    amp = -5 - Math.floor(Math.random() * 5);
                    zOffset = 0;
                } else {
                    amp = 0;
                    zOffset = 0;
                }

                // 保存鬃毛属性
                this.maneParts.push({
                    mesh: manePart,
                    amp: amp,
                    zOffset: zOffset,
                    periodOffset: Math.random() * Math.PI * 2,
                    xInit: manePart.position.x,
                    yInit: manePart.position.y
                });

                this.mane.add(manePart);
            }
        }

        this.head.add(this.mane);
    }

    createFaceDetails() {
        // 眼睛
        const eyeGeom = new THREE.BoxGeometry(5, 30, 30);
        this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.leftEye.position.set(40, 25, 120);
        this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.rightEye.position.set(-40, 25, 120);

        // 虹膜
        const irisGeom = new THREE.BoxGeometry(4, 10, 10);
        this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
        this.leftIris.position.set(42, 25, 120);
        this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
        this.rightIris.position.set(-42, 25, 120);

        // 嘴巴
        const mouthGeom = new THREE.BoxGeometry(20, 20, 10);
        this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
        this.mouth.position.set(0, -30, 171);
        this.mouth.scale.set(0.5, 0.5, 1);

        // 微笑（圆环）
        const smileGeom = new THREE.TorusGeometry(12, 4, 2, 10, Math.PI);
        this.smile = new THREE.Mesh(smileGeom, this.greyMat);
        this.smile.position.set(0, -15, 173);
        this.smile.rotation.z = -Math.PI;

        // 嘴唇
        const lipsGeom = new THREE.BoxGeometry(40, 15, 20);
        this.lips = new THREE.Mesh(lipsGeom, this.yellowMat);
        this.lips.position.set(0, -45, 165);

        // 斑点
        const spotGeom = new THREE.BoxGeometry(4, 4, 4);
        this.spot1 = new THREE.Mesh(spotGeom, this.redMat);
        this.spot1.position.set(39, 0, 150);
        this.spot2 = this.spot1.clone();
        this.spot2.position.set(39, -10, 160);
        this.spot3 = this.spot1.clone();
        this.spot3.position.set(39, -15, 140);
        this.spot4 = this.spot1.clone();
        this.spot4.position.set(39, -20, 150);
        this.spot5 = this.spot1.clone();
        this.spot5.position.set(-39, 0, 150);
        this.spot6 = this.spot2.clone();
        this.spot6.position.set(-39, -10, 160);
        this.spot7 = this.spot3.clone();
        this.spot7.position.set(-39, -15, 140);
        this.spot8 = this.spot4.clone();
        this.spot8.position.set(-39, -20, 150);

        // 胡须
        const mustacheGeom = new THREE.BoxGeometry(30, 2, 1);
        mustacheGeom.translate(15, 0, 0);

        this.mustache1 = new THREE.Mesh(mustacheGeom, this.greyMat);
        this.mustache1.position.set(30, -5, 175);
        this.mustache2 = this.mustache1.clone();
        this.mustache2.position.set(35, -12, 175);
        this.mustache3 = this.mustache1.clone();
        this.mustache3.position.set(30, -19, 175);
        this.mustache4 = this.mustache1.clone();
        this.mustache4.rotation.z = Math.PI;
        this.mustache4.position.set(-30, -5, 175);
        this.mustache5 = this.mustache2.clone();
        this.mustache5.rotation.z = Math.PI;
        this.mustache5.position.set(-35, -12, 175);
        this.mustache6 = this.mustache3.clone();
        this.mustache6.rotation.z = Math.PI;
        this.mustache6.position.set(-30, -19, 175);

        this.mustaches = [
            this.mustache1, this.mustache2, this.mustache3,
            this.mustache4, this.mustache5, this.mustache6
        ];

        // 添加到头部
        this.head.add(
            this.leftEye, this.rightEye, this.leftIris, this.rightIris,
            this.mouth, this.smile, this.lips,
            this.spot1, this.spot2, this.spot3, this.spot4,
            this.spot5, this.spot6, this.spot7, this.spot8,
            ...this.mustaches
        );
    }

    setupShadows() {
        this.threegroup.traverse(object => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    initTargetValues() {
        // 初始化动画目标值
        this.tHeagRotY = 0;
        this.tHeadRotX = 0;
        this.tHeadPosX = 0;
        this.tHeadPosY = 0;
        this.tHeadPosZ = 0;
        this.tEyeScale = 1;
        this.tIrisYScale = 1;
        this.tIrisZScale = 1;
        this.tIrisPosY = 25;
        this.tLeftIrisPosZ = 120;
        this.tRightIrisPosZ = 120;
        this.tRightKneeRotZ = 0.3;
        this.tLeftKneeRotZ = -0.3;
        this.tLipsPosX = 0;
        this.tLipsPosY = -45;
        this.tSmilePosX = 0;
        this.tMouthPosZ = 171;
        this.tSmilePosZ = 173;
        this.tSmilePosY = -15;
        this.tSmileRotZ = -Math.PI;
    }

    updateBody(speed) {
        // 更新头部位置和旋转
        this.head.rotation.y += (this.tHeagRotY - this.head.rotation.y) / speed;
        this.head.rotation.x += (this.tHeadRotX - this.head.rotation.x) / speed;
        this.head.position.x += (this.tHeadPosX - this.head.position.x) / speed;
        this.head.position.y += (this.tHeadPosY - this.head.position.y) / speed;
        this.head.position.z += (this.tHeadPosZ - this.head.position.z) / speed;

        // 更新眼睛
        this.leftEye.scale.y += (this.tEyeScale - this.leftEye.scale.y) / (speed * 2);
        this.rightEye.scale.y = this.leftEye.scale.y;

        // 更新虹膜
        this.leftIris.scale.y += (this.tIrisYScale - this.leftIris.scale.y) / (speed * 2);
        this.rightIris.scale.y = this.leftIris.scale.y;
        this.leftIris.scale.z += (this.tIrisZScale - this.leftIris.scale.z) / (speed * 2);
        this.rightIris.scale.z = this.leftIris.scale.z;

        this.leftIris.position.y += (this.tIrisPosY - this.leftIris.position.y) / speed;
        this.rightIris.position.y = this.leftIris.position.y;
        this.leftIris.position.z += (this.tLeftIrisPosZ - this.leftIris.position.z) / speed;
        this.rightIris.position.z += (this.tRightIrisPosZ - this.rightIris.position.z) / speed;

        // 更新膝盖
        this.rightKnee.rotation.z += (this.tRightKneeRotZ - this.rightKnee.rotation.z) / speed;
        this.leftKnee.rotation.z += (this.tLeftKneeRotZ - this.leftKnee.rotation.z) / speed;

        // 更新嘴巴和微笑
        this.lips.position.x += (this.tLipsPosX - this.lips.position.x) / speed;
        this.lips.position.y += (this.tLipsPosY - this.lips.position.y) / speed;
        this.smile.position.x += (this.tSmilePosX - this.smile.position.x) / speed;
        this.mouth.position.z += (this.tMouthPosZ - this.mouth.position.z) / speed;
        this.smile.position.z += (this.tSmilePosZ - this.smile.position.z) / speed;
        this.smile.position.y += (this.tSmilePosY - this.smile.position.y) / speed;
        this.smile.rotation.z += (this.tSmileRotZ - this.smile.rotation.z) / speed;

        // BufferGeometry 顶点动画
        var position = this.body.geometry.attributes.position;
        for (var i=0; i<this.bodyVertices.length; i++) {
            var tvInit = this.bodyInitPositions[i];
            var idx = this.bodyVertices[i];
            position.setX(idx, tvInit.x + this.head.position.x);
        }
        position.needsUpdate = true;
    }

    look(xTarget, yTarget) {
        // 设置看向目标时的动画目标值
        this.tHeagRotY = this.rule3(xTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
        this.tHeadRotX = this.rule3(yTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
        this.tHeadPosX = this.rule3(xTarget, -200, 200, 70, -70);
        this.tHeadPosY = this.rule3(yTarget, -140, 260, 20, 100);
        this.tHeadPosZ = 0;

        this.tEyeScale = 1;
        this.tIrisYScale = 1;
        this.tIrisZScale = 1;
        this.tIrisPosY = this.rule3(yTarget, -200, 200, 35, 15);
        this.tLeftIrisPosZ = this.rule3(xTarget, -200, 200, 130, 110);
        this.tRightIrisPosZ = this.rule3(xTarget, -200, 200, 110, 130);

        this.tLipsPosX = 0;
        this.tLipsPosY = -45;

        this.tSmilePosX = 0;
        this.tMouthPosZ = 174;
        this.tSmilePosZ = 173;
        this.tSmilePosY = -15;
        this.tSmileRotZ = -Math.PI;

        this.tRightKneeRotZ = this.rule3(xTarget, -200, 200, 0.3 - Math.PI / 8, 0.3 + Math.PI / 8);
        this.tLeftKneeRotZ = this.rule3(xTarget, -200, 200, -0.3 - Math.PI / 8, -0.3 + Math.PI / 8);

        this.updateBody(10);

        // 重置鬃毛和胡须
        this.mane.rotation.y = 0;
        this.mane.rotation.x = 0;

        for (let i = 0; i < this.maneParts.length; i++) {
            const m = this.maneParts[i].mesh;
            m.position.z = 0;
            m.rotation.y = 0;
        }

        for (let i = 0; i < this.mustaches.length; i++) {
            const m = this.mustaches[i];
            m.rotation.y = 0;
        }
    }

    cool(xTarget, yTarget, deltaTime) {
        // 设置风吹效果时的动画目标值
        this.tHeagRotY = this.rule3(xTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
        this.tHeadRotX = this.rule3(yTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
        this.tHeadPosX = this.rule3(xTarget, -200, 200, -70, 70);
        this.tHeadPosY = this.rule3(yTarget, -140, 260, 100, 20);
        this.tHeadPosZ = 100;

        this.tEyeScale = 0.1;
        this.tIrisYScale = 0.1;
        this.tIrisZScale = 3;

        this.tIrisPosY = 20;
        this.tLeftIrisPosZ = 120;
        this.tRightIrisPosZ = 120;

        this.tLipsPosX = this.rule3(xTarget, -200, 200, -15, 15);
        this.tLipsPosY = this.rule3(yTarget, -200, 200, -45, -40);

        this.tMouthPosZ = 168;
        this.tSmilePosX = this.rule3(xTarget, -200, 200, -15, 15);
        this.tSmilePosY = this.rule3(yTarget, -200, 200, -20, -8);
        this.tSmilePosZ = 176;
        this.tSmileRotZ = this.rule3(xTarget, -200, 200, -Math.PI - 0.3, -Math.PI + 0.3);

        this.tRightKneeRotZ = this.rule3(xTarget, -200, 200, 0.3 + Math.PI / 8, 0.3 - Math.PI / 8);
        this.tLeftKneeRotZ = this.rule3(xTarget, -200, 200, -0.3 + Math.PI / 8, -0.3 - Math.PI / 8);

        this.updateBody(10);

        // 鬃毛随风摆动
        this.mane.rotation.y = -0.8 * this.head.rotation.y;
        this.mane.rotation.x = -0.8 * this.head.rotation.x;

        const dist = Math.sqrt(xTarget * xTarget + yTarget * yTarget);
        let dt = 20000 / (dist * dist);
        dt = Math.max(Math.min(dt, 1), 0.5);
        this.windTime += dt * deltaTime * 40;

        for (let i = 0; i < this.maneParts.length; i++) {
            const m = this.maneParts[i];
            m.mesh.position.z = m.zOffset + Math.sin(this.windTime + m.periodOffset) * m.amp * dt * 2;
        }

        // 耳朵摆动
        this.leftEar.rotation.x = Math.cos(this.windTime) * Math.PI / 16 * dt;
        this.rightEar.rotation.x = -Math.cos(this.windTime) * Math.PI / 16 * dt;

        // 胡须摆动
        for (let i = 0; i < this.mustaches.length; i++) {
            const m = this.mustaches[i];
            const amp = i < 3 ? -Math.PI / 8 : Math.PI / 8;
            m.rotation.y = amp + Math.cos(this.windTime + i) * dt * amp;
        }
    }

    rule3(v, vmin, vmax, tmin, tmax) {
        const nv = Math.max(Math.min(v, vmax), vmin);
        const dv = vmax - vmin;
        const pc = (nv - vmin) / dv;
        const dt = tmax - tmin;
        return tmin + pc * dt;
    }
}