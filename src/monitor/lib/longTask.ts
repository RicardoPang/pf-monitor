import formatTime from '../utils/formatTime'
import getLastEvent from '../utils/getLastEvent'
import getSelector, { getEventPath } from '../utils/getSelector'
import tracker from '../utils/tracker'

interface LongTaskDetails {
  kind: 'experience'
  type: 'longTask'
  eventType: string
  startTime: string
  duration: string
  selector: string
}

const LONG_TASK_THRESHOLD = 100 // ms

export function longTask(): void {
  const observer = new PerformanceObserver(handleLongTasks)
  observer.observe({ entryTypes: ['longtask'] })
}

function handleLongTasks(list: PerformanceObserverEntryList): void {
  list
    .getEntries()
    .filter((entry) => entry.duration > LONG_TASK_THRESHOLD)
    .forEach(reportLongTask)
}

function reportLongTask(entry: PerformanceEntry): void {
  const lastEvent = getLastEvent()
  const taskDetails = createLongTaskDetails(entry, lastEvent)

  requestIdleCallback(() => tracker.send(taskDetails))
}

function createLongTaskDetails(
  entry: PerformanceEntry,
  lastEvent: Event | undefined
): LongTaskDetails {
  return {
    kind: 'experience',
    type: 'longTask',
    eventType: lastEvent?.type || '',
    startTime: formatTime(entry.startTime),
    duration: formatTime(entry.duration),
    selector: lastEvent
      ? getSelector(getEventPath(lastEvent) || lastEvent.target)
      : ''
  }
}
