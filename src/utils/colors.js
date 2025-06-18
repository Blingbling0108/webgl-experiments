// src/utils/Colors.js
const Colors = {
    // 基本颜色
    white_l: 0xF0F0F0,
    white_d: 0xE0E0E0,
    grey_l: 0x888888,
    grey_d: 0x444444,
    green_d: 0x228822,
    pink_l: 0xFFC0CB,
    red_l: 0xFF6B6B,
    red_d: 0xE53E3E,
    purple_l: 0x9B59B6,
    purple_d: 0x8E44AD,
    yellow_l: 0xFFD700,
    yellow_d: 0xF1C40F,
    
    // 颜色组
    trunc: [0xF0F0F0, 0xE0E0E0, 0x888888, 0x444444],
    whites: [0xFFFFFF, 0xF5F5F5, 0xEEEEEE],
    greys: [0x888888, 0x777777, 0x666666],
    pinks: [0xFFC0CB, 0xFFB6C1, 0xFF69B4],
    yellows: [0xFFD700, 0xFFDF00, 0xFFEF00],
    purples: [0x9B59B6, 0x8E44AD, 0x7D3C98],
    greens: [0x2ECC71, 0x27AE60, 0x229954],
    leaves: [0x2ECC71, 0x27AE60, 0x1E8449, 0x196F3D],
    
    // 随机获取颜色
    getRandomFrom(palette) {
      return palette[Math.floor(Math.random() * palette.length)];
    }
  };
  
  export default Colors;