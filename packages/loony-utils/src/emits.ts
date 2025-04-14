/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict"

/**
 * Returns a function that when invoked executes all the listeners of the
 * given event with the given arguments.
 *
 * @returns {Function} The function that emits all the things.
 * @api public
 */
export default function emits(self: { emit: any }, ...allArgs: string[]) {
  const parent = self
  //   let parser
  let i = 0
  const j = allArgs.length,
    args = new Array(j)

  for (i; i < j; i++) {
    args[i] = allArgs[i]
  }

  //
  // If the last argument is a function, assume that it's a parser.
  //
  if ("function" !== typeof args[j - 1])
    return function emitter() {
      let k = 0
      const l = allArgs.length
      const arg = new Array(l)
      for (k; k < l; k++) {
        arg[i] = allArgs[i]
      }

      return parent.emit.apply(self, args.concat(arg))
    }

  const parser = args.pop()

  /**
   * The actual function that emits the given event. It returns a boolean
   * indicating if the event was emitted.
   *
   * @returns {Boolean}
   * @api public
   */
  return function emitter() {
    let i = 0
    const l = allArgs.length
    let arg = new Array(l + 1)
    for (i; i < l; i++) {
      arg[i + 1] = allArgs[i]
    }

    /**
     * Async completion method for the parser.
     *
     * @param {Error} err Optional error when parsing failed.
     * @param {Mixed} returned Emit instructions.
     * @api private
     */
    arg[0] = function next(err: any, returned: any) {
      if (err) return parent.emit("error", err)

      arg =
        returned === undefined
          ? arg.slice(1)
          : returned === null
            ? []
            : returned

      parent.emit.apply(self, args.concat(arg))
    }

    parser.apply(self, arg)
    return true
  }
}
