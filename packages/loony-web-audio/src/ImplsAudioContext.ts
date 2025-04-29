import { encodeWAV, convertFloat32ToInt16 } from "./encoder"

export const getVoiceRecorder = async (
  mediaStreamConstraints: MediaStreamConstraints | undefined,
) => {
  return VoiceRecorder.create(mediaStreamConstraints)
}

export class VoiceRecorder {
  private micStream: MediaStream
  private audioContext: AudioContext | null
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

  static async create(
    mediaStreamConstraints: MediaStreamConstraints | undefined,
  ) {
    const constraints = mediaStreamConstraints || {
      audio: { sampleRate: 16000, channelCount: 2 },
      video: false,
    }
    const micStream = await navigator.mediaDevices.getUserMedia(constraints)

    const audioContext = new AudioContext()
    const blob = new Blob([preProcessor], { type: "application/javascript" })
    const moduleURL = URL.createObjectURL(blob)
    await audioContext.audioWorklet.addModule(moduleURL)

    return new VoiceRecorder(micStream, audioContext)
  }

  destroy() {
    this.audioContext?.close()
  }

  startRecordingWithSocket(socket: WebSocket) {
    if (this.audioWorkletNode) {
      this.audioWorkletNode.port.onmessage = (
        event: MessageEvent<Float32Array>,
      ) => {
        socket.send(convertFloat32ToInt16(event.data))
        this.buffer.push(...event.data)
      }
      this.audioWorkletNode.port.postMessage("start")
    }
  }

  startRecording() {
    if (this.audioWorkletNode) {
      this.audioWorkletNode.port.onmessage = (
        event: MessageEvent<Float32Array>,
      ) => {
        this.buffer.push(...event.data)
      }
      this.audioWorkletNode.port.postMessage("start")
    }
  }

  stopRecording() {
    if (this.audioWorkletNode) {
      this.audioContext?.suspend()
    }
  }

  getAudioUrl() {
    const audioBlob = new Blob([encodeWAV(this.buffer, 44100)], {
      type: "audio/wav",
    })
    const audioUrl = URL.createObjectURL(audioBlob)
    console.log(audioUrl)
    return audioUrl
  }
}

const preProcessor = `class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.playing = false
    this.buffer = []
    this.bufferSize = 4096

    this.port.onmessage = (event) => {
      if (event.data === "start") {
        this.playing = true
      }
      if (event.data === "pause") {
        this.playing = false
      }
      if (event.data === "stop") {
        this.playing = false
        this.buffer = []
        this.port.postMessage("stopped")
      }
    }
  }

  process(inputs) {
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

registerProcessor("LoonyAudioWorkletProcessor", LoonyAudioWorkletProcessor)`
