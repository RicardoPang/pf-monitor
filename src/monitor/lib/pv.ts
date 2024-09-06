import tracker from '../utils/tracker'

interface PVData {
  kind: 'business'
  type: 'pv'
  effectiveType: string
  rtt: number
  screen: string
}

interface StayTimeData {
  kind: 'business'
  type: 'stayTime'
  stayTime: number
}

interface NetworkConnection {
  effectiveType?: string
  rtt?: number
}

/**
 * 跟踪页面浏览量和停留时间
 */
export function trackPageView(): void {
  sendPageViewData()
  trackStayTime()
}

function sendPageViewData(): void {
  const connection = getNetworkConnection()
  const pvData: PVData = {
    kind: 'business',
    type: 'pv',
    effectiveType: connection.effectiveType || 'unknown', // 网络环境
    rtt: connection.rtt || 0, // 往返时间
    screen: getScreenResolution() // 屏幕分辨率
  }
  tracker.send(pvData)
}

function trackStayTime(): void {
  const startTime = Date.now()
  window.addEventListener(
    'unload',
    () => {
      const stayTime = Date.now() - startTime
      const stayTimeData: StayTimeData = {
        kind: 'business',
        type: 'stayTime',
        stayTime
      }
      tracker.send(stayTimeData)
    },
    { once: true }
  )
}

function getNetworkConnection(): NetworkConnection {
  const nav = navigator as any
  return nav.connection || nav.mozConnection || nav.webkitConnection || {}
}

function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`
}
