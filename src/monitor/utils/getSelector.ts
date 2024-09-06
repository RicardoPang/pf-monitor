export default function getSelector(
  pathsOrTarget: HTMLElement | HTMLElement[]
): string {
  if (Array.isArray(pathsOrTarget)) {
    // 可能是数组
    return getSelectors(pathsOrTarget)
  } else {
    // 也有可能是对象
    const path: HTMLElement[] = []
    let current: HTMLElement | null = pathsOrTarget
    while (current) {
      path.push(current)
      current = current.parentNode as HTMLElement
    }
    return getSelectors(path)
  }
}

function getSelectors(path: HTMLElement[]): string {
  return path
    .reverse()
    .filter((element) => {
      return !(element instanceof Document) && !(element instanceof Window)
    })
    .map((element) => {
      let selector = ''
      if (element.id) {
        return `${element.tagName.toLowerCase()}#${element.id}`
      } else if (element.className) {
        return `${element.tagName.toLowerCase()}.${element.className}`
      } else {
        selector = element.tagName.toLowerCase()
      }
      return selector
    })
    .join(' ')
}

export function getEventPath(event: Event): HTMLElement[] {
  const path = []
  let currentElement: HTMLElement | null = event.target as HTMLElement

  while (currentElement) {
    path.push(currentElement)
    currentElement = currentElement.parentElement
  }
  return path
}
