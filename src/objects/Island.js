import * as THREE from 'three';

export default class Island {
  constructor({ position = new THREE.Vector3(0, 0, 0), scale = 1 } = {}) {
    this.group = new THREE.Group();

    // 顶部草地平台（略微凸起的圆盘）
    const grassGeometry = new THREE.CylinderGeometry(440, 460, 40, 24, 1, false);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x3CB371 }); // 草绿色
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = 60;
    grass.castShadow = true;
    grass.receiveShadow = true;
    this.group.add(grass);

    // 草地边缘
    const edgeGeometry = new THREE.CylinderGeometry(460, 480, 15, 24, 1, true);
    const edgeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // 深绿色
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.position.y = 32;
    edge.castShadow = true;
    edge.receiveShadow = true;
    this.group.add(edge);

    // 岛屿主体（类似钻石的形状）
    const islandColors = [
      0x8B5A2B, // 上层深棕色
      0xA0522D, // 中层棕红色
      0x7C4A1E, // 下层暗棕色
    ];

    // 上部分（较宽的锥体）
    const upperGeometry = new THREE.CylinderGeometry(480, 380, 100, 24, 1, false);
    const upperMaterial = new THREE.MeshLambertMaterial({ color: islandColors[0] });
    const upper = new THREE.Mesh(upperGeometry, upperMaterial);
    upper.position.y = -20;
    upper.castShadow = true;
    upper.receiveShadow = true;
    this.group.add(upper);

    // 中间部分（快速收窄的锥体）
    const middleGeometry = new THREE.CylinderGeometry(380, 200, 120, 24, 1, false);
    const middleMaterial = new THREE.MeshLambertMaterial({ color: islandColors[1] });
    const middle = new THREE.Mesh(middleGeometry, middleMaterial);
    middle.position.y = -130;
    middle.castShadow = true;
    middle.receiveShadow = true;
    this.group.add(middle);

    // 底部尖锥（逐渐变尖）
    const bottomGeometry = new THREE.CylinderGeometry(200, 5, 180, 24, 1, false);
    const bottomMaterial = new THREE.MeshLambertMaterial({ color: islandColors[2] });
    const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottom.position.y = -270;
    bottom.castShadow = true;
    bottom.receiveShadow = true;
    this.group.add(bottom);

    // 添加装饰
    this.addRocks();
    this.addGrassAndMushrooms();

    // 支持外部缩放和位置
    this.group.position.copy(position);
    this.group.scale.setScalar(scale);
  }

  addRocks() {
    // 在草地边缘添加岩石装饰
    const rockCount = 8;
    const rockColors = [0x808080, 0x696969, 0x778899];
    
    for (let i = 0; i < rockCount; i++) {
      const angle = (i / rockCount) * Math.PI * 2;
      const radius = 440 + Math.random() * 20;
      
      const rockGeometry = new THREE.DodecahedronGeometry(15 + Math.random() * 10, 0);
      const rockMaterial = new THREE.MeshLambertMaterial({ 
        color: rockColors[Math.floor(Math.random() * rockColors.length)] 
      });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      
      rock.position.x = Math.cos(angle) * radius;
      rock.position.z = Math.sin(angle) * radius;
      rock.position.y = 65 + Math.random() * 5;
      
      rock.rotation.x = Math.random() * Math.PI;
      rock.rotation.y = Math.random() * Math.PI;
      rock.rotation.z = Math.random() * Math.PI;
      
      rock.castShadow = true;
      rock.receiveShadow = true;
      
      this.group.add(rock);
    }
  }

  addGrassAndMushrooms() {
    // 草丛的颜色
    const grassColors = [0x4CAF50, 0x388E3C, 0x2E7D32];
    // 蘑菇的颜色
    const mushroomColors = {
      caps: [0xFF5252, 0xE57373, 0xFFCDD2], // 红色系的蘑菇帽
      stems: [0xFFFFFF, 0xFAFAFA] // 白色系的蘑菇茎
    };

    // 添加草丛
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 400; // 在整个平台范围内随机分布
      
      // 创建一簇草（3-5根草组成一簇）
      const grassClump = new THREE.Group();
      const grassCount = 3 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < grassCount; j++) {
        // 每根草是一个细长的圆锥体
        const height = 8 + Math.random() * 12;
        const grassGeometry = new THREE.CylinderGeometry(0.3, 0.1, height, 4, 1);
        const grassMaterial = new THREE.MeshLambertMaterial({ 
          color: grassColors[Math.floor(Math.random() * grassColors.length)]
        });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        
        // 在簇中随机分布
        grass.position.x = (Math.random() - 0.5) * 4;
        grass.position.z = (Math.random() - 0.5) * 4;
        // 稍微倾斜一些
        grass.rotation.x = (Math.random() - 0.5) * 0.5;
        grass.rotation.z = (Math.random() - 0.5) * 0.5;
        
        grass.castShadow = true;
        grass.receiveShadow = true;
        
        grassClump.add(grass);
      }
      
      // 放置草簇
      grassClump.position.x = Math.cos(angle) * radius;
      grassClump.position.z = Math.sin(angle) * radius;
      grassClump.position.y = 65;
      
      this.group.add(grassClump);
    }

    // 添加蘑菇
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 300; // 避免在边缘
      
      // 创建蘑菇组
      const mushroom = new THREE.Group();
      
      // 蘑菇帽（用半球体）
      const capRadius = 2 + Math.random() * 3;
      const capGeometry = new THREE.SphereGeometry(capRadius, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const capMaterial = new THREE.MeshLambertMaterial({ 
        color: mushroomColors.caps[Math.floor(Math.random() * mushroomColors.caps.length)]
      });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      cap.position.y = 4 + Math.random() * 2;
      cap.castShadow = true;
      cap.receiveShadow = true;
      
      // 蘑菇茎（圆柱体）
      const stemHeight = 4 + Math.random() * 2;
      const stemGeometry = new THREE.CylinderGeometry(capRadius * 0.3, capRadius * 0.4, stemHeight, 8);
      const stemMaterial = new THREE.MeshLambertMaterial({ 
        color: mushroomColors.stems[Math.floor(Math.random() * mushroomColors.stems.length)]
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = stemHeight / 2;
      stem.castShadow = true;
      stem.receiveShadow = true;
      
      mushroom.add(cap);
      mushroom.add(stem);
      
      // 放置蘑菇
      mushroom.position.x = Math.cos(angle) * radius;
      mushroom.position.z = Math.sin(angle) * radius;
      mushroom.position.y = 65;
      
      // 随机旋转和稍微倾斜
      mushroom.rotation.y = Math.random() * Math.PI * 2;
      mushroom.rotation.x = (Math.random() - 0.5) * 0.2;
      mushroom.rotation.z = (Math.random() - 0.5) * 0.2;
      
      this.group.add(mushroom);
    }
  }
} 