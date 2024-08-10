import {GrpcField, GrpcMessage, GrpcWebFrame, GrpcWebFrameType} from "./grpc_call";

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

class MessageGrpcField {
  constructor(public id: number, public value: GrpcMessage) {
  }
  toString() {
    return this.id.toString() + ": {\n  " + this.value.map(field => field.toString()).join("\n").replaceAll("\n", "\n  ") + "\n}"
  }
}

function decodeGrpc(message: Uint8Array): GrpcMessage {
  const result = [] as GrpcField[]
  for (let pos = 0; pos < message.length;) {
    const tag = message[pos++]
    const field_number = tag >> 3
    const wire_type = tag & 0x7
    if (wire_type == GrpcWireType.VARINT) {
      const [value, new_pos] = readVarint(message, pos)
      result.push(new VarintGrpcField(field_number, value))
      pos = new_pos
      continue
    } else if (wire_type == GrpcWireType.FIXED_64) {
      result.push({id: field_number, value: "FIXED_64"})
    } else if (wire_type == GrpcWireType.LENGTH_DELIMITED) {
      const [length, new_pos] = readVarint(message, pos)
      pos = new_pos
      let value = message.slice(pos, pos + length);
      const stringValue = tryDecodeString(value)
      if (stringValue === undefined) {
        result.push(new MessageGrpcField(field_number, decodeGrpc(value)))
      } else {
        result.push(new StringGrpcField(field_number, stringValue))
      }
      pos += length
      continue
    } else if (wire_type == GrpcWireType.START_GROUP) {
      result.push({id: field_number, value: "START_GROUP"})
    } else if (wire_type == GrpcWireType.END_GROUP) {
      result.push({id: field_number, value: "END_GROUP"})
    } else if (wire_type == GrpcWireType.FIXED_32) {
      result.push({id: field_number, value: "FIXED_32"})
    } else {
      console.log("Grpc decoding error at pos " + pos, message)
    }
    break
  }
  return result
}

export function decode(message: string): GrpcWebFrame[] {
  const bytes = new Uint8Array(message.length / 4 * 3)
  for (let i = 0; i < message.length; i += 4) {
    const binaryString = atob(message.slice(i, i + 4))
    for (let j = 0; j < binaryString.length; j++) {
      bytes[i / 4 * 3 + j] = binaryString.charCodeAt(j)
    }
  }
  const result = []
  for (let pos = 0; pos < bytes.length;) {
    const frameType = bytes[pos++] as GrpcWebFrameType
    let length = bytes[pos++] << 24 | bytes[pos++] << 16 | bytes[pos++] << 8 | bytes[pos++]
    const message = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
      message[i] = bytes[pos++]
    }
    result.push({type: frameType, message: decodeGrpc(message)})
    break
  }
  return result
}
