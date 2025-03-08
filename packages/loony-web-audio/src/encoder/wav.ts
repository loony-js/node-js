/**
 * The WAV header is written in a specific format:
 *
 * | Field Name      | Byte Offset | Description                                  |
 * | --------------- | ----------- | -------------------------------------------- |
 * | `"RIFF"`        | `0`         | Indicates it's a RIFF file.                  |
 * | File Size       | `4`         | Total file size minus 8 bytes.               |
 * | `"WAVE"`        | `8`         | Identifies file as a WAV.                    |
 * | `"fmt "`        | `12`        | Subchunk for format data.                    |
 * | Subchunk Size   | `16`        | Length of format data (16 for PCM).          |
 * | Audio Format    | `20`        | 1 for PCM (uncompressed audio).              |
 * | Num Channels    | `22`        | Number of audio channels (1 = mono).         |
 * | Sample Rate     | `24`        | Samples per second (e.g., 44100).            |
 * | Byte Rate       | `28`        | `sampleRate * numChannels * bytesPerSample`. |
 * | Block Align     | `32`        | `numChannels * bytesPerSample`.              |
 * | Bits per Sample | `34`        | Number of bits per sample (e.g., 16).        |
 * | `"data"`        | `36`        | Subchunk for audio data.                     |
 * | Data Size       | `40`        | Total size of the audio data.                |
 */
export function encodeWAV(audioBuffer: number[], sampleRate: number) {
  const numChannels = 1 // Assuming mono
  const sampleBits = 16 // 16-bit PCM

  const buffer = new ArrayBuffer(44 + audioBuffer.length * 2)
  const view = new DataView(buffer)

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  function writePCM(offset: number, buffer: number[]) {
    for (let i = 0; i < buffer.length; i++) {
      const sample = Math.max(-1, Math.min(1, buffer[i]))
      view.setInt16(
        offset + i * 2,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      )
    }
  }

  // WAV header
  writeString(0, "RIFF")
  view.setUint32(4, 36 + audioBuffer.length * 2, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * 2, true)
  view.setUint16(32, numChannels * 2, true)
  view.setUint16(34, sampleBits, true)
  writeString(36, "data")
  view.setUint32(40, audioBuffer.length * 2, true)

  // Write PCM data
  writePCM(44, audioBuffer)

  return buffer
}
