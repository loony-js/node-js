/* eslint-disable @typescript-eslint/no-explicit-any */
// function Timer() {}

// Timer.prototype.clear = function (...args) {
//   this.name = "sankar"
//   console.log(this, args)
// }

// const x = new Timer()
// x.clear("hello", "sankar")

// Define the instance type
interface Tick {
  timers: Record<string, string>
  context: Record<string, string>
}

// Optionally define the prototype explicitly
Tick.prototype = {
  timers: {},
  context: {},
}

function Tick(this: Tick, context: Record<string, string>) {
  if (!(this instanceof Tick)) {
    return new (Tick as any)(context) // cast to 'any' to silence TS errors on 'new'
  }

  this.timers = {}
  this.context = context || (this as unknown as Record<string, string>)
}

const x = Tick({ name: "sankar" })
