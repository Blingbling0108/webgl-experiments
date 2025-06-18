// src/objects/Foliage.js
import * as THREE from 'three';
import Colors from '../utils/colors.js';
import Math2 from '../utils/Math2.js';
import GeometryHelpers from '../utils/GeometryHelpers.js';
import CustomMesh from '../utils/CustomMesh.js';

export default class Foliage {
  constructor(scale, color, complex = false) {
    this.type = "foliage";
    this.scale = scale;
    this.color = color;
    
    // 创建树叶基本形状
    const widthSegments = complex ? Math2.rangeRandomInt(3, 10) : Math2.rangeRandomInt(3, 5);
    const heightSegments = Math2.rangeRandomInt(3, 6);
    const noise = complex ? 0.05 * scale : Math2.rangeRandom(scale/20, scale/5);
    
    this.mesh = new CustomMesh.SphereMesh(scale, widthSegments, heightSegments, this.color, false);
    
    // 添加细节
    if (complex) {
      this.addDetail();
    }
    
    // 添加噪声使树叶更自然
    GeometryHelpers.makeNoise(this.mesh.geometry, noise);
  }
  
  addDetail() {
    const geom = this.mesh.geometry;
    const h = this.scale * 2;
    
    // 添加子树叶
    const defAttachs = [
      { type: "subFol", count: 6, minH: h * 0.2, maxH: h * 0.9 }
    ];
    
    const attachsVerts = GeometryHelpers.getAttachs(geom, defAttachs);
    
    for (let i = 0; i < attachsVerts.length; i++) {
      const attDef = attachsVerts[i];
      const v = geom.vertices[attDef.index];
      const s = Math2.rangeRandom(this.scale * 0.05, this.scale * 0.2);
      
      // 创建子树叶
      const subFoliage = new SubFoliage(s);
      subFoliage.mesh.position.copy(v);
      subFoliage.mesh.rotation.z = Math2.rangeRandom(-Math.PI/8, Math.PI/8);
      subFoliage.mesh.rotation.x = Math2.rangeRandom(-Math.PI/8, Math.PI/8);
      
      this.mesh.add(subFoliage.mesh);
    }
  }
}

// 子树叶类
class SubFoliage {
  constructor(scale) {
    this.type = "subfoliage";
    const widthSegments = Math2.rangeRandomInt(2, 4);
    const heightSegments = Math2.rangeRandomInt(2, 4);
    this.mesh = new CustomMesh.SphereMesh(
      scale, 
      widthSegments, 
      heightSegments, 
      Colors.getRandomFrom(Colors.leaves), 
      true
    );
  }
}