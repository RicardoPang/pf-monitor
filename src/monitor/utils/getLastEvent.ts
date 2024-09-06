type EventType = 'click' | 'touchstart' | 'mousedown' | 'keydown' | 'mouseover'

let lastEvent: Event | undefined

const eventTypes: EventType[] = [
  'click',
  'touchstart',
  'mousedown',
  'keydown',
  'mouseover'
]

const handleEvent = (event: Event): void => {
  lastEvent = event
}

const addEventListeners = (eventTypes: EventType[]): void => {
  eventTypes.forEach((eventType) => {
    document.addEventListener(eventType, handleEvent, {
      capture: true, // 捕获阶段
      passive: true // 默认不阻止默认事件
    })
  })
}

addEventListeners(eventTypes)

export default function getLastEvent(): Event | undefined {
  return lastEvent
}
