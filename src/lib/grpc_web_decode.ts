import {GrpcField, GrpcMessage, GrpcWebFrame, GrpcWebFrameType} from "./grpc_web_call";

enum GrpcWireType {
  VARINT = 0,
  FIXED_64 = 1,
  LENGTH_DELIMITED = 2,
  START_GROUP = 3,
  END_GROUP = 4,
  FIXED_32 = 5,
}

function readVarint(message: Uint8Array, pos: number): [number, number] {
  let result = 0
  let shift = 0
  let b: number
  do {
    b = message[pos++]
    result |= (b & 0x7f) << shift
    shift += 7
  } while (b & 0x80)
  return [result, pos]
}

function tryDecodeString(bytes: Uint8Array): string | undefined {
  const decoder = new TextDecoder("utf-8", {fatal: true})
  try {
    return decoder.decode(bytes)
  } catch (TypeError) {
    return undefined
  }
}

class VarintGrpcField {
  constructor(public id: number, public value: number) {
  }

  toString() {
    return this.id.toString() + ": " + this.value.toString()
  }
}

class StringGrpcField {
  constructor(public id: number, public value: string) {
  }

  toString() {
    return this.id.toString() + ": " + this.value
  }
}

class TrailerGrpcField {
  constructor(public id: number, public value: string) {
  }

  toString() {
    return this.value
  }
}

class MessageGrpcField {
  constructor(public id: number, public value: GrpcMessage) {
  }

  toString() {
    return this.id.toString() + ": {\n  " + this.value.map(field => field.toString()).join("\n").replaceAll("\n", "\n  ") + "\n}"
  }
}

function decodeGrpc(message: Uint8Array): GrpcMessage | undefined {
  const result = [] as GrpcField[]
  for (let pos = 0; pos < message.length;) {
    const tag = message[pos++]
    const field_number = tag >> 3
    const wire_type = tag & 0x7
    if (wire_type == GrpcWireType.VARINT) {
      const [value, new_pos] = readVarint(message, pos)
      if (new_pos > message.length) {
        return undefined
      }
      result.push(new VarintGrpcField(field_number, value))
      pos = new_pos
    } else if (wire_type == GrpcWireType.FIXED_64) {
      if (pos + 8 > message.length) {
        return undefined
      }
      const value = new DataView(message.buffer, pos, 8);
      const doubleValue = value.getFloat64(0, true);
      const bigIntValue = value.getBigInt64(0, true);
      if (Math.abs(doubleValue) > 1e20 || Math.abs(doubleValue) < 1e-20) {
        result.push(new StringGrpcField(field_number, bigIntValue.toString()))
      } else {
        result.push(new StringGrpcField(field_number, doubleValue.toString()))
      }
      pos += 8
    } else if (wire_type == GrpcWireType.LENGTH_DELIMITED) {
      const [length, new_pos] = readVarint(message, pos)
      if (new_pos > message.length) {
        return undefined
      }
      pos = new_pos
      let value = message.slice(pos, pos + length);
      const stringValue = tryDecodeString(value)
      const messageValue = decodeGrpc(value);
      if (stringValue === undefined) {
        result.push(new MessageGrpcField(field_number, messageValue))
      } else if (messageValue === undefined) {
        result.push(new StringGrpcField(field_number, stringValue))
      } else {
        let hasNonPrintable = false
        for (let i = 0; i < stringValue.length; i++) {
          if (stringValue.charCodeAt(i) < 9 || stringValue.charCodeAt(i) > 9 && stringValue.charCodeAt(i) < 13) {
            hasNonPrintable = true
            break
          }
        }
        if (hasNonPrintable) {
          result.push(new MessageGrpcField(field_number, messageValue))
        } else {
          result.push(new StringGrpcField(field_number, stringValue))
        }
      }
      pos += length
    } else if (wire_type == GrpcWireType.START_GROUP) {
      result.push(new StringGrpcField(field_number, "START_GROUP"))
    } else if (wire_type == GrpcWireType.END_GROUP) {
      result.push(new StringGrpcField(field_number, "END_GROUP"))
    } else if (wire_type == GrpcWireType.FIXED_32) {
      if (pos + 4 > message.length) {
        return undefined
      }
      const value = new DataView(message.buffer, pos, 4);
      const floatValue = value.getFloat32(0, true);
      const intValue = value.getInt32(0, true);
      if (Math.abs(floatValue) > 1e20 || Math.abs(floatValue) < 1e-20) {
        result.push(new StringGrpcField(field_number, intValue.toString()))
      } else {
        result.push(new StringGrpcField(field_number, floatValue.toString()))
      }
      pos += 4
    } else {
      console.log("Grpc decoding error at pos " + pos, message)
      return undefined
    }
  }
  return result
}

export function decode(message: string): GrpcWebFrame[] {
  let padding = 0
  for (let i = 0; i < message.length; i++) {
    if (message[i] === '=') {
      padding++
    }
  }
  const bytes = new Uint8Array(message.length / 4 * 3 - padding)
  let pos = 0
  for (let i = 0; i < message.length; i += 4) {
    const binaryString = atob(message.slice(i, i + 4))
    for (let j = 0; j < binaryString.length; j++) {
      bytes[pos++] = binaryString.charCodeAt(j)
    }
  }
  const result = []
  for (let pos = 0; pos < bytes.length;) {
    const frameType = bytes[pos++] as GrpcWebFrameType
    let length = bytes[pos++] << 24 | bytes[pos++] << 16 | bytes[pos++] << 8 | bytes[pos++]
    if (length == 0) {
      continue
    }
    const payload = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
      payload[i] = bytes[pos++]
    }
    if (frameType === GrpcWebFrameType.DATA) {
      result.push({type: frameType, message: decodeGrpc(payload)})
    } else if (frameType === GrpcWebFrameType.TRAILER) {
      result.push({type: frameType, message: [new TrailerGrpcField(0, tryDecodeString(payload)?.trim())]})
    } else {
      console.warn("Unexpected frame type " + frameType, message)
    }
  }
  return result
}
