# webgl-experiments
src/
├── main.js              # 应用入口
├── core/                # 核心Three.js功能
│   ├── sceneSetup.js    # 场景、相机、渲染器初始化
│   ├── lights.js        # 光照系统
│   ├── floor.js         # 地板创建
│   └── controls.js      # 事件处理与控制
├── objects/             # 3D对象
│   ├── Lion.js
│   ├── Fan.js
│   ├── Tree.js          # 新增：树木核心类
│   ├── Trunc.js         # 新增：树干类
│   ├── Branch.js        # 新增：树枝类
│   ├── Foliage.js       # 新增：树叶类
│   └── Forest.js        # 新增：森林管理类
├── utils/               # 工具函数
│   ├── math.js          # 数学工具(rule3, clamp等)
│   └── helpers.js       # Three.js辅助工具
│   └── counter.js
├── styles/              # 样式文件
│   └── main.css         # 全局样式
└── index.html           # 主HTML文件