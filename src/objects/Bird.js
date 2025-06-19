import * as THREE from 'three';
import Colors from '../utils/colors.js';

// 创建静态小鸡模型
export function createStaticBird(scene) {
  var rSegments = 4;
  var hSegments = 3;

  // 创建容器组
  var birdGroup = new THREE.Group();

  // 材质
  var yellowMat = new THREE.MeshLambertMaterial({ color: Colors.birdYellow, flatShading: true });
  var whiteMat = new THREE.MeshLambertMaterial({ color: Colors.birdWhite, flatShading: true });
  var blackMat = new THREE.MeshLambertMaterial({ color: Colors.birdBlack, flatShading: true });
  var orangeMat = new THREE.MeshLambertMaterial({ color: Colors.birdOrange, flatShading: true });

  // 身体
  var bodyGeom = new THREE.CylinderGeometry(40, 70, 200, rSegments, hSegments);
  var bodyBird = new THREE.Mesh(bodyGeom, yellowMat);
  bodyBird.position.y = 70;
  birdGroup.add(bodyBird);

  // 翅膀
  var wingGeom = new THREE.BoxGeometry(60, 60, 5);

  var wingLeftGroup = new THREE.Group();
  var wingLeft = new THREE.Mesh(wingGeom, yellowMat);
  wingLeftGroup.add(wingLeft);
  wingLeftGroup.position.x = 70;
  wingLeftGroup.rotation.y = Math.PI / 2;
  wingLeft.rotation.x = -Math.PI / 4;

  var wingRightGroup = new THREE.Group();
  var wingRight = new THREE.Mesh(wingGeom, yellowMat);
  wingRightGroup.add(wingRight);
  wingRightGroup.position.x = -70;
  wingRightGroup.rotation.y = -Math.PI / 2;
  wingRight.rotation.x = -Math.PI / 4;

  birdGroup.add(wingLeftGroup);
  birdGroup.add(wingRightGroup);

  // 面部组
  var face = new THREE.Group();

  // 眼睛
  var eyeGeom = new THREE.BoxGeometry(60, 60, 10);
  var irisGeom = new THREE.BoxGeometry(10, 10, 10);

  var leftEye = new THREE.Mesh(eyeGeom, whiteMat);
  leftEye.position.set(-30, 120, 35);
  leftEye.rotation.y = -Math.PI / 4;

  var leftIris = new THREE.Mesh(irisGeom, blackMat);
  leftIris.position.set(-30, 120, 40);
  leftIris.rotation.y = -Math.PI / 4;

  var rightEye = new THREE.Mesh(eyeGeom, whiteMat);
  rightEye.position.set(30, 120, 35);
  rightEye.rotation.y = Math.PI / 4;

  var rightIris = new THREE.Mesh(irisGeom, blackMat);
  rightIris.position.set(30, 120, 40);
  rightIris.rotation.y = Math.PI / 4;

  // 鸟喙
  var beakGeom = new THREE.CylinderGeometry(0, 20, 20, 4, 1);
  var beak = new THREE.Mesh(beakGeom, orangeMat);
  beak.position.set(0, 70, 65);
  beak.rotation.x = Math.PI / 2;

  // 羽毛
  var featherGeom = new THREE.BoxGeometry(10, 20, 5);

  var feather1 = new THREE.Mesh(featherGeom, yellowMat);
  feather1.position.set(0, 185, 55);
  feather1.rotation.x = Math.PI / 4;
  feather1.scale.set(1.5, 1.5, 1);

  var feather2 = new THREE.Mesh(featherGeom, yellowMat);
  feather2.position.set(20, 180, 50);
  feather2.rotation.x = Math.PI / 4;
  feather2.rotation.z = -Math.PI / 8;

  var feather3 = new THREE.Mesh(featherGeom, yellowMat);
  feather3.position.set(-20, 180, 50);
  feather3.rotation.x = Math.PI / 4;
  feather3.rotation.z = Math.PI / 8;

  // 添加到面部组
  face.add(leftEye, leftIris, rightEye, rightIris, beak, feather1, feather2, feather3);
  birdGroup.add(face);

  // 启用阴影
  birdGroup.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  scene.add(birdGroup);
} 