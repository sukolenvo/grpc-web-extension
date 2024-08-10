## Overview

Chrome extension for decoding gRPC Web requests into human-readable format. Note that its impossible to recover the original
message from binary format without access to proto files (or descriptor), so some guessing is involved. Also field numbers
instead of names used.

Output is similar to (but not exactly matches) https://github.com/protocolbuffers/protoscope

### Install

1. Build extension: `npm ci && npm run build`
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select `dist` directory

### Development

1. Place `sample.har.json` into `src/app`
2. Run `npm run dev` to start development server
3. Open http://localhost:8080/grpc_web_panel.html
