// math.js - 数学工具函数
export function rule3(a, b, c) {
  // 三量比例公式：a : b = c : x => x = (b * c) / a
  return (b * c) / a;
}
 
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
} 