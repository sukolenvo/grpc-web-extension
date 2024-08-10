import {createRoot} from 'react-dom/client';
import {Header} from "har-format";
import {GrpcStatus} from "../lib/grpc_call";
import '../tailwind-input.css'
import {decode} from "../lib/grpc_web_decode";
import './grpc_web_panel.css'
import GrpcWebCalls from "../ui/grpc_web_panel/grpc_web_calls";

const harLog = require('./sample.har.json').log

const getHeader = (headers: Header[], header_name: string): string | undefined => {
  return headers.find(header => header.name.toLowerCase() === header_name)?.value
}

const initialCalls = harLog.entries
  .filter(entry => getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc")
  .map((entry, idx) => {
    return {
      id: idx.toString(),
      url: entry.request.url,
      status: getHeader(entry.response.headers, "grpc-status") as GrpcStatus || GrpcStatus.OK,
      duration_ms: entry.time,
      size_bytes: entry.response.content.size,
      request_frames: decode(entry.request.postData?.text),
      response_frames: decode(atob(entry.response.content?.text))
    }
  })
const root = createRoot(document.getElementById('root'));
root.render(<GrpcWebCalls calls={initialCalls}/>);
