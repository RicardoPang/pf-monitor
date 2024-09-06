import tracker from '../utils/tracker'
import onload from '../utils/onload'

type ElementSelector = string
const wrapperElements: ElementSelector[] = [
  'html',
  'body',
  '#container',
  '.content'
]
let emptyPoints = 0

/**
 * 根据元素生成选择器
 */
function getElementSelector(element: Element): ElementSelector {
  if (element.id) {
    return `#${element.id}`
  } else if (element.className) {
    return `.${element.className.split(' ').filter(Boolean).join('.')}`
  } else {
    return element.nodeName.toLowerCase()
  }
}

/**
 * 判断元素是否为 wrapper 元素
 */
function isWrapperElement(element: Element): void {
  const selector = getElementSelector(element)
  if (wrapperElements.includes(selector)) {
    emptyPoints++
  }
}

/**
 * 获取页面的空白区域检测点
 */
function checkScreenPoints(): void {
  const width = window.innerWidth
  const height = window.innerHeight

  for (let i = 1; i <= 9; i++) {
    const xElements = document.elementsFromPoint((width * i) / 10, height / 2)
    const yElements = document.elementsFromPoint(width / 2, (height * i) / 10)
    isWrapperElement(xElements[0])
    isWrapperElement(yElements[0])
  }
}

/**
 * 发送白屏检测数据
 * screen.width  屏幕的宽度   screen.height 屏幕的高度
 * window.innerWidth 去除工具条与滚动条的窗口宽度 window.innerHeight 去除工具条与滚动条的窗口高度
 */
function reportBlankScreen(): void {
  if (emptyPoints >= 18) {
    const centerElement = document.elementsFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    )[0]
    tracker.send({
      kind: 'stability',
      type: 'blank',
      emptyPoints, // 空白点
      screen: `${window.screen.width}X${window.screen.height}`, // 分辨率
      viewPoint: `${window.innerWidth}X${window.innerHeight}`, // 视口
      selector: getElementSelector(centerElement) // 选择器
    })
  }
}

/**
 * 初始化白屏检测
 * 垂直水平线设置18个点, 如果点都是document或body就是白屏
 */
export function blankScreen(): void {
  onload(() => {
    checkScreenPoints()
    reportBlankScreen()
  })
}
