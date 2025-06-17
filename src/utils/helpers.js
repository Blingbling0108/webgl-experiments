// src/utils/Helpers.js
import * as THREE from 'three';

/**
 * 添加坐标轴辅助器
 * @param {THREE.Scene} scene - 场景对象
 * @param {number} size - 坐标轴大小
 * @param {THREE.Vector3} position - 坐标轴位置
 * @returns {THREE.AxesHelper} 坐标轴辅助器对象
 */
export function addAxesHelper(scene, size = 200, position = new THREE.Vector3(0, 0, 0)) {
    const axesHelper = new THREE.AxesHelper(size);
    axesHelper.position.copy(position);
    scene.add(axesHelper);
    return axesHelper;
}

/**
 * 添加网格辅助器
 * @param {THREE.Scene} scene - 场景对象
 * @param {number} size - 网格大小
 * @param {number} divisions - 网格分割数
 * @param {THREE.Color} centerColor - 中心线颜色
 * @param {THREE.Color} gridColor - 网格线颜色
 * @param {THREE.Vector3} position - 网格位置
 * @returns {THREE.GridHelper} 网格辅助器对象
 */
export function addGridHelper(
    scene, 
    size = 1000, 
    divisions = 20, 
    centerColor = new THREE.Color(0x888888), 
    gridColor = new THREE.Color(0x444444),
    position = new THREE.Vector3(0, -100, 0)
) {
    const gridHelper = new THREE.GridHelper(size, divisions, centerColor, gridColor);
    gridHelper.position.copy(position);
    scene.add(gridHelper);
    return gridHelper;
}

/**
 * 添加光源辅助器
 * @param {THREE.Scene} scene - 场景对象
 * @param {THREE.Light} light - 光源对象
 * @param {number} size - 辅助器大小
 * @returns {THREE.Object3D} 光源辅助器对象
 */
export function addLightHelper(scene, light, size = 5) {
    let helper;
    
    if (light instanceof THREE.DirectionalLight) {
        helper = new THREE.DirectionalLightHelper(light, size);
    } 
    else if (light instanceof THREE.PointLight) {
        helper = new THREE.PointLightHelper(light, size);
    }
    else if (light instanceof THREE.SpotLight) {
        helper = new THREE.SpotLightHelper(light);
    }
    else if (light instanceof THREE.RectAreaLight) {
        helper = new THREE.RectAreaLightHelper(light);
    }
    else if (light instanceof THREE.HemisphereLight) {
        helper = new THREE.HemisphereLightHelper(light, size);
    }
    
    if (helper) {
        scene.add(helper);
        return helper;
    }
    
    return null;
}

/**
 * 添加相机辅助器
 * @param {THREE.Scene} scene - 场景对象
 * @param {THREE.Camera} camera - 相机对象
 * @param {number} size - 辅助器大小
 * @returns {THREE.CameraHelper} 相机辅助器对象
 */
export function addCameraHelper(scene, camera, size = 100) {
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);
    return helper;
}

/**
 * 添加包围盒辅助器
 * @param {THREE.Scene} scene - 场景对象
 * @param {THREE.Object3D} object - 3D对象
 * @param {THREE.Color} color - 包围盒颜色
 * @returns {THREE.Box3Helper} 包围盒辅助器对象
 */
export function addBoundingBoxHelper(scene, object, color = new THREE.Color(0xffff00)) {
    const box = new THREE.Box3().setFromObject(object);
    const helper = new THREE.Box3Helper(box, color);
    scene.add(helper);
    return helper;
}

/**
 * 添加顶点法线辅助器
 * @param {THREE.Scene} scene - 场景对象
 * @param {THREE.Object3D} object - 3D对象
 * @param {number} size - 法线长度
 * @param {THREE.Color} color - 法线颜色
 * @returns {THREE.FaceNormalsHelper} 法线辅助器对象
 */
export function addVertexNormalsHelper(scene, object, size = 1, color = new THREE.Color(0xff0000)) {
    const helper = new THREE.VertexNormalsHelper(object, size, color);
    scene.add(helper);
    return helper;
}

/**
 * 创建3D文本标签
 * @param {string} text - 文本内容
 * @param {object} options - 配置选项
 * @param {THREE.Vector3} position - 文本位置
 * @returns {THREE.Group} 文本标签组
 */
export function createTextLabel(text, options = {}, position = new THREE.Vector3(0, 0, 0)) {
    const group = new THREE.Group();
    
    // 默认配置
    const config = {
        fontSize: 0.5,
        color: 0xffffff,
        backgroundColor: 0x000000,
        backgroundOpacity: 0.7,
        padding: 0.1,
        borderColor: 0xffffff,
        borderWidth: 0.02,
        ...options
    };
    
    // 创建画布
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // 设置画布大小
    context.font = `${config.fontSize * 100}px Arial`;
    const textWidth = context.measureText(text).width;
    const textHeight = config.fontSize * 100;
    
    canvas.width = textWidth + config.padding * 200;
    canvas.height = textHeight + config.padding * 200;
    
    // 绘制背景
    context.fillStyle = `rgba(${(config.backgroundColor >> 16) & 0xff}, ${(config.backgroundColor >> 8) & 0xff}, ${config.backgroundColor & 0xff}, ${config.backgroundOpacity})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制边框
    context.strokeStyle = `rgb(${(config.borderColor >> 16) & 0xff}, ${(config.borderColor >> 8) & 0xff}, ${config.borderColor & 0xff})`;
    context.lineWidth = config.borderWidth * 100;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    // 绘制文本
    context.fillStyle = `rgb(${(config.color >> 16) & 0xff}, ${(config.color >> 8) & 0xff}, ${config.color & 0xff})`;
    context.font = `${config.fontSize * 100}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    
    // 创建材质
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(
        canvas.width / 100, 
        canvas.height / 100
    );
    
    // 创建文本平面
    const textPlane = new THREE.Mesh(geometry, material);
    
    // 添加平面到组
    group.add(textPlane);
    group.position.copy(position);
    
    // 添加指向相机的功能
    group.lookAtCamera = function(camera) {
        this.quaternion.copy(camera.quaternion);
    };
    
    return group;
}

/**
 * 添加性能监视器
 * @param {string} position - 位置 ('top-left', 'top-right', 'bottom-left', 'bottom-right')
 * @returns {Stats} 性能监视器对象
 */
export function addPerformanceMonitor(position = 'top-right') {
    // 创建Stats对象
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    
    // 设置位置
    const positions = {
        'top-left': { top: '0px', left: '0px' },
        'top-right': { top: '0px', right: '0px' },
        'bottom-left': { bottom: '0px', left: '0px' },
        'bottom-right': { bottom: '0px', right: '0px' }
    };
    
    if (positions[position]) {
        Object.assign(stats.dom.style, positions[position], {
            position: 'absolute'
        });
    }
    
    document.body.appendChild(stats.dom);
    return stats;
}

/**
 * 创建3D坐标系指示器
 * @param {THREE.Scene} scene - 场景对象
 * @param {number} size - 指示器大小
 */
export function addCoordinateSystemIndicator(scene, size = 50) {
    const group = new THREE.Group();
    
    // 创建X轴（红色）
    const xArrow = createArrow(0xff0000, size);
    xArrow.rotation.z = -Math.PI / 2;
    group.add(xArrow);
    
    // 创建Y轴（绿色）
    const yArrow = createArrow(0x00ff00, size);
    yArrow.rotation.x = Math.PI / 2;
    group.add(yArrow);
    
    // 创建Z轴（蓝色）
    const zArrow = createArrow(0x0000ff, size);
    zArrow.rotation.y = Math.PI;
    group.add(zArrow);
    
    // 添加标签
    const labelDistance = size * 1.2;
    group.add(createTextLabel('X', { fontSize: size * 0.1 }, new THREE.Vector3(labelDistance, 0, 0)));
    group.add(createTextLabel('Y', { fontSize: size * 0.1 }, new THREE.Vector3(0, labelDistance, 0)));
    group.add(createTextLabel('Z', { fontSize: size * 0.1 }, new THREE.Vector3(0, 0, labelDistance)));
    
    scene.add(group);
    
    return group;
    
    // 辅助函数：创建箭头
    function createArrow(color, size) {
        const material = new THREE.MeshBasicMaterial({ color });
        const coneGeometry = new THREE.ConeGeometry(size * 0.1, size * 0.2, 16);
        const cylinderGeometry = new THREE.CylinderGeometry(size * 0.03, size * 0.03, size * 0.8, 16);
        
        const cone = new THREE.Mesh(coneGeometry, material);
        cone.position.y = size * 0.4;
        
        const cylinder = new THREE.Mesh(cylinderGeometry, material);
        
        const arrow = new THREE.Group();
        arrow.add(cone);
        arrow.add(cylinder);
        
        return arrow;
    }
}

/**
 * 创建3D空间测量工具
 * @param {THREE.Scene} scene - 场景对象
 * @param {THREE.Camera} camera - 相机对象
 * @returns {Object} 测量工具API
 */
export function createMeasurementTool(scene, camera) {
    const points = [];
    const lines = [];
    const labels = [];
    
    let currentLine = null;
    let startPoint = null;
    
    // 创建点标记
    function createPointMarker(position) {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        scene.add(marker);
        points.push(marker);
        return marker;
    }
    
    // 创建测量线
    function createLine(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push(line);
        return line;
    }
    
    // 创建距离标签
    function createDistanceLabel(start, end) {
        const distance = start.distanceTo(end);
        const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
        
        const label = createTextLabel(`${distance.toFixed(2)} units`, {
            fontSize: 0.2,
            color: 0xffffff,
            backgroundColor: 0x000088
        }, midPoint);
        
        scene.add(label);
        labels.push(label);
        return label;
    }
    
    // 开始测量
    function startMeasurement(position) {
        startPoint = position;
        createPointMarker(position);
    }
    
    // 结束测量
    function endMeasurement(position) {
        if (!startPoint) return;
        
        createPointMarker(position);
        const line = createLine(startPoint, position);
        createDistanceLabel(startPoint, position);
        
        startPoint = null;
        return line;
    }
    
    // 更新临时测量线
    function updateMeasurement(position) {
        if (!startPoint) return;
        
        if (currentLine) {
            scene.remove(currentLine);
        }
        
        currentLine = createLine(startPoint, position);
    }
    
    // 清除所有测量
    function clearMeasurements() {
        points.forEach(point => scene.remove(point));
        lines.forEach(line => scene.remove(line));
        labels.forEach(label => scene.remove(label));
        
        points.length = 0;
        lines.length = 0;
        labels.length = 0;
        
        if (currentLine) {
            scene.remove(currentLine);
            currentLine = null;
        }
        
        startPoint = null;
    }
    
    return {
        startMeasurement,
        endMeasurement,
        updateMeasurement,
        clearMeasurements
    };
}