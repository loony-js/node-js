/**
 * Converts a `Float32Array` of normalized audio samples to a `Int16Array`.
 * The function scales the input samples from the range [-1.0, 1.0] to the range of 16-bit signed integers [-32768, 32767].
 * Every third sample from the input buffer is taken to create the output array.
 *
 * @param {Float32Array} buffer - A `Float32Array` containing normalized audio samples in the range [-1.0, 1.0].
 * @returns {ArrayBuffer} An `ArrayBuffer` containing the converted audio data in `Int16Array` format.
 * 
 * 
 * @example
 * const buffer = new Float32Array([0.5, -0.5, 0.0]);
 * const result = convertFloat32ToInt16(buffer);
 * console.log(result); // Logs the converted Int16Array buffer.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array
 * 
 * @throws {Error} Throws an error if the input buffer is empty.
 */