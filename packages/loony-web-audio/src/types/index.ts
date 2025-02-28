export interface LoonyWebAudioApi {
    connect(): void;
    socketConnect(socket: WebSocket): void;
    disconnect(): void;
    getAudioUrl(): string;
}