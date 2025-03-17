export interface LoonyWebAudioApi {
  connect(): void
  startRecording(socket: WebSocket): void
  stopRecording(): void
  getAudioUrl(): string
}
