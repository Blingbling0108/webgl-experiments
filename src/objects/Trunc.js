// src/objects/Trunc.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import Math2 from '../utils/math.js';
import GeometryHelpers from '../utils/helpers.js';
import CustomMesh from '../utils/CustomMesh.js';
import Branch from './Branch.js';
import Foliage from './Foliage.js';

export default class Trunc {
  constructor(complex) {
    this.type = "trunc";
    this.pointsTrunc = [];
    
    // 参数设置
    this.truncColor = complex ? Colors.grey_d : Colors.getRandomFrom(Colors.trunc);
    this.truncHeight = complex ? 100 : Math2.rangeRandom(70, 100);
    this.truncStartRadius = complex ? 4 : Math2.rangeRandom(2, 4);
    this.verticalSegments = complex ? Math2.rangeRandomInt(9, 12) : Math2.rangeRandomInt(3, 5);
    this.radiusSegments = complex ? Math2.rangeRandomInt(6, 10) : Math2.rangeRandomInt(4, 6);
    this.shapeAngleStart = Math2.rangeRandom(Math.PI/4, Math.PI/2);
    this.shapeAmplitude = Math2.rangeRandom(this.truncStartRadius/4, this.truncStartRadius*6);
    this.noise = complex ? 0.5 : Math2.rangeRandom(this.truncStartRadius/8, this.truncStartRadius/4);
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
    this.mesh = new CustomMesh.Lathe(this.pointsTrunc, this.radiusSegments, this.truncColor);
    
    // 添加附着点（树枝、树叶等）
    this.addAttachments(complex);
    
    // 添加噪声使树干更自然
    if (this.noise) {
      GeometryHelpers.makeNoise(this.mesh.geometry, this.noise);
    }
  }
  
  addAttachments(complex) {
    const defAttachs = complex ? this.getComplexAttachments() : this.getSimpleAttachments();
    this.attachsVerts = GeometryHelpers.getAttachs(this.mesh.geometry, defAttachs);
    this.verticesNormals = GeometryHelpers.getVerticesNormals(this.mesh.geometry);
    
    const colorFoliagePalette = complex ? Colors.pinks : Colors.getRandomFrom([Colors.pinks, Colors.yellows, Colors.greens, Colors.purples]);
    
    for (let i = 0; i < this.attachsVerts.length; i++) {
      const attDef = this.attachsVerts[i];
      const v = this.mesh.geometry.vertices[attDef.index];
      
      let attachment;
      switch(attDef.type) {
        case "elbowBranch":
          attachment = this.createElbowBranch(v, colorFoliagePalette, complex);
          break;
        case "branch":
          attachment = this.createBranch(v, colorFoliagePalette, complex);
          break;
        case "leaf":
          attachment = this.createLeaf(v);
          break;
        case "fruit":
          attachment = this.createFruit(v);
          break;
      }
      
      attachment.position.copy(v);
      attachment.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), 
        this.verticesNormals[attDef.index]
      );
      this.mesh.add(attachment);
    }
  }
  
  createElbowBranch(v, colorPalette, complex) {
    const r = Math2.rangeRandom(this.truncHeight * 0.05, this.truncHeight * 0.15);
    const th = Math2.rangeRandom(this.truncStartRadius * 40/(1+v.y), this.truncStartRadius * 60/(1+v.y));
    return new Branch(r, th, this.truncColor, colorPalette, complex).mesh;
  }
  
  createBranch(v, colorPalette, complex) {
    const s = Math2.rangeRandom(this.truncHeight * 0.03, this.truncHeight * 0.06);
    const th = Math2.rangeRandom(this.truncStartRadius * 0.2, this.truncStartRadius * 0.4);
    return new Branch(s, th, this.truncColor, colorPalette, complex).mesh;
  }
  
  createLeaf(v) {
    const scale = Math2.rangeRandom(1, 2);
    return new Foliage(scale, Colors.green_d).mesh;
  }
  
  createFruit(v) {
    const scale = Math2.rangeRandom(2, 4);
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