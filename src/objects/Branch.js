// src/objects/Branch.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import { rangeRandom } from '../utils/math.js';
import Foliage from './Foliage.js';

/**
 * 树枝类 - 用于创建3D树枝对象
 * 可以生成简单的树枝或带有树叶的复杂树枝
 */
export default class Branch {
  /**
   * 构造函数
   * @param {number} height - 树枝长度
   * @param {number} thickness - 树枝半径
   * @param {THREE.Color} trunkColor - 树枝颜色，默认为灰色
   * @param {Array} colorPalette - 树叶颜色调色板
   * @param {boolean} complex - 是否为复杂树枝（带树叶）
   */
  constructor(height, thickness, trunkColor, colorPalette, complex = false) {
    // 树枝基本参数
    this.length = height;
    this.radius = thickness;
    
    // 创建树枝几何体 - 使用圆柱体，顶部半径略小于底部
    const geometry = new THREE.CylinderGeometry(
      this.radius,           // 顶部半径
      this.radius * 0.7,     // 底部半径（略小，模拟树枝粗细变化）
      this.length,           // 高度
      8                      // 圆周分段数
    );
    
    // 创建树枝材质 - 使用标准材质模拟木质效果
    const material = new THREE.MeshStandardMaterial({
      color: trunkColor || Colors.grey_d,  // 树枝颜色，默认灰色
      roughness: 0.8,                      // 粗糙度，模拟木质表面
      metalness: 0.1,                      // 金属度，木质较低
      flatShading: true                    // 平面着色，增加几何感
    });
    
    // 创建树枝网格对象
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2;    // 旋转90度，使树枝水平放置
    
    // 添加用户数据，便于后续识别和管理
    this.mesh.userData = { 
      type: 'branch', 
      length: this.length 
    };
    
    // 添加随机弯曲效果，使树枝更自然
    this.mesh.rotation.z = rangeRandom(-0.2, 0.2);  // Z轴随机旋转
    this.mesh.rotation.y = rangeRandom(-0.2, 0.2);  // Y轴随机旋转
    
    // 如果是复杂树枝且提供了颜色调色板，则添加树叶
    if (complex && colorPalette) {
      this.addFoliage(colorPalette);
    }
  }
  
  /**
   * 为树枝添加树叶
   * @param {Array} colorPalette - 树叶颜色调色板
   */
  addFoliage(colorPalette) {
    // 随机生成1-3个树叶
    const foliageCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < foliageCount; i++) {
      // 树叶大小基于树枝半径，随机变化
      const foliageSize = this.radius * (0.5 + Math.random() * 0.5);
      // 从调色板中随机选择颜色创建树叶
      const foliage = new Foliage(foliageSize, Colors.getRandomFrom(colorPalette));
      
      // 计算树叶在树枝上的位置，均匀分布
      const position = (i / foliageCount) * this.length - this.length / 2;
      foliage.mesh.position.set(position, 0, 0);
      
      // 将树叶添加到树枝网格中
      this.mesh.add(foliage.mesh);
    }
  }
}