import tracker from '../utils/tracker'
import onload from '../utils/onload'
import getLastEvent from '../utils/getLastEvent'
import getSelector, { getEventPath } from '../utils/getSelector'
import formatTime from '../utils/formatTime'

interface PaintMetrics {
  firstPaint: string | undefined
  firstContentfulPaint: string | undefined
  firstMeaningfulPaint: string | undefined
  largestContentfulPaint: string | undefined
}

interface TimingMetrics {
  connectTime: number
  ttfbTime: number
  responseTime: number
  parseDOMTime: number
  domContentLoadedTime: number
  timeToInteractive: number
  loadTime: number
}

interface InputDelayMetrics {
  inputDelay: string
  duration: string
  startTime: string
  selector: string
}

export function timing() {
  let FMP: PerformanceEntry | undefined
  let LCP: PerformanceEntry | undefined

  // 观察页面中有意义的元素
  function observePerformanceEntries(
    entryType: string,
    callback: (entry: PerformanceEntry) => void
  ) {
    if (!PerformanceObserver) return
    new PerformanceObserver((entryList, observer) => {
      const entries = entryList.getEntries()
      callback(entries[0])
      observer.disconnect() // 不再观察了
    }).observe({ entryTypes: [entryType] })
  }

  // 监听 FMP 和 LCP
  observePerformanceEntries('element', (entry) => {
    FMP = entry
  })
  observePerformanceEntries('largest-contentful-paint', (entry) => {
    LCP = entry
  })

  // 监听 FID
  observePerformanceEntries('first-input', (entry) => {
    const firstInput = entry as PerformanceEventTiming // 类型断言为 PerformanceEventTiming
    console.log('FID', firstInput)
    const lastEvent = getLastEvent()
    // processingStart 开始处理时间 startTime 开始点击时间 差值就是处理的延迟
    const inputDelay = firstInput.processingStart - firstInput.startTime
    // 处理耗时
    const duration = firstInput.duration

    if (inputDelay > 0 || duration > 0) {
      const inputDelayMetrics: InputDelayMetrics = {
        inputDelay: formatTime(inputDelay), // 延时事件
        duration: formatTime(duration), // 处理事件
        startTime: formatTime(firstInput.startTime),
        selector: lastEvent
          ? getSelector(getEventPath(lastEvent) || lastEvent.target)
          : ''
      }
      tracker.send({
        kind: 'experience', // 用户体验指标
        type: 'firstInputDelay', // 首次输入延迟
        ...inputDelayMetrics
      })
    }
  })

  // 页面加载后，获取并发送相关的时间和绘制性能指标
  onload(() => {
    setTimeout(() => {
      const [navigationEntry] = performance.getEntriesByType(
        'navigation'
      ) as PerformanceNavigationTiming[]
      if (!navigationEntry) return

      const timingMetrics: TimingMetrics = {
        connectTime: navigationEntry.connectEnd - navigationEntry.connectStart, // 连接时间
        ttfbTime: navigationEntry.responseStart - navigationEntry.requestStart, // 首字节时间
        responseTime:
          navigationEntry.responseEnd - navigationEntry.responseStart, // 响应读取时间
        parseDOMTime:
          navigationEntry.loadEventStart - navigationEntry.domInteractive, // DOM 解析时间
        domContentLoadedTime:
          navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart, // DOMContentLoaded 时间
        timeToInteractive:
          navigationEntry.domInteractive - navigationEntry.fetchStart, // 首次可交互时间
        loadTime: navigationEntry.loadEventStart - navigationEntry.fetchStart // 完整页面加载时间
      }

      // 发送时间性能指标
      sendMetrics('timing', timingMetrics)

      // 获取绘制性能条目
      const FP = performance.getEntriesByName('first-paint')[0] as
        | PerformanceEntry
        | undefined
      const FCP = performance.getEntriesByName('first-contentful-paint')[0] as
        | PerformanceEntry
        | undefined

      console.log('FP', FP)
      console.log('FCP', FCP)
      console.log('FMP', FMP)
      console.log('LCP', LCP)

      const paintMetrics: PaintMetrics = {
        firstPaint: formatTime(FP?.startTime || 0),
        firstContentfulPaint: formatTime(FCP?.startTime || 0),
        firstMeaningfulPaint: formatTime(FMP?.startTime || 0),
        largestContentfulPaint: formatTime(LCP?.startTime || 0)
      }

      // 发送绘制性能指标
      sendMetrics('paint', paintMetrics)
    }, 3000)
  })
}

function sendMetrics(type: string, metrics: object) {
  tracker.send({
    kind: 'experience', // 用户体验指标
    type, // 统计每个阶段的时间
    ...metrics
  })
}
