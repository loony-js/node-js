// export default class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {
//   process(
//     inputs: Float32Array[][],
//     outputs: Float32Array[][],
//     parameters: Record<string, Float32Array>,
//   ): boolean {
//     const input = inputs[0]
//     if (input.length > 0) {
//       const channelData = input[0]
//       if (channelData) {
//         this.port.postMessage(channelData)
//       }
//     }
//     return true
//   }
// }

// registerProcessor("LoonyAudioWorkletProcessor", LoonyAudioWorkletProcessor)

class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.playing = false
    this.buffer = []
    this.bufferSize = 4096

    this.port.onmessage = (event) => {
      console.log(event.data)
      if (event.data === "start") this.playing = true
      if (event.data === "pause") this.playing = false
      if (event.data === "stop") {
        this.playing = false
        this.buffer = []
        this.port.postMessage("stopped")
      }
    }
  }

  process(inputs: Float32Array[][]) {
    if (!this.playing) return true

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
