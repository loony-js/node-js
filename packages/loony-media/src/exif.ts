import { Image, Photo, Iop, GPSInfo } from "./tags"

module.exports = function (buffer: Buffer) {
  let startingOffset = 0
  if (
    buffer.toString("ascii", 0, 3) !== "MM\0" &&
    buffer.toString("ascii", 0, 3) !== "II\x2a"
  ) {
    startingOffset = 6
    if (buffer.toString("ascii", 0, 5) !== "Exif\0")
      throw new Error(
        'Invalid EXIF data: buffer should start with "Exif", "MM" or "II".',
      )
  }

  let bigEndian = null
  if (buffer[startingOffset] === 0x49 && buffer[startingOffset + 1] === 0x49)
    bigEndian = false
  else if (
    buffer[startingOffset] === 0x4d &&
    buffer[startingOffset + 1] === 0x4d
  )
    bigEndian = true
  else throw new Error("Invalid EXIF data: expected byte order marker.")

  if (
    buffer.length < startingOffset + 4 ||
    readUInt16(buffer, startingOffset + 2, bigEndian) !== 0x002a
  )
    throw new Error("Invalid EXIF data: expected 0x002A.")

  if (buffer.length <= startingOffset + 8) {
    throw new Error("Invalid EXIF data: Ends before ifdOffset")
  }
  let ifdOffset =
    readUInt32(buffer, startingOffset + 4, bigEndian) + startingOffset
  if (ifdOffset < 8) throw new Error("Invalid EXIF data: ifdOffset < 8")

  const result = { bigEndian }
  result.Image = readTags(
    buffer,
    ifdOffset,
    bigEndian,
    tags.Image,
    startingOffset,
  )

  if (buffer.length >= ifdOffset + 2) {
    let numEntries = readUInt16(buffer, ifdOffset, bigEndian)
    if (buffer.length >= ifdOffset + 2 + numEntries * 12 + 4) {
      ifdOffset = readUInt32(buffer, ifdOffset + 2 + numEntries * 12, bigEndian)
      if (ifdOffset !== 0)
        result.Thumbnail = readTags(
          buffer,
          ifdOffset + startingOffset,
          bigEndian,
          tags.Image,
          startingOffset,
        )
    }
  }

  if (result.Image) {
    if (isPositiveInteger(result.Image.ExifTag))
      result.Photo = readTags(
        buffer,
        result.Image.ExifTag + startingOffset,
        bigEndian,
        tags.Photo,
        startingOffset,
      )

    if (isPositiveInteger(result.Image.GPSTag))
      result.GPSInfo = readTags(
        buffer,
        result.Image.GPSTag + startingOffset,
        bigEndian,
        tags.GPSInfo,
        startingOffset,
      )
  }
  if (result.Photo && isPositiveInteger(result.Photo.InteroperabilityTag)) {
    result.Iop = readTags(
      buffer,
      result.Photo.InteroperabilityTag + startingOffset,
      bigEndian,
      tags.Iop,
      startingOffset,
    )
  }

  return result
}

const DATE_KEYS = {
  DateTimeOriginal: true,
  DateTimeDigitized: true,
  DateTime: true,
}

function readTags(
  buffer: Buffer,
  offset: number,
  bigEndian,
  tags,
  startingOffset: number,
) {
  if (buffer.length < offset + 2) {
    return null
  }
  let numEntries = readUInt16(buffer, offset, bigEndian)
  offset += 2

  let res = {}
  for (let i = 0; i < numEntries; i++) {
    if (buffer.length >= offset + 2) {
      let tag = readUInt16(buffer, offset, bigEndian)
    } else {
      return null
    }
    offset += 2

    let key = tags[tag] || tag
    let val = readTag(buffer, offset, bigEndian, startingOffset)

    if (key in DATE_KEYS) val = parseDate(val)

    res[key] = val
    offset += 10
  }

  return res
}

const SIZE_LOOKUP = [1, 1, 2, 4, 8, 1, 1, 2, 4, 8]

function readTag(buffer: Buffer, offset: number, bigEndian, startingOffset) {
  if (buffer.length < offset + 7) {
    return null
  }
  let type = readUInt16(buffer, offset, bigEndian)

  // Exit early in case of unknown or bogus type
  if (!type || type > SIZE_LOOKUP.length) return null

  let numValues = readUInt32(buffer, offset + 2, bigEndian)
  let valueSize = SIZE_LOOKUP[type - 1]
  let valueOffset
  if (valueSize * numValues <= 4) {
    valueOffset = offset + 6
  } else {
    if (buffer.length >= offset + 10) {
      valueOffset = readUInt32(buffer, offset + 6, bigEndian) + startingOffset
    } else {
      return null
    }
  }

  // Special case for ascii strings
  if (type === 2) {
    let asciiSlice = buffer.slice(valueOffset, valueOffset + numValues)
    if (asciiSlice.some((x) => x >> 7 > 0)) return asciiSlice

    let string = asciiSlice.toString("ascii")
    if (string[string.length - 1] === "\0")
      // remove null terminator
      string = string.slice(0, -1)

    return string
  }

  // Special case for buffers
  if (type === 7) return buffer.slice(valueOffset, valueOffset + numValues)

  if (numValues === 1) return readValue(buffer, valueOffset, bigEndian, type)

  let res = []
  for (let i = 0; i < numValues && valueOffset < buffer.length; i++) {
    res.push(readValue(buffer, valueOffset, bigEndian, type))
    valueOffset += valueSize
  }

  return res
}

function readValue(buffer: Buffer, offset: number, bigEndian, type) {
  switch (type) {
    case 1: // uint8
      if (buffer.length < offset + 1) {
        return null
      }
      return buffer[offset]

    case 3: // uint16
      if (buffer.length < offset + 2) {
        return null
      }
      return readUInt16(buffer, offset, bigEndian)

    case 4: // uint32
      if (buffer.length < offset + 4) {
        return null
      }
      return readUInt32(buffer, offset, bigEndian)

    case 5: // unsigned rational
      if (buffer.length < offset + 8) {
        return null
      }
      return (
        readUInt32(buffer, offset, bigEndian) /
        readUInt32(buffer, offset + 4, bigEndian)
      )

    case 6: // int8
      if (buffer.length < offset + 1) {
        return null
      }
      return buffer.readInt8(offset)

    case 8: // int16
      if (buffer.length < offset + 2) {
        return null
      }
      return readInt16(buffer, offset, bigEndian)

    case 9: // int32
      if (buffer.length < offset + 4) {
        return null
      }
      return readInt32(buffer, offset, bigEndian)

    case 10: // signed rational
      if (buffer.length < offset + 8) {
        return null
      }
      return (
        readInt32(buffer, offset, bigEndian) /
        readInt32(buffer, offset + 4, bigEndian)
      )
  }
}

function parseDate(string: string) {
  if (typeof string !== "string") return null

  const match = string.match(
    /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
  )
  if (!match) return null

  return new Date(
    Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6], 0),
  )
}

function isPositiveInteger(value: string | number) {
  return typeof value === "number" && Math.floor(value) === value && value > 0
}

// Buffer reading helpers to help switching between endianness
function readUInt16(buffer: Buffer, offset: number, bigEndian) {
  if (bigEndian) return buffer.readUInt16BE(offset)

  return buffer.readUInt16LE(offset)
}

function readUInt32(buffer: Buffer, offset: number, bigEndian) {
  if (bigEndian) return buffer.readUInt32BE(offset)

  return buffer.readUInt32LE(offset)
}

function readInt16(buffer: Buffer, offset: number, bigEndian) {
  if (bigEndian) return buffer.readInt16BE(offset)

  return buffer.readInt16LE(offset)
}

function readInt32(buffer: Buffer, offset: number, bigEndian) {
  if (bigEndian) return buffer.readInt32BE(offset)

  return buffer.readInt32LE(offset)
}
