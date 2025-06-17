# webgl-experiments
src/
├── main.js              # 应用入口
├── core/                # 核心Three.js功能
│   ├── sceneSetup.js    # 场景、相机、渲染器初始化
│   ├── lights.js        # 光照系统
│   ├── floor.js         # 地板创建
│   └── controls.js      # 事件处理与控制
├── objects/             # 3D对象
│   ├── Lion.js          # 狮子类
│   └── Fan.js           # 风扇类
├── utils/               # 工具函数
│   ├── math.js          # 数学工具(rule3, clamp等)
│   └── helpers.js       # Three.js辅助工具
├── styles/              # 样式文件
│   └── main.css         # 全局样式
└── index.html           # 主HTML文件