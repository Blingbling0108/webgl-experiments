# webgl-experiments

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E=16.0.0-brightgreen)](https://nodejs.org/)
[![status](https://img.shields.io/badge/status-active-brightgreen)]()

[**在线体验 (Live Demo)**](https://blingbling0108.github.io/webgl-experiments/)

---

## 项目简介

**一句话简介：**  
一个基于 Three.js 的低多边形像素风格 WebGL 3D 场景实验项目，支持丰富的交互和动画。

**详细描述：**  
webgl-experiments 旨在用现代 WebGL 技术和 Three.js，快速搭建可交互的3D小世界。项目包含动物、云、风扇、森林、蘑菇等多种对象，支持动画、风力交互、局部下雨等效果，适合 Three.js 学习、创意原型、可视化演示等场景。

---

## 安装/部署指南

### 前提条件

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 本地开发启动

```bash
npm run dev
```

### 构建生产环境

```bash
npm run build
```

---

## 目录结构

```
webgl-experiments/
├── src/             # 源代码目录
│   ├── main.js      # 应用入口
│   ├── core/        # Three.js 场景/灯光/地板/控制
│   ├── objects/     # 3D对象（动物、云、蘑菇、森林等）
│   ├── utils/       # 工具函数
│   ├── styles/      # 样式
├── public/          # 静态资源（图片、音频、模型等）
├── docs/            # 项目文档
├── index.html       # 主HTML文件
├── package.json     # 项目依赖与脚本
├── README.md        # 项目说明
└── LICENSE          # 许可证
```

---

## 使用指南

- 启动项目后，访问浏览器显示的本地地址，即可体验3D场景。
- 鼠标可拖动视角，键盘可控制部分对象（如狮子跳跃）。
- 点击页面可播放背景音乐。
- 体验风扇吹风、云下雨、蘑菇、森林等丰富元素。

### 主要功能/特性

- 🌧️ 云朵下雨（局部区域，像素风格）
- 🦁 狮子可跳跃、被风扇吹动
- 🍄 可爱蘑菇、森林、岛屿等多种3D对象
- 🌬️ 风扇与风力交互
- 🎵 背景音乐与音效（`public/` 目录下有多种音效）
- 💡 物理光照、阴影
- 📦 低多边形/像素风格美术

### 常见操作示例

- 按空格键让狮子跳跃
- 鼠标拖动旋转视角
- 体验风扇吹动狮子和云下雨的动态效果

---

## 贡献指南

欢迎任何形式的贡献！

- **报告问题**：请通过 Issue 提交 bug 或建议。
- **提交代码**：Fork 本仓库，创建分支，提交 PR。
- **代码规范**：请遵循项目的代码风格（建议使用 ESLint/Prettier）。
- **测试要求**：如有测试，请确保通过所有测试后再提交 PR。
- **文档要求**：如有功能变更，请同步更新文档。
- **行为准则**：请遵守 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

---

## 许可证

本项目基于 MIT License 开源。详见 [LICENSE](./LICENSE)。

---

## 项目状态

[✔️] 活跃开发中  
如有建议或需求欢迎提 Issue！

---

## 技术栈

- [Three.js](https://threejs.org/) - 3D 渲染引擎
- [Vite](https://vitejs.dev/) - 前端开发与构建工具
- [JavaScript (ES6+)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- 其他：HTML5, CSS3

---

## 主要3D对象与模块

- Lion.js 狮子
- Bird.js 小鸟
- Cloud.js 云朵（带下雨效果）
- Rain.js 雨滴粒子系统
- Fan.js 风扇
- Forest.js 森林
- Tree.js 树
- Island.js 岛屿
- Mushroom.js 蘑菇

---

## 截图/演示

[**点击此处在线体验 (Click here for a Live Demo)**](https://blingbling0108.github.io/webgl-experiments/)

> 建议在此处插入项目主要界面截图或动图，帮助用户直观了解效果。

---

## 致谢

- Three.js 官方文档与社区
- 灵感来源于《我的世界》《动物之森》等像素/低多边形风格作品
- 感谢所有贡献者和使用者！

---

## 相关链接

- [Three.js 官方文档](https://threejs.org/docs/)
- [Vite 官方文档](https://vitejs.dev/guide/)
- [项目演示/博客/教程（如有）](#)

---

如需更详细的 API 或开发文档，请查阅 `docs/` 目录或源码注释。

---