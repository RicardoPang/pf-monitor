## pf-monitor 前端监控

### 快速开始

#### 1. 安装

```bash
npm install https://github.com/RicardoPang/pf-monitor.git
```

#### 2. 引用

```js
// 导入依赖包
npm i pf-monitor

// 整体导入
import PfMonitor from 'pf-monitor'
PfMonitor.init()

// 或者按需导入
import { injectJsError, injectXHR } from 'pf-monitor'
injectJsError()
injectXHR()

// 或者使用初始化函数
import { init } from 'pf-monitor'
init({ jsError: true, xhr: true, blankScreen: false, timing: false })
```

### 本地运行

- git clone https://github.com/RicardoPang/pf-monitor.git
- npm install
- npm run dev
