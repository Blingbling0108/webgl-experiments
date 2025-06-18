// src/objects/Trunc.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import { rangeRandom, rangeRandomInt } from '../utils/math.js';
import Branch from './Branch.js';
import Foliage from './Foliage.js';

/**
 * 树干类 - 用于创建3D树干对象
 * 可以生成简单或复杂的树干，包含树枝、树叶、果实等附着物
 */
export default class Trunc {
  /**
   * 构造函数
   * @param {boolean} complex - 是否为复杂树干（更多细节和附着物）
   * @param {object} options - 可选参数
   */
  constructor(complex = false, options = {}) {
    this.type = "trunc";
    this.pointsTrunc = []; // 存储树干轮廓点
    this.trunkScale = options.trunkScale || { min: 0.5, max: 0.5 };
    this.foliageScale = options.foliageScale || { min: 0.5, max: 0.5 };
    this.branchScale = options.branchScale || { min: 0.5, max: 0.5 };
    
    // 树干基本参数设置
    this.truncColor = complex ? Colors.grey_d : Colors.getRandomFrom(Colors.trunc); // 树干颜色
    this.truncHeight = (complex ? 100 : rangeRandom(70, 100)) * this.randomInRange(this.trunkScale); // 树干高度
    this.truncStartRadius = (complex ? 4 : rangeRandom(2, 4)) * this.randomInRange(this.trunkScale); // 树干起始半径
    this.verticalSegments = complex ? rangeRandomInt(9, 12) : rangeRandomInt(3, 5); // 垂直分段数
    this.radiusSegments = complex ? rangeRandomInt(6, 10) : rangeRandomInt(4, 6); // 半径分段数
    
    // 树干形状参数
    this.shapeAngleStart = rangeRandom(Math.PI/4, Math.PI/2); // 形状角度起始值
    this.shapeAmplitude = rangeRandom(this.truncStartRadius/4, this.truncStartRadius*6); // 形状振幅
    this.noise = complex ? 0.5 : rangeRandom(this.truncStartRadius/8, this.truncStartRadius/4); // 噪声强度
    this.foliageDensity = complex ? 5 : 2; // 树叶密度
    
    // 构建树干几何体参数
    this.shapeAngle = Math.PI - this.shapeAngleStart; // 形状角度范围
    this.freq = this.shapeAngle / this.verticalSegments; // 频率
    this.segHeight = this.truncHeight / this.verticalSegments; // 每段高度
    
    // 添加树干底部点
    this.pointsTrunc.push(new THREE.Vector3(0, 0, 0));
    
    // 优化树干轮廓点生成：更接近圆柱体，顶部略细，带微小扰动
    for (let i = 1; i < this.verticalSegments; i++) {
      const ty = i * this.segHeight;
      // 顶部略细，带微小扰动
      const radius = this.truncStartRadius * (1 - i / this.verticalSegments * 0.3) + rangeRandom(-0.2, 0.2);
      this.pointsTrunc.push(new THREE.Vector3(radius, ty, 0));
    }
    this.pointsTrunc.push(new THREE.Vector3(0, this.truncHeight, 0));
    
    // 创建树干网格
    this.mesh = this.createLatheMesh(this.pointsTrunc, this.radiusSegments, this.truncColor);
    
    // 添加附着点（树枝、树叶等）
    this.addAttachments(complex);
    
    // 添加噪声使树干表面更自然
    if (this.noise) {
      this.makeNoise(this.mesh.geometry, this.noise);
    }
  }
  
  /**
   * 创建车削几何体网格
   * @param {Array} points - 轮廓点数组
   * @param {number} segments - 分段数
   * @param {THREE.Color} color - 材质颜色
   * @returns {THREE.Mesh} 树干网格对象
   */
  createLatheMesh(points, segments, color) {
    const geometry = new THREE.LatheGeometry(points, segments);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8, // 粗糙度，模拟木质表面
      metalness: 0.1, // 金属度，木质较低
      flatShading: true // 平面着色，增加几何感
    });
    return new THREE.Mesh(geometry, material);
  }
  
  /**
   * 为几何体添加噪声，使表面更自然
   * @param {THREE.Geometry} geometry - 几何体对象
   * @param {number} intensity - 噪声强度
   */
  makeNoise(geometry, intensity) {
    const position = geometry.attributes.position;
    const vertices = [];
    
    // 遍历所有顶点，添加随机偏移
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      
      vertices.push(
        x + (Math.random() - 0.5) * intensity,
        y + (Math.random() - 0.5) * intensity,
        z + (Math.random() - 0.5) * intensity
      );
    }
    
    // 更新几何体顶点位置并重新计算法线
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
  }
  
  /**
   * 添加附着物（树枝、树叶、果实等）
   * @param {boolean} complex - 是否为复杂模式
   */
  addAttachments(complex) {
    // 获取附着物定义
    const defAttachs = complex ? this.getComplexAttachments() : this.getSimpleAttachments();
    this.attachsVerts = this.getAttachs(this.mesh.geometry, defAttachs);
    this.verticesNormals = this.getVerticesNormals(this.mesh.geometry);
    
    // 选择树叶颜色调色板
    const colorFoliagePalette = complex ? Colors.pinks : Colors.getRandomFrom([Colors.pinks, Colors.yellows, Colors.greens, Colors.purples]);
    
    // 为每个附着点创建对应的附着物
    for (let i = 0; i < this.attachsVerts.length; i++) {
      const attDef = this.attachsVerts[i];
      const v = this.mesh.geometry.attributes.position.array.slice(attDef.index * 3, attDef.index * 3 + 3);
      const vertex = new THREE.Vector3(v[0], v[1], v[2]);
      
      let attachment;
      // 根据类型创建不同的附着物
      switch(attDef.type) {
        case "elbowBranch":
          attachment = this.createElbowBranch(vertex, colorFoliagePalette, complex);
          break;
        case "branch":
          attachment = this.createBranch(vertex, colorFoliagePalette, complex);
          break;
        case "leaf":
          attachment = this.createLeaf(vertex);
          break;
        case "fruit":
          attachment = this.createFruit(vertex);
          break;
      }
      
      // 将附着物添加到树干上
      attachment.position.copy(vertex);
      this.mesh.add(attachment);
    }
  }
  
  /**
   * 获取几何体上的附着点
   * @param {THREE.Geometry} geometry - 几何体对象
   * @param {Array} definitions - 附着物定义数组
   * @returns {Array} 附着点数组
   */
  getAttachs(geometry, definitions) {
    const attachs = [];
    const vertexCount = geometry.attributes.position.count;
    
    // 根据定义创建附着点
    definitions.forEach(def => {
      for (let i = 0; i < def.count; i++) {
        const randomIndex = Math.floor(Math.random() * vertexCount);
        attachs.push({
          index: randomIndex,
          type: def.type,
          mesh: null
        });
      }
    });
    
    return attachs;
  }
  randomInRange(range) {
    return range.min + Math.random() * (range.max - range.min);
  }
  /**
   * 获取几何体所有顶点的法线
   * @param {THREE.Geometry} geometry - 几何体对象
   * @returns {Array} 法线向量数组
   */
  getVerticesNormals(geometry) {
    const normals = [];
    geometry.computeVertexNormals();
    
    // 提取每个顶点的法线
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const normal = new THREE.Vector3();
      normal.fromBufferAttribute(geometry.attributes.normal, i);
      normals.push(normal);
    }
    
    return normals;
  }
  
  /**
   * 创建肘形树枝
   * @param {THREE.Vector3} v - 顶点位置
   * @param {Array} colorPalette - 颜色调色板
   * @param {boolean} complex - 是否为复杂模式
   * @returns {THREE.Mesh} 树枝网格对象
   */
  createElbowBranch(v, colorPalette, complex) {
    const r = rangeRandom(this.truncHeight * 0.05, this.truncHeight * 0.15) * this.randomInRange(this.branchScale);
    const th = rangeRandom(this.truncStartRadius * 40/(1+v.y), this.truncStartRadius * 60/(1+v.y)) * this.randomInRange(this.branchScale);
    return new Branch(r, th, this.truncColor, colorPalette, complex).mesh;
  }
  
  createBranch(v, colorPalette, complex) {
    const s = rangeRandom(this.truncHeight * 0.03, this.truncHeight * 0.06) * this.randomInRange(this.branchScale);
    const th = rangeRandom(this.truncStartRadius * 0.2, this.truncStartRadius * 0.4) * this.randomInRange(this.branchScale);
    return new Branch(s, th, this.truncColor, colorPalette, complex).mesh;
  }
  
  // 优化树叶和果实分布：均匀分布在树干顶部球面
  createLeaf(v) {
    const base = Math.min(this.truncHeight, this.truncStartRadius * 8);
    const scale = rangeRandom(0.15, 0.25) * this.randomInRange(this.foliageScale);
    // 均匀分布在球面
    const phi = Math.acos(2 * Math.random() - 1); // [0, pi]
    const theta = Math.random() * Math.PI * 2;    // [0, 2pi]
    const r = base * 0.5;
    const pos = new THREE.Vector3().setFromSphericalCoords(r, phi, theta);
    const leaf = new Foliage(base * scale, Colors.green_d).mesh;
    leaf.position.copy(pos.add(new THREE.Vector3(0, this.truncHeight, 0)));
    return leaf;
  }
  
  createFruit(v) {
    const base = Math.min(this.truncHeight, this.truncStartRadius * 8);
    const scale = rangeRandom(0.10, 0.18) * this.randomInRange(this.foliageScale);
    // 均匀分布在球面
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = base * 0.5;
    const pos = new THREE.Vector3().setFromSphericalCoords(r, phi, theta);
    const fruit = new Foliage(base * scale, Colors.red_d).mesh;
    fruit.position.copy(pos.add(new THREE.Vector3(0, this.truncHeight, 0)));
    return fruit;
  }
  
  getComplexAttachments() {
    return [
      { type: "elbowBranch", count: 5, minH: this.truncHeight * 0.75, maxH: this.truncHeight * 0.95 },
      { type: "branch", count: 1, minH: this.truncHeight * 0.45, maxH: this.truncHeight * 0.75 },
      { type: "leaf", count: 5, minH: this.truncHeight * 0.30, maxH: this.truncHeight * 0.90 },
      { type: "fruit", count: 4, minH: this.truncHeight * 0.30, maxH: this.truncHeight * 0.80 }
    ];
  }
  
  getSimpleAttachments() {
    return [
      { type: "elbowBranch", count: 1, minH: this.truncHeight * 0.75, maxH: this.truncHeight * 0.9 },
      { type: "branch", count: 1, minH: this.truncHeight * 0.45, maxH: this.truncHeight * 0.7 },
      { type: "fruit", count: 2, minH: this.truncHeight * 0.30, maxH: this.truncHeight * 0.80 }
    ];
  }
}