import { LoonyWebAudioApi } from './types'
import { encodeWAV, convertFloat32ToInt16 } from './encoder'

export class ImplsAudioContext implements LoonyWebAudioApi {
    
    private micStream: MediaStream;
    private audioContext: AudioContext;
    private mediaStreamAudioSourceNode: undefined | MediaStreamAudioSourceNode;
    private audioWorkletNode: undefined | AudioWorkletNode;
    private buffer: Float32Array[] = []

    constructor(micStream: MediaStream, audioContext: AudioContext) {
        this.micStream = micStream
        this.audioContext = audioContext;
        this.mediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(this.micStream);
        this.audioWorkletNode = new AudioWorkletNode(
            this.audioContext,
            'LoonyAudioWorkletProcessor');
    }

    static async create() {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 }, video: false });

        const audioContext = new AudioContext();
        const blob = new Blob([preProcessor], { type: 'application/javascript' });
        const moduleURL = URL.createObjectURL(blob);
        await audioContext
            .audioWorklet
            .addModule(moduleURL);

        return new ImplsAudioContext(micStream, audioContext);
    }

    connect() {
        if (this.audioWorkletNode) {
            this.audioWorkletNode.port.onmessage = (event: MessageEvent<any>) => {
                this.buffer.push(...event.data)
            };
            this.mediaStreamAudioSourceNode?.connect(this.audioWorkletNode).connect(this.audioContext.destination)
            this.audioWorkletNode.port.postMessage({ command: 'start' });
        }
    }

    socketConnect(socket: WebSocket) {
        if (this.audioWorkletNode) {
            this.audioWorkletNode.port.onmessage = (event: MessageEvent<any>) => {
                const x = convertFloat32ToInt16(event.data)
                socket.send(x);
            };
            this.mediaStreamAudioSourceNode?.connect(this.audioWorkletNode).connect(this.audioContext.destination)
            this.audioWorkletNode.port.postMessage({ command: 'start' });
        }
    }

    disconnect() {
        if (this.audioWorkletNode) {
            this.mediaStreamAudioSourceNode?.disconnect()
            this.audioContext.close()
            this.audioWorkletNode.port.postMessage({ command: 'stop' });
        }
    }

    getAudioUrl() {
        const audioBlob = new Blob([encodeWAV(this.buffer as Float32Array[], 44100)], {
            type: 'audio/wav',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl
    }
}

const preProcessor = `class LoonyAudioWorkletProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input.length > 0) {
        const channelData = input[0];
        if (channelData) {
          this.port.postMessage(channelData);
        }
      }
      return true;
    }
}
  
registerProcessor('LoonyAudioWorkletProcessor', LoonyAudioWorkletProcessor);`