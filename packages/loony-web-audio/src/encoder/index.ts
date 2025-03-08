export * from "./wav"

// Convert audio buffer to LINEAR16 PCM format (16-bit signed little-endian)
export async function convertToLINEAR16(audioBuffer: AudioBuffer) {
  const sampleRate = 16000
  const offlineContext = new OfflineAudioContext(
    1,
    audioBuffer.length,
    sampleRate,
  )
  const source: AudioBufferSourceNode = offlineContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(offlineContext.destination)
  source.start()

  const renderedBuffer = await offlineContext.startRendering()
  const pcmData = new Int16Array(renderedBuffer.length)

  for (let i = 0; i < renderedBuffer.length; i++) {
    pcmData[i] = Math.max(
      -32768,
      Math.min(32767, renderedBuffer.getChannelData(0)[i] * 32768),
    )
  }

  return pcmData.buffer // Send this buffer via WebSocket
}

/**
 *
 * This code snippet is a JavaScript function that converts a Float32Array containing floating-point
 * audio samples into a Int16Array suitable for use in systems that expect 16-bit signed integers (e.g., audio processing systems).
 *
 * @param {Float32Array} buffer - A `Float32Array` containing normalized audio samples in the range [-1.0, 1.0].
 * @returns {ArrayBufferLike} An `ArrayBuffer` containing the converted audio data in `Int16Array` format.
 *
 */
export function convertFloat32ToInt16(buffer: Float32Array): ArrayBufferLike {
  // The function divides the input buffer length by 3 and floors the result.
  // This effectively downsamples the data by taking every third sample.
  // This is likely done to reduce the size of the output buffer (e.g., for compression or lower resolution audio).
  const length = Math.floor(buffer.length / 3)

  // An Int16Array is created to store the converted values, with the calculated length.
  const int16Array = new Int16Array(length)

  // The loop processes every third sample of the input buffer (buffer[i * 3]).
  // Each value is multiplied by 32768 to scale it from the range [-1.0, 1.0] (float) to [-32768, 32767] (16-bit integer range).
  // Clamping is done using Math.max(-32768, Math.min(32767, ...)) to ensure the value stays within the valid range of a signed 16-bit integer.
  for (let i = 0; i < length; i++) {
    int16Array[i] = Math.max(-32768, Math.min(32767, buffer[i * 3] * 32768))
  }

  return int16Array.buffer
}

export function int8ToInt16(int8Array: number[]) {
  const int16Array = new Int16Array(int8Array.length) // Create an Int16Array with the same length

  for (let i = 0; i < int8Array.length; i++) {
    int16Array[i] = int8Array[i] * 256 // Scale the value (Int8 to Int16)
  }

  return int16Array
}
