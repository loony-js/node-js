class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {
  playing: boolean
  buffer: number[]
  bufferSize: number

  constructor() {
    super()
    this.playing = false
    this.buffer = []
    this.bufferSize = 4096

    this.port.onmessage = (event) => {
      if (event.data === "start") {
        this.port.start()
        this.playing = true
      }
      if (event.data === "pause") {
        this.playing = false
      }
      if (event.data === "stop") {
        this.playing = false
        this.buffer = []
        this.port.postMessage("stopped")
        this.port.close()
      }
    }
  }

  process(inputs: Float32Array[][]) {
    if (!this.playing) {
      return true
    }

    const input = inputs[0]
    if (input.length > 0) {
      this.buffer.push(...input[0])

      if (this.buffer.length >= this.bufferSize) {
        this.port.postMessage(this.buffer.slice(0, this.bufferSize))
        this.buffer = this.buffer.slice(this.bufferSize)
      }
    }
    return true
  }
}

registerProcessor("LoonyAudioWorkletProcessor", LoonyAudioWorkletProcessor)
