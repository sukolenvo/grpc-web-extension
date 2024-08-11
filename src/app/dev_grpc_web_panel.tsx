import {createRoot} from 'react-dom/client';
import '../tailwind-input.css'
import './grpc_web_panel.css'
import GrpcWebCalls from "../ui/grpc_web_panel/grpc_web_calls";
import parseHarEntry, {getHeader} from "../lib/har_entry_parse";
import {GrpcWebCall} from "../lib/grpc_web_call";
import {useState} from "react";
import HARLog = chrome.devtools.network.HARLog;

const harLog = require('./sample.har.json').log as HARLog

let initialCalls = harLog.entries
  .filter(entry => getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc")
  .map((entry, idx) => {
    const grpcWebCall = parseHarEntry(entry, {
      content: entry.response.content.text,
      encoding: entry.response.content.encoding
    });
    return {
      ...grpcWebCall,
      id: idx.toString(),
    }
  })

const root = createRoot(document.getElementById('root'));
root.render(<DevGrpcWebPanel initialCalls={initialCalls} />);

function DevGrpcWebPanel({initialCalls}: { initialCalls: GrpcWebCall[] }) {
  const [grpcWebCalls, setGrpcWebCalls] = useState(initialCalls)
  return (
    <GrpcWebCalls calls={grpcWebCalls} onClearHistory={() => setGrpcWebCalls([])}/>
  )
}
