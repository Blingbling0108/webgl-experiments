// src/objects/Lion.js
import * as THREE from 'three';

export default class Lion {
    constructor() {
        this.threegroup = new THREE.Group();
        this.yellowMat = new THREE.MeshLambertMaterial({ color: 0xfdd276, flatShading: true });
        this.redMat = new THREE.MeshLambertMaterial({ color: 0xad3525, flatShading: true });
        this.pinkMat = new THREE.MeshLambertMaterial({ color: 0xe55d2b, flatShading: true });
        this.whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
        this.purpleMat = new THREE.MeshLambertMaterial({ color: 0x451954, flatShading: true });
        this.greyMat = new THREE.MeshLambertMaterial({ color: 0x653f4c, flatShading: true });
        this.blackMat = new THREE.MeshLambertMaterial({ color: 0x302925, flatShading: true });
        this.createBody();
        this.createLimbs();
        this.createHead();
        this.createMane();
        this.createFaceDetails();
    }

    createBody() {
        const bodyGeom = new THREE.CylinderGeometry(30, 80, 140, 4);
        this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
        this.body.position.set(0, -30, -60);
        this.threegroup.add(this.body);
    }

    createLimbs() {
        const kneeGeom = new THREE.BoxGeometry(25, 80, 80);
        kneeGeom.translate(0, 50, 0);
        this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
        this.leftKnee.position.set(65, -110, -20);
        this.leftKnee.rotation.z = -0.3;
        this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
        this.rightKnee.position.set(-65, -110, -20);
        this.rightKnee.rotation.z = 0.3;
        const footGeom = new THREE.BoxGeometry(40, 20, 20);
        this.backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.backLeftFoot.position.set(75, -90, 30);
        this.backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.backRightFoot.position.set(-75, -90, 30);
        this.frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.frontRightFoot.position.set(-22, -90, 40);
        this.frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
        this.frontLeftFoot.position.set(22, -90, 40);
        this.threegroup.add(
            this.leftKnee,
            this.rightKnee,
            this.backLeftFoot,
            this.backRightFoot,
            this.frontRightFoot,
            this.frontLeftFoot
        );
    }

    createHead() {
        this.head = new THREE.Group();
        this.head.position.y = 60;
        const faceGeom = new THREE.BoxGeometry(80, 80, 80);
        this.face = new THREE.Mesh(faceGeom, this.yellowMat);
        this.face.position.z = 135;
        const earGeom = new THREE.BoxGeometry(20, 20, 20);
        this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
        this.rightEar.position.set(-50, 50, 105);
        this.leftEar = new THREE.Mesh(earGeom, this.yellowMat);
        this.leftEar.position.set(50, 50, 105);
        const noseGeom = new THREE.BoxGeometry(40, 40, 20);
        this.nose = new THREE.Mesh(noseGeom, this.greyMat);
        this.nose.position.set(0, 25, 170);
        this.head.add(this.face, this.rightEar, this.leftEar, this.nose);
        this.threegroup.add(this.head);
    }

    createMane() {
        this.mane = new THREE.Group();
        this.mane.position.set(0, -10, 80);
        const maneGeom = new THREE.BoxGeometry(40, 40, 15);
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                const manePart = new THREE.Mesh(maneGeom, this.redMat);
                manePart.position.x = (j * 40) - 60;
                manePart.position.y = (k * 40) - 60;
                this.mane.add(manePart);
            }
        }
        this.head.add(this.mane);
    }

    createFaceDetails() {
        const eyeGeom = new THREE.BoxGeometry(5, 30, 30);
        this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.leftEye.position.set(40, 25, 120);
        this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.rightEye.position.set(-40, 25, 120);
        const irisGeom = new THREE.BoxGeometry(4, 10, 10);
        this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
        this.leftIris.position.set(42, 25, 120);
        this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
        this.rightIris.position.set(-42, 25, 120);
        const mouthGeom = new THREE.BoxGeometry(20, 20, 10);
        this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
        this.mouth.position.set(0, -10, 170);
        this.head.add(
            this.leftEye,
            this.rightEye,
            this.leftIris,
            this.rightIris,
            this.mouth
        );
    }
}