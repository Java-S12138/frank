type ThrottleFunction = (...args: any[]) => void

export function throttle(fn: ThrottleFunction, delay: number): ThrottleFunction {
  let lastExecutionTime = 0

  return function (...args: any[]) {
    const currentTime = Date.now()

    if (currentTime - lastExecutionTime >= delay) {
      // 超过指定的延迟时间，执行函数
      // @ts-ignore
      fn.apply(this, args)
      lastExecutionTime = currentTime
    }
  };
}
