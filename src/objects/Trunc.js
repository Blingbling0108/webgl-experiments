// src/objects/Trunc.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import { rangeRandom, rangeRandomInt } from '../utils/math.js';
import Branch from './Branch.js';
import Foliage from './Foliage.js';

export default class Trunc {
  constructor(complex = false) {
    this.type = "trunc";
    this.pointsTrunc = [];
    
    // 参数设置
    this.truncColor = complex ? Colors.grey_d : Colors.getRandomFrom(Colors.trunc);
    this.truncHeight = complex ? 100 : rangeRandom(70, 100);
    this.truncStartRadius = complex ? 4 : rangeRandom(2, 4);
    this.verticalSegments = complex ? rangeRandomInt(9, 12) : rangeRandomInt(3, 5);
    this.radiusSegments = complex ? rangeRandomInt(6, 10) : rangeRandomInt(4, 6);
    this.shapeAngleStart = rangeRandom(Math.PI/4, Math.PI/2);
    this.shapeAmplitude = rangeRandom(this.truncStartRadius/4, this.truncStartRadius*6);
    this.noise = complex ? 0.5 : rangeRandom(this.truncStartRadius/8, this.truncStartRadius/4);
    this.foliageDensity = complex ? 5 : 2;
    
    // 构建树干几何体
    this.shapeAngle = Math.PI - this.shapeAngleStart;
    this.freq = this.shapeAngle / this.verticalSegments;
    this.segHeight = this.truncHeight / this.verticalSegments;
    
    this.pointsTrunc.push(new THREE.Vector3(0, 0, 0));
    
    for (let i = 0; i < this.verticalSegments; i++) {
      const tx = Math.sin(this.shapeAngleStart + (i * this.freq)) * this.shapeAmplitude + this.truncStartRadius;
      const ty = i * this.segHeight;
      this.pointsTrunc.push(new THREE.Vector3(tx, ty, 0));
    }
    
    this.pointsTrunc.push(new THREE.Vector3(0, this.truncHeight, 0));
    
    // 创建树干网格
    this.mesh = this.createLatheMesh(this.pointsTrunc, this.radiusSegments, this.truncColor);
    
    // 添加附着点（树枝、树叶等）
    this.addAttachments(complex);
    
    // 添加噪声使树干更自然
    if (this.noise) {
      this.makeNoise(this.mesh.geometry, this.noise);
    }
  }
  
  createLatheMesh(points, segments, color) {
    const geometry = new THREE.LatheGeometry(points, segments);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });
    return new THREE.Mesh(geometry, material);
  }
  
  makeNoise(geometry, intensity) {
    const position = geometry.attributes.position;
    const vertices = [];
    
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
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
  }
  
  addAttachments(complex) {
    const defAttachs = complex ? this.getComplexAttachments() : this.getSimpleAttachments();
    this.attachsVerts = this.getAttachs(this.mesh.geometry, defAttachs);
    this.verticesNormals = this.getVerticesNormals(this.mesh.geometry);
    
    const colorFoliagePalette = complex ? Colors.pinks : Colors.getRandomFrom([Colors.pinks, Colors.yellows, Colors.greens, Colors.purples]);
    
    for (let i = 0; i < this.attachsVerts.length; i++) {
      const attDef = this.attachsVerts[i];
      const v = this.mesh.geometry.attributes.position.array.slice(attDef.index * 3, attDef.index * 3 + 3);
      const vertex = new THREE.Vector3(v[0], v[1], v[2]);
      
      let attachment;
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
      
      attachment.position.copy(vertex);
      this.mesh.add(attachment);
    }
  }
  
  getAttachs(geometry, definitions) {
    const attachs = [];
    const vertexCount = geometry.attributes.position.count;
    
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
  
  getVerticesNormals(geometry) {
    const normals = [];
    geometry.computeVertexNormals();
    
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const normal = new THREE.Vector3();
      normal.fromBufferAttribute(geometry.attributes.normal, i);
      normals.push(normal);
    }
    
    return normals;
  }
  
  createElbowBranch(v, colorPalette, complex) {
    const r = rangeRandom(this.truncHeight * 0.05, this.truncHeight * 0.15);
    const th = rangeRandom(this.truncStartRadius * 40/(1+v.y), this.truncStartRadius * 60/(1+v.y));
    return new Branch(r, th, this.truncColor, colorPalette, complex).mesh;
  }
  
  createBranch(v, colorPalette, complex) {
    const s = rangeRandom(this.truncHeight * 0.03, this.truncHeight * 0.06);
    const th = rangeRandom(this.truncStartRadius * 0.2, this.truncStartRadius * 0.4);
    return new Branch(s, th, this.truncColor, colorPalette, complex).mesh;
  }
  
  createLeaf(v) {
    const scale = rangeRandom(1, 2);
    return new Foliage(scale, Colors.green_d).mesh;
  }
  
  createFruit(v) {
    const scale = rangeRandom(2, 4);
    return new Foliage(scale, Colors.red_d).mesh;
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