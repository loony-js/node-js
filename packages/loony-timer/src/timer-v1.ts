"use strict"

const has = Object.prototype.hasOwnProperty
/**
 * Timer instance.
 *
 * @constructor
 * @param {Object} timer New timer instance.
 * @param {Function} clear Clears the timer instance.
 * @param {Function} duration Duration of the timer.
 * @param {Function} fn The functions that need to be executed.
 * @api private
 */

type TimeoutId = NodeJS.Timeout | string | number | undefined
type IntervalId = TimeoutId
type ImmediateId = NodeJS.Immediate | undefined

// type ClearFn = ((id: NodeJS.Timeout) => void) | ((id: NodeJS.Immediate) => void)
type ClearFn = (id: TimeoutId | IntervalId | ImmediateId) => void

class Timer {
  start: number
  duration: number
  timer: NodeJS.Timeout | NodeJS.Immediate
  clear: ClearFn
  fns: VoidFunction[]

  constructor(
    timer: NodeJS.Timeout | NodeJS.Immediate,
    clear: ClearFn,
    duration: number,
    fn: VoidFunction,
  ) {
    this.start = +new Date()
    this.duration = duration
    this.clear = clear
    this.timer = timer
    this.fns = [fn]
  }

  remaining() {
    return this.duration - this.taken()
  }

  taken() {
    return +new Date() - this.start
  }

  // clearShit(id: NodeJS.Timeout | NodeJS.Immediate) {
  //   if ("_onImmediate" in id) {
  //     this.clear(this.timer as NodeJS.Immediate)
  //   } else {
  //     clearTimeout(id as NodeJS.Timeout)
  //   }
  // }
}

/**
 * Calculate the time left for a given timer.
 *
 * @returns {Number} Time in milliseconds.
 * @api public
 */
// Timer.prototype.remaining = function remaining() {
//   return this.duration - this.taken()
// }

/**
 * Calculate the amount of time it has taken since we've set the timer.
 *
 * @returns {Number}
 * @api public
 */
// Timer.prototype.taken = function taken() {
//   return +new Date() - this.start
// }

/**
 * Custom wrappers for the various of clear{whatever} functions. We cannot
 * invoke them directly as this will cause thrown errors in Google Chrome with
 * an Illegal Invocation Error
 *
 * @see #2
 * @type {Function}
 * @api private
 */

function unsetTimeout(id: TimeoutId | IntervalId | ImmediateId) {
  clearTimeout(id as TimeoutId)
}
function unsetInterval(id: IntervalId | TimeoutId | ImmediateId) {
  clearInterval(id as IntervalId)
}
function unsetImmediate(id: ImmediateId | TimeoutId | IntervalId) {
  clearImmediate(id as ImmediateId)
}

/**
 * Simple timer management.
 *
 * @constructor
 * @param {Mixed} context Context of the callbacks that we execute.
 * @api public
 */
class Tick {
  timers: null | Record<string, Timer> = {}
  context: null | Record<string, string>
  start: number | undefined

  constructor(context: Record<string, string>) {
    this.context = context || (this as Tick)
    this.timers = {}
  }

  tock(name: string, clear: boolean) {
    return () => {
      if (!this.timers) return
      if (!(name in this.timers)) return

      const timer = this.timers[name]
      const fns = timer.fns.slice()
      const l = fns.length
      let i = 0

      if (clear) this.clear(name)
      else this.start = +new Date()

      for (; i < l; i++) {
        fns[i].call(this.context)
      }
    }
  }

  setTimeout(name: string, fn: VoidFunction, time: number) {
    if (!this.timers) return
    if (this.timers[name]) {
      this.timers[name].fns.push(fn)
      return this
    }

    this.timers[name] = new Timer(
      setTimeout(this.tock(name, true), time),
      unsetTimeout,
      time,
      fn,
    )

    return this
  }

  setInterval(name: string, fn: VoidFunction, time: number) {
    if (!this.timers) return
    if (this.timers[name]) {
      this.timers[name].fns.push(fn)
      return this
    }

    this.timers[name] = new Timer(
      setInterval(this.tock(name, false), time),
      unsetInterval,
      time,
      fn,
    )

    return this
  }

  setImmediate(name: string, fn: VoidFunction) {
    if (!this.timers) return
    if ("function" !== typeof setImmediate) return this.setTimeout(name, fn, 0)

    if (this.timers[name]) {
      this.timers[name].fns.push(fn)
      return this
    }

    this.timers[name] = new Timer(
      setImmediate(this.tock(name, true)),
      unsetImmediate,
      0,
      fn,
    )

    return this
  }

  active(name: string) {
    if (!this.timers) return
    return name in this.timers
  }

  clear(...args: string[]) {
    if (!this.timers) return

    let i, l, timer

    if (args.length === 1 && "string" === typeof args[0]) {
      args = args[0].split(/[, ]+/)
    }
    if (!args.length) {
      for (timer in this.timers) {
        if (has.call(this.timers, timer)) args.push(timer)
      }
    }
    for (i = 0, l = args.length; i < l; i++) {
      const timer = this.timers[args[i]]
      if (!timer) continue
      timer.clear(timer.timer)

      // :TODO
      // timer.fns = [];
      // timer.timer = timer.clear = null

      delete this.timers[args[i]]
    }
    return this
  }

  adjust(name: string, time: number) {
    if (!this.timers) return

    const tock = time
    const timer = this.timers[name]

    if (!timer) return this

    const interval = timer.clear === unsetInterval
    timer.clear(timer.timer)
    timer.start = +new Date()
    timer.duration = tock
    timer.timer = (interval ? setInterval : setTimeout)(
      this.tock(name, !interval),
      tock,
    )

    return this
  }

  end() {
    if (!this.context) return false

    this.clear()
    this.context = this.timers = null

    return true
  }

  destroy() {
    this.end()
  }
}

// function Tick(
//   this: { timers: Record<string, string>; context: Record<string, string> },
//   context: Record<string, string>,
// ) {
//   if (!(this instanceof Tick)) return new Tick(context)

//   this.timers = {}
//   this.context = context || this
// }

/**
 * Return a function which will just iterate over all assigned callbacks and
 * optionally clear the timers from memory if needed.
 *
 * @param {String} name Name of the timer we need to execute.
 * @param {Boolean} clear Also clear from memory.
 * @returns {Function}
 * @api private
 */
// Tick.prototype.tock = function ticktock(name, clear) {
//   var tock = this

//   return function tickedtock() {
//     if (!(name in tock.timers)) return

//     var timer = tock.timers[name],
//       fns = timer.fns.slice(),
//       l = fns.length,
//       i = 0

//     if (clear) tock.clear(name)
//     else timer.start = +new Date()

//     for (; i < l; i++) {
//       fns[i].call(tock.context)
//     }
//   }
// }

/**
 * Add a new timeout.
 *
 * @param {String} name Name of the timer.
 * @param {Function} fn Completion callback.
 * @param {Mixed} time Duration of the timer.
 * @returns {Tick}
 * @api public
 */
// Tick.prototype.setTimeout = function timeout(name, fn, time) {
//   var tick = this,
//     tock

//   if (tick.timers[name]) {
//     tick.timers[name].fns.push(fn)
//     return tick
//   }

//   tock = ms(time)
//   tick.timers[name] = new Timer(
//     setTimeout(tick.tock(name, true), tock),
//     unsetTimeout,
//     tock,
//     fn,
//   )

//   return tick
// }

/**
 * Add a new interval.
 *
 * @param {String} name Name of the timer.
 * @param {Function} fn Completion callback.
 * @param {Mixed} time Interval of the timer.
 * @returns {Tick}
 * @api public
 */
// Tick.prototype.setInterval = function interval(name, fn, time) {
//   var tick = this,
//     tock

//   if (tick.timers[name]) {
//     tick.timers[name].fns.push(fn)
//     return tick
//   }

//   tock = ms(time)
//   tick.timers[name] = new Timer(
//     setInterval(tick.tock(name), tock),
//     unsetInterval,
//     tock,
//     fn,
//   )

//   return tick
// }

/**
 * Add a new setImmediate.
 *
 * @param {String} name Name of the timer.
 * @param {Function} fn Completion callback.
 * @returns {Tick}
 * @api public
 */
// Tick.prototype.setImmediate = function immediate(name, fn) {
//   var tick = this

//   if ("function" !== typeof setImmediate) return tick.setTimeout(name, fn, 0)

//   if (tick.timers[name]) {
//     tick.timers[name].fns.push(fn)
//     return tick
//   }

//   tick.timers[name] = new Timer(
//     setImmediate(tick.tock(name, true)),
//     unsetImmediate,
//     0,
//     fn,
//   )

//   return tick
// }

/**
 * Check if we have a timer set.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api public
 */
// Tick.prototype.active = function active(name) {
//   return name in this.timers
// }

/**
 * Properly clean up all timeout references. If no arguments are supplied we
 * will attempt to clear every single timer that is present.
 *
 * @param {Arguments} ..args.. The names of the timeouts we need to clear
 * @returns {Tick}
 * @api public
 */
// Tick.prototype.clear = function (...args: string[]) {
//   const tick = typeof globalThis
//   let i, l

//   //   tick = this,
//   //   timer,
//   //   i,
//   //   l
//   if (args.length === 1 && "string" === typeof args[0]) {
//     args = args[0].split(/[, ]+/)
//   }
//   if (!args.length) {
//     for (timer in tick.timers) {
//       if (has.call(tick.timers, timer)) args.push(timer)
//     }
//   }
//   for (i = 0, l = args.length; i < l; i++) {
//     timer = tick.timers[args[i]]
//     if (!timer) continue
//     timer.clear(timer.timer)
//     timer.fns = timer.timer = timer.clear = null
//     delete tick.timers[args[i]]
//   }
//   return tick
// }

/**
 * Adjust a timeout or interval to a new duration.
 *
 * @returns {Tick}
 * @api public
 */
// Tick.prototype.adjust = function adjust(name: string, time: number) {
//   const tick = this

//   let interval
//   const tock = time
//   const timer = tick.timers[name]

//   if (!timer) return tick

//   interval = timer.clear === unsetInterval
//   timer.clear(timer.timer)
//   timer.start = +new Date()
//   timer.duration = tock
//   timer.timer = (interval ? setInterval : setTimeout)(
//     tick.tock(name, !interval),
//     tock,
//   )

//   return tick
// }

/**
 * We will no longer use this module, prepare your self for global cleanups.
 *
 * @returns {Boolean}
 * @api public
 */
Tick.prototype.end = Tick.prototype.destroy = function end() {
  if (!this.context) return false

  this.clear()
  this.context = this.timers = null

  return true
}

export { Tick, Timer }
