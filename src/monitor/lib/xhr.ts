import tracker from '../utils/tracker'

interface LogData {
  method: string
  url: string
  async: boolean
}

export function injectXHR(): void {
  const XMLHttpRequest = window.XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true
  ): void {
    if (!/logstores|sockjs/.test(url.toString())) {
      ;(this as any).logData = { method, url: url.toString(), async } as LogData
    }
    return originalOpen.apply(this, arguments as any)
  }

  XMLHttpRequest.prototype.send = function (
    ...args: [body?: Document | XMLHttpRequestBodyInit | null]
  ): void {
    const logData = (this as any).logData as LogData | undefined
    if (logData) {
      const startTime = Date.now() // 发送之前记录一下开始时间

      const handleEvent = (eventType: string) => (): void => {
        const duration = Date.now() - startTime
        const status = this.status // status 2xx 304 成功 其它 就是失败
        const statusText = this.statusText
        const response = this.response ? JSON.stringify(this.response) : ''

        tracker.send({
          kind: 'stability',
          type: 'xhr',
          eventType, // load,error,abort
          pathname: logData.url, // 请求路径
          status: `${status}-${statusText}`, // 状态码
          duration, // 持续时间
          response, // 响应体
          params: args[0] || ''
        })
      }

      this.addEventListener('load', handleEvent('load'), false)
      this.addEventListener('error', handleEvent('error'), false)
      this.addEventListener('abort', handleEvent('abort'), false)
    }

    return originalSend.apply(this, args)
  }
}
