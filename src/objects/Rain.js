import * as THREE from 'three';

export default class Rain {
  constructor({ rainHeight = 50, rainWidth = 25, particleCount = 300 } = {}) {
    const raindropGeo = new THREE.BoxGeometry(0.3, 2.5, 0.3);
    const raindropMaterial = new THREE.MeshLambertMaterial({
      color: 0xadd8e6,
    });

    this.points = new THREE.InstancedMesh(raindropGeo, raindropMaterial, particleCount);
    this.points.position.y = -10; // 将整个雨系统定位在云下方

    this.particles = [];
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < particleCount; i++) {
      const position = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(rainWidth),
        THREE.MathUtils.randFloat(0, -rainHeight),
        THREE.MathUtils.randFloatSpread(rainWidth)
      );

      const velocity = Math.random() * 20 + 10;
      this.particles.push({ position, velocity });

      matrix.setPosition(position);
      this.points.setMatrixAt(i, matrix);
    }

    this.rainHeight = rainHeight;
  }

  update(delta) {
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.position.y -= particle.velocity * delta;

      if (particle.position.y < -this.rainHeight) {
        particle.position.y = 0;
      }
      
      matrix.setPosition(particle.position);
      this.points.setMatrixAt(i, matrix);
    }
    this.points.instanceMatrix.needsUpdate = true;
  }
} 