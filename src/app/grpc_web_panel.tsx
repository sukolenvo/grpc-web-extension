import {createRoot} from 'react-dom/client';
import {Header} from "har-format";
import {GrpcStatus} from "../lib/grpc_web_call";
import '../tailwind-input.css'
import {decode} from "../lib/grpc_web_decode";
import './grpc_web_panel.css'
import GrpcWebPanel from "../ui/grpc_web_panel/grpc_web_panel";
import parseHarEntry from "../lib/har_entry_parse";

const getHeader = (headers: Header[], header_name: string): string|undefined => {
  return headers.find(header => header.name.toLowerCase() === header_name)?.value
}

chrome.devtools.network.getHAR(harLog => {
  const initialCalls = harLog.entries
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
  root.render(<GrpcWebPanel initialCalls={initialCalls}/>);
})
