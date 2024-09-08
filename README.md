## pf-monitor 前端监控

### 快速开始

#### 1. 本地运行

```bash
git clone https://github.com/RicardoPang/pf-monitor.git

npm install

npm run dev
```

#### 2. 安装

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
