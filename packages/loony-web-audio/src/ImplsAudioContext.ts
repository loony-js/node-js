import { LoonyWebAudioApi } from "./types"
import { encodeWAV, convertFloat32ToInt16 } from "./encoder"

export class ImplsAudioContext implements LoonyWebAudioApi {
  private micStream: MediaStream
  private audioContext: AudioContext
  private mediaStreamAudioSourceNode: undefined | MediaStreamAudioSourceNode
  private audioWorkletNode: undefined | AudioWorkletNode
  private buffer: number[] = []

  constructor(micStream: MediaStream, audioContext: AudioContext) {
    this.micStream = micStream
    this.audioContext = audioContext
    this.mediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(
      this.micStream,
    )

    this.audioWorkletNode = new AudioWorkletNode(
      this.audioContext,
      "LoonyAudioWorkletProcessor",
    )

    this.mediaStreamAudioSourceNode
      ?.connect(this.audioWorkletNode)
      .connect(this.audioContext.destination)
  }

  static async create() {
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: { sampleRate: 16000, channelCount: 2 },
      video: false,
    })

    const audioContext = new AudioContext()
    const blob = new Blob([preProcessor], { type: "application/javascript" })
    const moduleURL = URL.createObjectURL(blob)
    await audioContext.audioWorklet.addModule(moduleURL)

    return new ImplsAudioContext(micStream, audioContext)
  }

  destroy() {
    this.mediaStreamAudioSourceNode?.disconnect()
    this.audioContext.close()
  }

  startRecording(socket: WebSocket) {
    if (this.audioWorkletNode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let payload: any = []
      this.audioWorkletNode.port.onmessage = (
        event: MessageEvent<Float32Array>,
      ) => {
        // console.log(payload.length)
        if (payload.length >= 6000) {
          const __data = convertFloat32ToInt16(payload)
          socket.send(__data)
          payload = []
          payload.push(...event.data)
        } else {
          payload.push(...event.data)
        }
        this.buffer.push(...event.data)
      }
      this.audioWorkletNode.port.postMessage("start")
    }
  }

  stopRecording() {
    if (this.audioWorkletNode) {
      // this.mediaStreamAudioSourceNode?.disconnect()
      // this.audioContext.close()
      this.audioWorkletNode.port.postMessage("stop")
    }
  }

  getAudioUrl() {
    const audioBlob = new Blob([encodeWAV(this.buffer, 44100)], {
      type: "audio/wav",
    })
    const audioUrl = URL.createObjectURL(audioBlob)
    return audioUrl
  }
}

const preProcessor = `class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {

    constructor() {
      super();
      this.playing = false;
      this.port.onmessage = (event) => {
      console.log(event.data)
        if (event.data === 'start') this.playing = true;
        if (event.data === 'pause') this.playing = false;
        if (event.data === 'stop') {
          this.playing = false;
          this.port.postMessage('stopped'); // Notify main thread
        }
      }
    }
      
    process(inputs, outputs, parameters) {
        if (!this.playing) return true; // Keep processor alive but do nothing

      const input = inputs[0];
      if (input.length > 0) {
        this.port.postMessage(input[0]);
      }
      return true;
    }
}
  
registerProcessor('LoonyAudioWorkletProcessor', LoonyAudioWorkletProcessor);`
