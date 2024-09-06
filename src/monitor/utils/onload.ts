export default function onload(callback: () => void) {
  if (document.readyState === 'complete') {
    callback()
  } else {
    window.addEventListener('load', callback)
  }
}
