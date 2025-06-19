import * as THREE from 'three';
import { Colors } from '../utils/colors.js';

export default class Bird {
  constructor() {
    this.rSegments = 4;
    this.hSegments = 3;
    this.shyAngles = { h: 0, v: 0 };
    this.color = { r: 1, g: 222 / 255, b: 121 / 255 }; // 默认黄色
    this.intervalRunning = false;
    this.behaviourInterval = null;
    this.normalSkin = { r: 1, g: 222 / 255, b: 121 / 255 };
    this.shySkin = { r: 1, g: 157 / 255, b: 101 / 255 };

    this.group = new THREE.Group();
    this.yellowMat = new THREE.MeshLambertMaterial({ color: Colors.birdYellow, flatShading: true });
    this.whiteMat = new THREE.MeshLambertMaterial({ color: Colors.birdWhite, flatShading: true });
    this.blackMat = new THREE.MeshLambertMaterial({ color: Colors.birdBlack, flatShading: true });
    this.orangeMat = new THREE.MeshLambertMaterial({ color: Colors.birdOrange, flatShading: true });

    // 身体
    const bodyGeom = new THREE.CylinderGeometry(40, 70, 200, this.rSegments, this.hSegments);
    this.bodyBird = new THREE.Mesh(bodyGeom, this.yellowMat);
    this.bodyBird.position.y = 70;
    this.group.add(this.bodyBird);

    // 翅膀
    const wingGeom = new THREE.BoxGeometry(60, 60, 5);
    const wingLeftGroup = new THREE.Group();
    const wingLeft = new THREE.Mesh(wingGeom, this.yellowMat);
    wingLeftGroup.add(wingLeft);
    wingLeftGroup.position.x = 70;
    wingLeftGroup.rotation.y = Math.PI / 2;
    wingLeft.rotation.x = -Math.PI / 4;
    const wingRightGroup = new THREE.Group();
    const wingRight = new THREE.Mesh(wingGeom, this.yellowMat);
    wingRightGroup.add(wingRight);
    wingRightGroup.position.x = -70;
    wingRightGroup.rotation.y = -Math.PI / 2;
    wingRight.rotation.x = -Math.PI / 4;
    this.group.add(wingLeftGroup);
    this.group.add(wingRightGroup);

    // 面部
    const face = new THREE.Group();
    const eyeGeom = new THREE.BoxGeometry(60, 60, 10);
    const irisGeom = new THREE.BoxGeometry(10, 10, 10);
    this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.leftEye.position.set(-30, 120, 35);
    this.leftEye.rotation.y = -Math.PI / 4;
    this.leftIris = new THREE.Mesh(irisGeom, this.blackMat);
    this.leftIris.position.set(-30, 120, 40);
    this.leftIris.rotation.y = -Math.PI / 4;
    this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.rightEye.position.set(30, 120, 35);
    this.rightEye.rotation.y = Math.PI / 4;
    this.rightIris = new THREE.Mesh(irisGeom, this.blackMat);
    this.rightIris.position.set(30, 120, 40);
    this.rightIris.rotation.y = Math.PI / 4;
    // 鸟喙
    const beakGeom = new THREE.CylinderGeometry(0, 20, 20, 4, 1);
    this.beak = new THREE.Mesh(beakGeom, this.orangeMat);
    this.beak.position.set(0, 70, 65);
    this.beak.rotation.x = Math.PI / 2;
    // 羽毛
    const featherGeom = new THREE.BoxGeometry(10, 20, 5);
    this.feather1 = new THREE.Mesh(featherGeom, this.yellowMat);
    this.feather1.position.set(0, 185, 55);
    this.feather1.rotation.x = Math.PI / 4;
    this.feather1.scale.set(1.5, 1.5, 1);
    this.feather2 = new THREE.Mesh(featherGeom, this.yellowMat);
    this.feather2.position.set(20, 180, 50);
    this.feather2.rotation.x = Math.PI / 4;
    this.feather2.rotation.z = -Math.PI / 8;
    this.feather3 = new THREE.Mesh(featherGeom, this.yellowMat);
    this.feather3.position.set(-20, 180, 50);
    this.feather3.rotation.x = Math.PI / 4;
    this.feather3.rotation.z = Math.PI / 8;
    face.add(this.leftEye, this.leftIris, this.rightEye, this.rightIris, this.beak, this.feather1, this.feather2, this.feather3);
    this.group.add(face);
    this.face = face;

    // 阴影
    this.bodyBird.castShadow = true;
    this.bodyBird.receiveShadow = true;
    // this.group.traverse(obj => {
    //   if (obj instanceof THREE.Mesh) {
    //     obj.castShadow = true;
    //     obj.receiveShadow = true;
    //   }
    // });
    // 缩放和位置调整
    this.group.scale.set(1 / 3, 1 / 3, 1 / 3);
    this.group.position.x = 200;
    this.group.position.y = -110;
  }

  look(h, v) {
    // 缓动，丝滑
    this.shyAngles.h += (h - this.shyAngles.h) * 0.08;
    this.shyAngles.v += (v - this.shyAngles.v) * 0.08;
    this.hAngle = this.shyAngles.h;
    this.vAngle = this.shyAngles.v;
    // 分层顶点动画：底部不动，头部最大扭动
    for (let i = 0; i < this.bodyVerticesLength; i++) {
      let line = Math.floor(i / (this.rSegments + 1));
      let tv = this.bodyBird.geometry.vertices[i];
      let tvInitPos = this.bodyBirdInitPositions[i];
      let t = 1 - line / (this.hSegments - 1); // 头部t=1，底部t=0
      let a = this.hAngle * t;
      tv.x = tvInitPos.x * Math.cos(a) + tvInitPos.z * Math.sin(a);
      tv.z = -tvInitPos.x * Math.sin(a) + tvInitPos.z * Math.cos(a);
    }
    this.bodyBird.geometry.verticesNeedUpdate = true;
    // 眼睛虹膜缓动
    if (!this.irisTarget) this.irisTarget = {lx: this.leftIris.position.x, ly: this.leftIris.position.y, lz: this.leftIris.position.z, rx: this.rightIris.position.x, ry: this.rightIris.position.y, rz: this.rightIris.position.z};
    // 目标位置
    const lTarget = {
      x: -30 + this.hAngle * 18,
      y: 120 - this.vAngle * 30,
      z: 40 + this.hAngle * 18
    };
    const rTarget = {
      x: 30 + this.hAngle * 18,
      y: 120 - this.vAngle * 30,
      z: 40 - this.hAngle * 18
    };
    // 缓动插值
    this.irisTarget.lx += (lTarget.x - this.irisTarget.lx) * 0.18;
    this.irisTarget.ly += (lTarget.y - this.irisTarget.ly) * 0.18;
    this.irisTarget.lz += (lTarget.z - this.irisTarget.lz) * 0.18;
    this.irisTarget.rx += (rTarget.x - this.irisTarget.rx) * 0.18;
    this.irisTarget.ry += (rTarget.y - this.irisTarget.ry) * 0.18;
    this.irisTarget.rz += (rTarget.z - this.irisTarget.rz) * 0.18;
    this.leftIris.position.set(this.irisTarget.lx, this.irisTarget.ly, this.irisTarget.lz);
    this.rightIris.position.set(this.irisTarget.rx, this.irisTarget.ry, this.irisTarget.rz);
    // 其他部件联动
    this.leftEye.position.y = this.rightEye.position.y = 120 - this.vAngle * 10;
    this.beak.position.y = 70 - this.vAngle * 20;
    this.beak.rotation.x = Math.PI / 2 + this.vAngle / 3;
    this.feather1.rotation.x = Math.PI / 4 + this.vAngle / 2;
    this.feather1.position.y = 185 - this.vAngle * 10;
    this.feather1.position.z = 55 + this.vAngle * 10;
    this.feather2.rotation.x = Math.PI / 4 + this.vAngle / 2;
    this.feather2.position.y = 180 - this.vAngle * 10;
    this.feather2.position.z = 50 + this.vAngle * 10;
    this.feather3.rotation.x = Math.PI / 4 + this.vAngle / 2;
    this.feather3.position.y = 180 - this.vAngle * 10;
    this.feather3.position.z = 50 + this.vAngle * 10;
    this.face.rotation.y = this.hAngle;
  }

  lookAway(fast) {
    // 害羞动画，快速或缓慢转头，变色
    const speed = fast ? 0.4 : 2;
    const shyH = -Math.PI / 3 + Math.random() * 0.2; // 向左快速转头
    const shyV = -0.5 + Math.random() * 0.2;
    this.targetColor = this.shySkin;
    this.animateColor(this.shySkin, speed);
    this.shyAngles.h = shyH;
    this.shyAngles.v = shyV;
  }

  stare() {
    // 恢复正常，慢慢转回正面
    this.targetColor = this.normalSkin;
    this.animateColor(this.normalSkin, 2);
    this.shyAngles.h = 0;
    this.shyAngles.v = 0;
  }

  animateColor(target, speed) {
    // 颜色渐变动画
    this.color.r += (target.r - this.color.r) * 0.1 * speed;
    this.color.g += (target.g - this.color.g) * 0.1 * speed;
    this.color.b += (target.b - this.color.b) * 0.1 * speed;
    this.bodyBird.material.color.setRGB(this.color.r, this.color.g, this.color.b);
  }
} 