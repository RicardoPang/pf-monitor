import { injectJsError } from './src/monitor/lib/jsError'
import { injectXHR } from './src/monitor/lib/xhr'
import { blankScreen } from './src/monitor/lib/blankScreen'
import { timing } from './src/monitor/lib/timing'
import { longTask } from './src/monitor/lib/longTask'
import { trackPageView } from './src/monitor/lib/pv'

interface MonitorOptions {
  jsError?: boolean
  xhr?: boolean
  blankScreen?: boolean
  timing?: boolean
  longTask?: boolean
  trackPageView?: boolean
}

function init(options: MonitorOptions = {}): void {
  const {
    jsError = true,
    xhr = true,
    blankScreen: enableBlankScreen = true,
    timing: enableTiming = true,
    longTask: enableLongTask = true,
    trackPageView: enableTrackPageView = true
  } = options

  if (jsError) injectJsError()
  if (xhr) injectXHR()
  if (enableBlankScreen) blankScreen()
  if (enableTiming) timing()
  if (enableLongTask) longTask()
  if (enableTrackPageView) trackPageView()
}

export {
  init,
  injectJsError,
  injectXHR,
  blankScreen,
  timing,
  longTask,
  trackPageView
}

export default {
  init,
  injectJsError,
  injectXHR,
  blankScreen,
  timing,
  longTask,
  trackPageView
}
