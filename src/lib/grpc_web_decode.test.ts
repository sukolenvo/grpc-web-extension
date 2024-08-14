import {GrpcWebFrameType} from "./grpc_web_call";
import {decode, decodeEntryStatusDetails} from "./grpc_web_decode";
import HAREntry = chrome.devtools.network.HAREntry;


test('trailer', () => {
  const grpcWebFrames = decode("gAAAAA9ncnBjLXN0YXR1czowDQo=")

  expect(grpcWebFrames).toEqual([{
      type: GrpcWebFrameType.TRAILER,
      message: [{
        id: 0,
        value: "grpc-status:0"
      }]
    }]
  )
})

test('non-printable', () => {
  const grpcWebFrames = decode("AAAAAEMaA0VVUiIKCggwLjk1MDAwMCoKCggxLjA0MDAwMDIOd3RtVF9ITDk0WlA2NDk6EHh4eHgueXl5eXl5eS5ydW5AAUgB")

  expect(grpcWebFrames).toEqual([
    {
      type: GrpcWebFrameType.DATA,
      message: [{
        id: 3,
        value: "EUR"
      }, {
        id: 4,
        value: [{
          id: 1,
          value: "0.950000"
        }]
      }, {
        id: 5,
        value: [{
          id: 1,
          value: "1.040000"
        }]
      }, {
        id: 6,
        value: "wtmT_HL94ZP649"
      }, {
        id: 7,
        value: "xxxx.yyyyyyy.run"
      }, {
        id: 8,
        value: 1,
      }, {
        id: 9,
        value: 1
      }]
    }]
  )
})

test('non-printable-2', () => {
  const grpcWebFrames = decode("AAAABC0KA0VVUhIiCgNJTlISDgoMOTUuMzIxMjAwMDAwGgsKCTg3LjA3MjI1MhImCgNLUlcSEAoOMTU1MC43MTI4MDAwMDAaDQoLMTQxNi41MTY4NzASIAoDQ0FEEg0KCzEuNTYwNzI4MDAwGgoKCDEuNDI1NjY1EiQKA0lTSxIPCg0xNTcuMTQ0MDAwMDAwGgwKCjE0My41NDQ5OTASIAoDTlpEEg0KCzEuODg4MjI0MDAwGgoKCDEuNzI0ODIwEiIKA05PSxIOCgwxMi4zMDI2ODAwMDAaCwoJMTEuMjM4MDI1EiQKA0pQWRIPCg0xNjYuNzQzMjAwMDAwGgwKCjE1Mi4zMTM1MDUSIgoDTVhOEg4KDDIxLjM4NzgwODAwMBoLCgkxOS41MzY5NDASJAoDSFVGEg8KDTQxMS4wMDgwMDAwMDAaDAoKMzc1LjQ0MDA2MxIgCgNQTE4SDQoLNC40OTgzMTIwMDAaCgoINC4xMDkwMzUSIgoDQ1pLEg4KDDI2LjI0MzM2MDAwMBoLCgkyMy45NzIzMDASIAoDSEtEEg0KCzguODU0NTYwMDAwGgoKCDguMDg4MzAwEiAKA0JHThINCgsyLjAzNDAzMjAwMBoKCggxLjg1ODAxMBIgCgNST04SDQoLNS4xNzU5NzYwMDAaCgoINC43MjgwNTUSIAoDQVVEEg0KCzEuNzI3MzM2MDAwGgoKCDEuNTc3ODU1EiIKA1RSWRIOCgwzOC4wOTI2MDAwMDAaCwoJMzQuNzk2MTI1EiIKA1RIQhIOCgwzOS45ODgwMDAwMDAaCwoJMzYuNTI3NTAwEiAKA1NHRBINCgsxLjUwMzExMjAwMBoKCggxLjM3MzAzNRIgCgNJTFMSDQoLNC4yMzUwODgwMDAaCgoIMy44Njg1OTASIAoDQ0hGEg0KCzAuOTgxMjQwMDAwGgoKCDAuODk2MzI1EiAKA1VTRBINCgsxLjEzNTM2ODAwMBoKCggxLjAzNzExNRIiCgNQSFASDgoMNjUuMDM0MzIwMDAwGgsKCTU5LjQwNjM1MRIoCgNJRFISEQoPMTgxMDkuOTY3MjAwMDAwGg4KDDE2NTQyLjg3MDg1MBIgCgNNWVISDQoLNS4wMjExMjAwMDAaCgoINC41ODY2MDASIgoDWkFSEg4KDDIwLjgxNzU3NjAwMBoLCgkxOS4wMTYwNTUSIAoDREtLEg0KCzcuNzYwNjg4MDAwGgoKCDcuMDg5MDkwEiAKA0NOWRINCgs4LjE0MTEyMDAwMBoKCgg3LjQzNjYwMBIiCgNTRUsSDgoMMTEuOTU1MzIwMDAwGgsKCTEwLjkyMDcyNRIgCgNCUkwSDQoLNi4yODk2MDgwMDAaCgoINS43NDUzMTUSIAoDR0JQEg0KCzAuODkxMzYzMjAwGgoKCDAuODE0MjI2")

  expect(grpcWebFrames[0].message[1]).toEqual({
      id: 2,
      value: [
        {
          id: 1,
          value: "INR"
        },
        {
          id: 2,
          value: [{
            id: 1,
            value: "95.321200000"
          }]
        },
        {
          id: 3,
          value: [{
            id: 1,
            value: "87.072252"
          }]
        }
      ]
    }
  )
})

test('bytes', () => {
  const grpcWebFrames = decode("AAAAAAcKBf//////")

  expect(grpcWebFrames).toEqual([
      {
        type: GrpcWebFrameType.DATA,
        message: [{
          id: 1,
          value: "ff ff ff ff ff",
        }]
      }
    ]
  )
})

describe('fixed64', () => {

  it('double', () => {
    const grpcWebFrames = decode("AAAAAAkJrkfhehSu8z8=")

    expect(grpcWebFrames).toEqual([
        {
          type: GrpcWebFrameType.DATA,
          message: [{
            id: 1,
            value: "1.23",
          }]
        }
      ]
    )
  })

  it('integer', () => {
    const grpcWebFrames = decode("AAAAAAkJ6AMAAAAAAAA=")

    expect(grpcWebFrames).toEqual([
        {
          type: GrpcWebFrameType.DATA,
          message: [{
            id: 1,
            value: "1000",
          }]
        }
      ]
    )
  })
})

describe("fixed32", () => {
  it('float', () => {
    const grpcWebFrames = decode("AAAAAAUNpHCdPw==")

    expect(grpcWebFrames).toEqual([
        {
          type: GrpcWebFrameType.DATA,
          message: [{
            id: 1,
            value: "1.2300000190734863",
          }]
        }
      ]
    )
  })

  it('integer', () => {
    const grpcWebCall = decode("AAAAAAUN6AMAAA==")

    expect(grpcWebCall).toEqual([
        {
          type: GrpcWebFrameType.DATA,
          message: [{
            id: 1,
            value: "1000",
          }]
        }
      ]
    )
  })
})

test("multiple frames with padding", () => {
  const grpcWebCall = decode("AAAAAAcKBf//////AAAAAAUNpHCdPw==AAAAAAkJ6AMAAAAAAAA=")

  expect(grpcWebCall).toHaveLength(3)
})

test("grpc-status-details-bin", async () => {
  const result = await decodeEntryStatusDetails({
    response: {
      headers: [{
        name: "grpc-status-details-bin",
        value: "CAkahQEKZXR5cGUuZ29vZ2xlYXBpcy5jb20veHh4eHh4eHgueHh4eHh4eC54eHh4eHh4eHh4eHh4eHgudjQueHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhQcmVjb25kaXRpb25GYWlsdXJlEhwKGkV4cGVjdGVkIGV4YWN0bHkgb25lIHNoZWV0"
      }]
    }
  } as HAREntry)
  expect(result).toEqual([{
    type: GrpcWebFrameType.DATA,
    message: [
      {
        id: 1,
        value: "type.googleapis.com/xxxxxxxx.xxxxxxx.xxxxxxxxxxxxxxx.v4.xxxxxxxxxxxxxxxxxxxxxxxxxxPreconditionFailure",
      },
      {
        id: 2,
        value: [
          {
            id: 1,
            value: "Expected exactly one sheet"
          }
        ]
      }
    ]
  }])
})
