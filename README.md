## Overview

Chrome extension for decoding gRPC Web requests into human-readable format. Note that its impossible to recover the original
message from binary format without access to proto files (or descriptor), so some guessing is involved. Also field numbers
instead of names used.

Output is similar to (but not exactly matches) https://github.com/protocolbuffers/protoscope

### Install

[Chrome Web Store](https://chromewebstore.google.com/detail/grpc-web-viewer/cgbejolghdmkegkcepgednicdmojnnch)

### Development

1. Place `sample.har.json` into `src/app`
2. Run `npm run dev` to start development server
3. Open http://localhost:8080/grpc_web_panel.html

### Credits

* gRPC decoder online: https://protobuf-decoder.netlify.app/
* gRPC wire format spec: https://protobuf.dev/programming-guides/encoding/
* gRPC web frame format: https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md#protocol-differences-vs-grpc-over-http2
