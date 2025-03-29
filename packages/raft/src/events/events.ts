import EventEmitter from "events"

// Create a new emitter instance
const myEmitter = new EventEmitter()

// Register an event listener
myEmitter.on("greet", () => {
  console.log("Hello there!")
})

// Emit the event
myEmitter.emit("greet") // Output: "Hello there!"
