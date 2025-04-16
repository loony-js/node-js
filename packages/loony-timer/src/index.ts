class Timer {
  id: number
  fn: VoidFunction
  timer?: NodeJS.Timeout | NodeJS.Immediate
  start: number
  duration: number

  constructor(id: number, fn: VoidFunction, duration: number) {
    this.id = id
    this.fn = fn
    this.duration = duration
    this.start = +new Date()
  }
  run() {
    const time: NodeJS.Timeout = setTimeout(this.fn, this.duration)
    this.timer = time
  }

  remaining() {
    return this.duration - this.taken()
  }

  taken() {
    return +new Date() - this.start
  }
}

class Tick {
  timers: Record<number, Timer>
  constructor() {
    this.timers = {}
  }

  setTimeout(id: number, fn: VoidFunction, time: number) {
    const newTimer = new Timer(id, fn, time)
    this.timers[id] = newTimer
    newTimer.run()
  }

  clear(id: number) {
    const currentTimer = this.timers[id]
    clearTimeout(currentTimer.id)
  }

  check() {}
}

export { Timer, Tick }
