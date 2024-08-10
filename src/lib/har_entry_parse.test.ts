import parseHarEntry from "./har_entry_parse";
import HAREntry = chrome.devtools.network.HAREntry;
import {GrpcStatus} from "./grpc_web_call";

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
