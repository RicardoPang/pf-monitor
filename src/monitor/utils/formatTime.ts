/**
 * 通过删除任何小数点来格式化时间值
 * @param time - 要格式化的时间值。可以是数字还是字符串.
 * @returns 时间的字符串表示形式，不带小数点.
 */
export function formatTime(time: number | string): string {
  return String(time).split('.')[0]
}

export default formatTime
