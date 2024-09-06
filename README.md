## pf-monitor 前端监控

### 快速开始

#### 1. 安装

```bash
npm install
```

#### 2. 引用

```js
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

- git clone
- npm install
- npm run dev
