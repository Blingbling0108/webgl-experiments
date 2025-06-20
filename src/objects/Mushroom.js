import * as THREE from 'three';

export default class Mushroom {
  constructor() {
    this.group = new THREE.Group();

    // 菌柄
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0xF0DDB2, flatShading: true });
    const stemGeometry = new THREE.BoxGeometry(4, 10, 4);
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 5; // 高度的一半
    stem.castShadow = true;
    stem.receiveShadow = true;
    this.group.add(stem);

    // 菌盖
    const capMaterial = new THREE.MeshLambertMaterial({ color: 0xD95757, flatShading: true });
    const capGeometry = new THREE.BoxGeometry(14, 6, 14);
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 10 + 3; // 位于菌柄之上
    cap.castShadow = true;
    cap.receiveShadow = true;
    this.group.add(cap);

    // 菌盖上的斑点
    const spotMaterial = new THREE.MeshLambertMaterial({ color: 0xA0D5D3, flatShading: true });
    const spotGeometry = new THREE.BoxGeometry(3, 2, 3);

    const createSpot = (x, z) => {
      const spot = new THREE.Mesh(spotGeometry, spotMaterial);
      spot.position.set(x, 17, z); // 位于菌盖顶部
      spot.castShadow = true;
      return spot;
    };

    const spot1 = createSpot(-4, -4);
    const spot2 = createSpot(4, -4);
    const spot3 = createSpot(-4, 4);
    const spot4 = createSpot(4, 4);

    this.group.add(spot1, spot2, spot3, spot4);
  }
} 