import userAgent from 'user-agent'

// 注意下面改成自己的信息(https://sls.console.aliyun.com/lognext/profile)
const host = 'cn-guangzhou.log.aliyuncs.com'
const project = 'pf-front-monitor'
const logStore = 'pf-front-monitor-store'

interface ExtraData {
  title: string
  url: string
  timestamp: number
  userAgent: string // 用户ID
  [key: string]: string | number
}

function getExtraData(): ExtraData {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name
  }
}

// gif图片上传 图片速度 快 没有跨域问题
class SendTracker {
  private url: string
  private xhr: XMLHttpRequest

  constructor() {
    this.url = `http://${project}.${host}/logstores/${logStore}/track`
    this.xhr = new XMLHttpRequest()
  }

  send(data: Record<string, any> = {}): void {
    const extraData = getExtraData()
    const log = { ...extraData, ...data }

    // 对象的值不能是数字
    for (const key in log) {
      if (typeof log[key] === 'number') {
        log[key] = `${log[key]}`
      }
    }

    console.log('log', log)
    const body = JSON.stringify({
      __logs__: [log]
    })

    this.xhr.open('POST', this.url, true)
    this.xhr.setRequestHeader('Content-Type', 'application/json')
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0')
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length.toString())

    this.xhr.send(body)
  }
}

export default new SendTracker()
