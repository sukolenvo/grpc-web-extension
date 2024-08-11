import parseHarEntry from "./har_entry_parse";
import {GrpcStatus, GrpcWebFrameType} from "./grpc_web_call";
import HAREntry = chrome.devtools.network.HAREntry;

test('grpc message', () => {
  const grpcWebCall = parseHarEntry(grpcMessageHar, {
    content: grpcMessageHar.response.content.text,
    encoding: grpcMessageHar.response.content.encoding
  })

  expect(grpcWebCall).toEqual({
    id: "",
    url: "https://localhost.test/proto.UserService/WhoAmI",
    status: GrpcStatus.UNAUTHENTICATED,
    grpcMessage: "Unauthenticated request",
    duration_ms: 318.63200000043435,
    size_bytes: 0,
    request_frames: [],
    response_frames: []
  })
})

test('trailer', () => {
  const grpcWebCall = parseHarEntry(grpcMessageHar, {
    content: "Z0FBQUFBOW5jbkJqTFhOMFlYUjFjem93RFFvPQ==",
    encoding: "base64"
  })

  expect(grpcWebCall.response_frames).toEqual([{
      type: GrpcWebFrameType.TRAILER,
      message: [{
        id: 0,
        value: "grpc-status:0"
      }]
    }]
  )
})

test('non-printable', () => {
  const grpcWebCall = parseHarEntry(grpcMessageHar, {
    content: "QUFBQUFFTWFBMFZWVWlJS0NnZ3dMamsxTURBd01Db0tDZ2d4TGpBME1EQXdNRElPZDNSdFZGOUlURGswV2xBMk5EazZFSGg0ZUhndWVYbDVlWGw1ZVM1eWRXNUFBVWdC",
    encoding: "base64"
  })

  expect(grpcWebCall.response_frames).toEqual([
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
  const grpcWebCall = parseHarEntry(grpcMessageHar, {
    content: "QUFBQUJDMEtBMFZWVWhJaUNnTkpUbElTRGdvTU9UVXVNekl4TWpBd01EQXdHZ3NLQ1RnM0xqQTNNakkxTWhJbUNnTkxVbGNTRUFvT01UVTFNQzQzTVRJNE1EQXdNREFhRFFvTE1UUXhOaTQxTVRZNE56QVNJQW9EUTBGRUVnMEtDekV1TlRZd056STRNREF3R2dvS0NERXVOREkxTmpZMUVpUUtBMGxUU3hJUENnMHhOVGN1TVRRME1EQXdNREF3R2d3S0NqRTBNeTQxTkRRNU9UQVNJQW9EVGxwRUVnMEtDekV1T0RnNE1qSTBNREF3R2dvS0NERXVOekkwT0RJd0VpSUtBMDVQU3hJT0Nnd3hNaTR6TURJMk9EQXdNREFhQ3dvSk1URXVNak00TURJMUVpUUtBMHBRV1JJUENnMHhOall1TnpRek1qQXdNREF3R2d3S0NqRTFNaTR6TVRNMU1EVVNJZ29EVFZoT0VnNEtEREl4TGpNNE56Z3dPREF3TUJvTENna3hPUzQxTXpZNU5EQVNKQW9EU0ZWR0VnOEtEVFF4TVM0d01EZ3dNREF3TURBYURBb0tNemMxTGpRME1EQTJNeElnQ2dOUVRFNFNEUW9MTkM0ME9UZ3pNVEl3TURBYUNnb0lOQzR4TURrd016VVNJZ29EUTFwTEVnNEtEREkyTGpJME16TTJNREF3TUJvTENna3lNeTQ1TnpJek1EQVNJQW9EU0V0RUVnMEtDemd1T0RVME5UWXdNREF3R2dvS0NEZ3VNRGc0TXpBd0VpQUtBMEpIVGhJTkNnc3lMakF6TkRBek1qQXdNQm9LQ2dneExqZzFPREF4TUJJZ0NnTlNUMDRTRFFvTE5TNHhOelU1TnpZd01EQWFDZ29JTkM0M01qZ3dOVFVTSUFvRFFWVkVFZzBLQ3pFdU56STNNek0yTURBd0dnb0tDREV1TlRjM09EVTFFaUlLQTFSU1dSSU9DZ3d6T0M0d09USTJNREF3TURBYUN3b0pNelF1TnprMk1USTFFaUlLQTFSSVFoSU9DZ3d6T1M0NU9EZ3dNREF3TURBYUN3b0pNell1TlRJM05UQXdFaUFLQTFOSFJCSU5DZ3N4TGpVd016RXhNakF3TUJvS0NnZ3hMak0zTXpBek5SSWdDZ05KVEZNU0RRb0xOQzR5TXpVd09EZ3dNREFhQ2dvSU15NDROamcxT1RBU0lBb0RRMGhHRWcwS0N6QXVPVGd4TWpRd01EQXdHZ29LQ0RBdU9EazJNekkxRWlBS0ExVlRSQklOQ2dzeExqRXpOVE0yT0RBd01Cb0tDZ2d4TGpBek56RXhOUklpQ2dOUVNGQVNEZ29NTmpVdU1ETTBNekl3TURBd0dnc0tDVFU1TGpRd05qTTFNUklvQ2dOSlJGSVNFUW9QTVRneE1Ea3VPVFkzTWpBd01EQXdHZzRLRERFMk5UUXlMamczTURnMU1CSWdDZ05OV1ZJU0RRb0xOUzR3TWpFeE1qQXdNREFhQ2dvSU5DNDFPRFkyTURBU0lnb0RXa0ZTRWc0S0RESXdMamd4TnpVM05qQXdNQm9MQ2dreE9TNHdNVFl3TlRVU0lBb0RSRXRMRWcwS0N6Y3VOell3TmpnNE1EQXdHZ29LQ0RjdU1EZzVNRGt3RWlBS0EwTk9XUklOQ2dzNExqRTBNVEV5TURBd01Cb0tDZ2czTGpRek5qWXdNQklpQ2dOVFJVc1NEZ29NTVRFdU9UVTFNekl3TURBd0dnc0tDVEV3TGpreU1EY3lOUklnQ2dOQ1Vrd1NEUW9MTmk0eU9EazJNRGd3TURBYUNnb0lOUzQzTkRVek1UVVNJQW9EUjBKUUVnMEtDekF1T0RreE16WXpNakF3R2dvS0NEQXVPREUwTWpJMg==",
    encoding: "base64"
  })

  expect(grpcWebCall.response_frames[0].message[1]).toEqual({
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

describe('fixed64', () => {
  test('double', () => {
    const grpcWebCall = parseHarEntry(grpcMessageHar, {
      content: "QUFBQUFBa0pya2ZoZWhTdTh6OD0=",
      encoding: "base64"
    })

    expect(grpcWebCall.response_frames).toEqual([
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

  test('integer', () => {
    const grpcWebCall = parseHarEntry(grpcMessageHar, {
      content: "QUFBQUFBa0o2QU1BQUFBQUFBQT0=",
      encoding: "base64"
    })

    expect(grpcWebCall.response_frames).toEqual([
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
    const grpcWebCall = parseHarEntry(grpcMessageHar, {
      content: "QUFBQUFBVU5wSENkUHc9PQ==",
      encoding: "base64"
    })

    expect(grpcWebCall.response_frames).toEqual([
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
    const grpcWebCall = parseHarEntry(grpcMessageHar, {
      content: "QUFBQUFBVU42QU1BQUE9PQ==",
      encoding: "base64"
    })

    expect(grpcWebCall.response_frames).toEqual([
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

const grpcMessageHar = {
  "cache": {},
  "connection": "29742",
  "pageref": "page_1",
  "request": {
    "method": "POST",
    "url": "https://localhost.test/proto.UserService/WhoAmI",
    "httpVersion": "http/2.0",
    "headers": [
      {
        "name": ":authority",
        "value": "localhost.test"
      },
      {
        "name": ":method",
        "value": "POST"
      },
      {
        "name": ":path",
        "value": "/proto.UserService/WhoAmI"
      },
      {
        "name": ":scheme",
        "value": "https"
      },
      {
        "name": "accept",
        "value": "application/grpc-web-text"
      },
      {
        "name": "accept-encoding",
        "value": "gzip, deflate, br, zstd"
      },
      {
        "name": "accept-language",
        "value": "en-AU,en;q=0.9,ru-RU;q=0.8,ru;q=0.7,uk-UA;q=0.6,uk;q=0.5,en-GB;q=0.4,en-US;q=0.3"
      },
      {
        "name": "content-length",
        "value": "8"
      },
      {
        "name": "content-type",
        "value": "application/grpc-web-text"
      },
      {
        "name": "origin",
        "value": "https://localhost.test"
      },
      {
        "name": "priority",
        "value": "u=1, i"
      },
      {
        "name": "sec-ch-ua",
        "value": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\""
      },
      {
        "name": "sec-ch-ua-mobile",
        "value": "?0"
      },
      {
        "name": "sec-ch-ua-platform",
        "value": "\"Linux\""
      },
      {
        "name": "sec-fetch-dest",
        "value": "empty"
      },
      {
        "name": "sec-fetch-mode",
        "value": "cors"
      },
      {
        "name": "sec-fetch-site",
        "value": "same-origin"
      },
      {
        "name": "user-agent",
        "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
      },
      {
        "name": "x-grpc-web",
        "value": "1"
      },
      {
        "name": "x-user-agent",
        "value": "grpc-web-javascript/0.1"
      }
    ],
    "queryString": [],
    "cookies": [],
    "headersSize": -1,
    "bodySize": 8,
    "postData": {
      "mimeType": "application/grpc-web-text",
      "text": "AAAAAAA="
    }
  },
  "response": {
    "status": 401,
    "statusText": "",
    "httpVersion": "http/2.0",
    "headers": [
      {
        "name": "cache-control",
        "value": "no-cache"
      },
      {
        "name": "content-length",
        "value": "0"
      },
      {
        "name": "content-type",
        "value": "application/grpc-web-text"
      },
      {
        "name": "date",
        "value": "Fri, 09 Aug 2024 13:08:15 GMT"
      },
      {
        "name": "expires",
        "value": "-1"
      },
      {
        "name": "grpc-message",
        "value": "Unauthenticated request"
      },
      {
        "name": "grpc-status",
        "value": "16"
      },
      {
        "name": "pragma",
        "value": "no-cache"
      },
      {
        "name": "referrer-policy",
        "value": "no-referrer"
      },
      {
        "name": "server",
        "value": "istio-envoy"
      },
      {
        "name": "strict-transport-security",
        "value": "max-age=31536000; includeSubDomains"
      },
      {
        "name": "www-authenticate",
        "value": "Bearer realm=\"https://localhost.test/proto.UserService/WhoAmI\""
      },
      {
        "name": "x-content-type-options",
        "value": "nosniff"
      },
      {
        "name": "x-dns-prefetch-control",
        "value": "off"
      },
      {
        "name": "x-download-options",
        "value": "noopen"
      },
      {
        "name": "x-envoy-upstream-service-time",
        "value": "5"
      },
      {
        "name": "x-frame-options",
        "value": "deny"
      },
      {
        "name": "x-xss-protection",
        "value": "1; mode=block"
      }
    ],
    "cookies": [],
    "content": {
      "size": 0,
      "mimeType": "application/grpc-web-text",
      "text": ""
    },
    "redirectURL": "",
    "headersSize": -1,
    "bodySize": -1,
  },
  "serverIPAddress": "127.0.0.1",
  "startedDateTime": "2024-08-09T13:08:15.937Z",
  "time": 318.63200000043435,
  "timings": {
    "blocked": 1.4120000001636217,
    "dns": -1,
    "ssl": -1,
    "connect": -1,
    "send": 0.154,
    "wait": 314.8259999995597,
    "receive": 2.2400000007110066,
  }
} as HAREntry
