export interface LoonyWebAudioApi {
  startRecording(socket: WebSocket): void
  stopRecording(): void
  getAudioUrl(): string
}
