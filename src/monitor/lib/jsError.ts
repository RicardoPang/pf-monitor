import formatTime from '../utils/formatTime'
import getLastEvent from '../utils/getLastEvent'
import getSelector, { getEventPath } from '../utils/getSelector'
import tracker from '../utils/tracker'

interface ErrorDetails {
  kind: string
  type: string
  errorType: string
  message?: string
  filename?: string
  position?: string
  stack?: string
  selector: string
  tagName?: string
  timeStamp?: string
}

export function injectJsError() {
  // 监听全局未捕获的错误
  window.addEventListener('error', handleErrorEvent, true)
  window.addEventListener('unhandledrejection', handlePromiseRejection, true)

  function handleErrorEvent(event: ErrorEvent) {
    const lastEvent = getLastEvent() // 最后一个交互事件
    if (isResourceError(event)) {
      // 脚本加载错误
      const target = event.target as HTMLScriptElement | HTMLLinkElement
      sendErrorReport({
        kind: 'stability', // 监控指标的大类(稳定性)
        type: 'error', // 小类型 这是一个错误
        errorType: 'resourceError', // js或css资源加载错误
        filename:
          target instanceof HTMLScriptElement ? target.src : target.href, // 哪个文件报错了(加载失败的资源)
        tagName: target.tagName, // script(标签名)
        timeStamp: formatTime(event.timeStamp), //时间
        selector: getSelector(target) // 代表最后一个操作的元素(选择器)
      })
    } else {
      sendErrorReport({
        kind: 'stability',
        type: 'error',
        errorType: 'jsError',
        message: event.message, // 报错信息
        filename: event.filename, // 报错链接
        position: `${event.lineno}:${event.colno}`, // 行列号
        stack: getLines(event.error?.stack), // 错误堆栈
        selector: lastEvent ? getSelector(getEventPath(lastEvent)) : '' // CSS选择器
      })
    }
  }

  function handlePromiseRejection(event: PromiseRejectionEvent) {
    const lastEvent = getLastEvent()
    const { message, filename, line, column, stack } = parsePromiseError(
      event.reason
    )
    sendErrorReport({
      kind: 'stability',
      type: 'error',
      errorType: 'promiseError',
      message,
      filename,
      position: `${line}:${column}`,
      stack,
      selector: lastEvent ? getSelector(getEventPath(lastEvent)) : ''
    })
  }

  function parsePromiseError(reason: any) {
    let message = ''
    let filename = ''
    let line = 0
    let column = 0
    let stack = ''

    if (typeof reason === 'string') {
      message = reason
    } else if (reason && typeof reason === 'object' && reason.stack) {
      // 说明是一个错误对象
      message = reason.message
      const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
      if (matchResult) {
        ;[filename, line, column] = matchResult.slice(1, 4)
      }
      stack = getLines(reason.stack)
    }

    return { message, filename, line, column, stack }
  }

  function sendErrorReport(details: ErrorDetails) {
    tracker.send(details)
  }

  function isResourceError(event: ErrorEvent) {
    return (
      event.target &&
      (event.target instanceof HTMLScriptElement ||
        event.target instanceof HTMLLinkElement)
    )
  }

  function getLines(stack: string = '') {
    return stack
      .split('\n')
      .slice(1)
      .map((itme) => itme.replace(/^\s+at\s+/g, ''))
      .join('^')
  }
}
