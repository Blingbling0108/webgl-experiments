// src/utils/Math.js
import * as THREE from 'three';

/**
 * 将值从一个范围映射到另一个范围
 * @param {number} v - 输入值
 * @param {number} vmin - 输入范围最小值
 * @param {number} vmax - 输入范围最大值
 * @param {number} tmin - 目标范围最小值
 * @param {number} tmax - 目标范围最大值
 * @returns {number} 映射后的值
 */
export function rule3(v, vmin, vmax, tmin, tmax) {
    const nv = Math.max(Math.min(v, vmax), vmin);
    const dv = vmax - vmin;
    const pc = (nv - vmin) / dv;
    const dt = tmax - tmin;
    return tmin + (pc * dt);
}

/**
 * 将值限制在指定范围内
 * @param {number} value - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 * @param {number} a - 起始值
 * @param {number} b - 结束值
 * @param {number} t - 插值因子 (0-1)
 * @returns {number} 插值结果
 */
export function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}

/**
 * 平滑阻尼（类似Unity的Mathf.SmoothDamp）
 * @param {number} current - 当前值
 * @param {number} target - 目标值
 * @param {Object} velocity - 速度对象（需在调用间保持引用）
 * @param {number} smoothTime - 近似达到目标的时间（秒）
 * @param {number} maxSpeed - 最大速度限制
 * @param {number} deltaTime - 时间增量
 * @returns {number} 平滑后的值
 */
export function smoothDamp(current, target, velocity, smoothTime, maxSpeed = Infinity, deltaTime) {
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;
    
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    
    let change = current - target;
    const originalTo = target;
    
    const maxChange = maxSpeed * smoothTime;
    change = clamp(change, -maxChange, maxChange);
    target = current - change;
    
    const temp = (velocity.value + omega * change) * deltaTime;
    velocity.value = (velocity.value - omega * temp) * exp;
    
    let output = target + (change + temp) * exp;
    
    if (originalTo - current > 0 === output > originalTo) {
        output = originalTo;
        velocity.value = (output - originalTo) / deltaTime;
    }
    
    return output;
}

/**
 * 计算两点间距离（2D）
 * @param {number} x1 - 点1 x坐标
 * @param {number} y1 - 点1 y坐标
 * @param {number} x2 - 点2 x坐标
 * @param {number} y2 - 点2 y坐标
 * @returns {number} 两点间距离
 */
export function distance2D(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 计算两点间距离（3D）
 * @param {THREE.Vector3} v1 - 点1
 * @param {THREE.Vector3} v2 - 点2
 * @returns {number} 两点间距离
 */
export function distance3D(v1, v2) {
    return Math.sqrt(
        Math.pow(v2.x - v1.x, 2) + 
        Math.pow(v2.y - v1.y, 2) + 
        Math.pow(v2.z - v1.z, 2)
    );
}

/**
 * 生成指定范围内的随机浮点数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机浮点数
 */
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 角度转弧度
 * @param {number} degrees - 角度值
 * @returns {number} 弧度值
 */
export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * 弧度转角度
 * @param {number} radians - 弧度值
 * @returns {number} 角度值
 */
export function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * 计算两点间的角度（2D）
 * @param {number} x1 - 起点x
 * @param {number} y1 - 起点y
 * @param {number} x2 - 终点x
 * @param {number} y2 - 终点y
 * @returns {number} 角度（弧度）
 */
export function angleBetweenPoints(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 向量归一化（2D）
 * @param {number} x - x分量
 * @param {number} y - y分量
 * @returns {Object} 归一化后的向量 {x, y}
 */
export function normalizeVector2D(x, y) {
    const length = Math.sqrt(x * x + y * y);
    return {
        x: x / length,
        y: y / length
    };
}

/**
 * 生成Perlin噪声值（简化版）
 * @param {number} x - x坐标
 * @param {number} y - y坐标
 * @returns {number} 噪声值 (-1到1之间)
 */
export function perlinNoise(x, y) {
    // 简化版Perlin噪声实现
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = fade(x);
    const v = fade(y);
    
    const a = grad(X, Y, x, y);
    const b = grad(X + 1, Y, x - 1, y);
    const c = grad(X, Y + 1, x, y - 1);
    const d = grad(X + 1, Y + 1, x - 1, y - 1);
    
    return lerp(
        lerp(a, b, u),
        lerp(c, d, u),
        v
    );
}

// Perlin噪声辅助函数
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/**
 * 创建缓动函数
 * @param {string} type - 缓动类型 ('easeIn', 'easeOut', 'easeInOut', 'bounce')
 * @returns {Function} 缓动函数
 */
export function createEasingFunction(type = 'easeInOut') {
    switch(type) {
        case 'easeIn':
            return t => t * t;
        case 'easeOut':
            return t => t * (2 - t);
        case 'easeInOut':
            return t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        case 'bounce':
            return t => {
                if (t < 1 / 2.75) {
                    return 7.5625 * t * t;
                } else if (t < 2 / 2.75) {
                    t -= 1.5 / 2.75;
                    return 7.5625 * t * t + 0.75;
                } else if (t < 2.5 / 2.75) {
                    t -= 2.25 / 2.75;
                    return 7.5625 * t * t + 0.9375;
                } else {
                    t -= 2.625 / 2.75;
                    return 7.5625 * t * t + 0.984375;
                }
            };
        default:
            return t => t;
    }
}

/**
 * 将值从线性空间转换为伽马空间
 * @param {number} value - 线性空间值
 * @returns {number} 伽马空间值
 */
export function linearToGamma(value) {
    return Math.pow(value, 1.0 / 2.2);
}

/**
 * 将值从伽马空间转换为线性空间
 * @param {number} value - 伽马空间值
 * @returns {number} 线性空间值
 */
export function gammaToLinear(value) {
    return Math.pow(value, 2.2);
}