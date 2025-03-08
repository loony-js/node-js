export default class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean {
    const input = inputs[0]
    if (input.length > 0) {
      const channelData = input[0]
      if (channelData) {
        this.port.postMessage(channelData)
      }
    }
    return true
  }
}

registerProcessor("LoonyAudioWorkletProcessor", LoonyAudioWorkletProcessor)
