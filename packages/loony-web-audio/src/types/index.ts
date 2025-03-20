export interface VoiceRecorder {
  startRecording(socket: WebSocket): void
  stopRecording(): void
  getAudioUrl(): string
}
