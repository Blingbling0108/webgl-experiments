// src/objects/Tree.js
import * as THREE from 'three';

export default class Tree {
  constructor({ position = new THREE.Vector3(0, 0, 0), scale = 1 } = {}) {
    // 颜色池
    const leafColors = [0x91E56E, 0xA2FF7A, 0x71B356, 0xB2FFB2, 0x6EDB91, 0xC2FFB2, 0xA2E5A2];
    const stemColors = [0x7D5A4F, 0xA67C52, 0x8B5A2B, 0xB97A56];
    // 统一几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 随机材质
    const leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: leafColors[Math.floor(Math.random() * leafColors.length)] });
    const leaveLightMaterial = new THREE.MeshLambertMaterial({ color: leafColors[Math.floor(Math.random() * leafColors.length)] });
    const leaveDarkDarkMaterial = new THREE.MeshLambertMaterial({ color: leafColors[Math.floor(Math.random() * leafColors.length)] });
    const stemMaterial = new THREE.MeshLambertMaterial({ color: stemColors[Math.floor(Math.random() * stemColors.length)] });

    // 树干
    const stem = new THREE.Mesh(geometry, stemMaterial);
    stem.position.set(0, 0, 0);
    stem.scale.set(
      0.25 + Math.random() * 0.15,
      1.2 + Math.random() * 0.7,
      0.25 + Math.random() * 0.15
    );

    // 叶子
    const squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave01.position.set(0.5, 1.6, 0.5);
    squareLeave01.scale.set(
      0.7 + Math.random() * 0.4,
      0.7 + Math.random() * 0.4,
      0.7 + Math.random() * 0.4
    );

    const squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave02.position.set(-0.4, 1.3, -0.4);
    squareLeave02.scale.set(
      0.6 + Math.random() * 0.3,
      0.6 + Math.random() * 0.3,
      0.6 + Math.random() * 0.3
    );

    const squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave03.position.set(0.4, 1.7, -0.5);
    squareLeave03.scale.set(
      0.6 + Math.random() * 0.3,
      0.6 + Math.random() * 0.3,
      0.6 + Math.random() * 0.3
    );

    const leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial);
    leaveDark.position.set(0, 1.2, 0);
    leaveDark.scale.set(
      0.9 + Math.random() * 0.3,
      1.7 + Math.random() * 0.5,
      0.9 + Math.random() * 0.3
    );

    const leaveLight = new THREE.Mesh(geometry, leaveLightMaterial);
    leaveLight.position.set(0, 1.2, 0);
    leaveLight.scale.set(
      1.0 + Math.random() * 0.3,
      0.4 + Math.random() * 0.2,
      1.0 + Math.random() * 0.3
    );

    // 地面（可选）
    const ground = new THREE.Mesh(geometry, leaveDarkDarkMaterial);
    ground.position.set(0, -1, 0);
    ground.scale.set(
      2.0 + Math.random() * 0.7,
      0.7 + Math.random() * 0.2,
      2.0 + Math.random() * 0.7
    );

    // 组合
    this.group = new THREE.Group();
    this.group.add(leaveDark);
    this.group.add(leaveLight);
    this.group.add(squareLeave01);
    this.group.add(squareLeave02);
    this.group.add(squareLeave03);
    this.group.add(ground);
    this.group.add(stem);

    // 随机微调旋转
    this.group.rotation.y = Math.random() * Math.PI * 2;
    this.group.rotation.x = Math.random() * 0.2 - 0.1;
    // 支持外部缩放和位置
    this.group.position.copy(position);
    this.group.scale.setScalar(scale);
  }
}