import {createRoot} from 'react-dom/client';
import {Header} from "har-format";
import '../tailwind-input.css'
import './grpc_web_panel.css'
import parseHarEntry from "../lib/har_entry_parse";
import {GrpcWebCall} from "../lib/grpc_web_call";
import {useEffect, useState} from "react";
import GrpcWebCalls from "../ui/grpc_web_panel/grpc_web_calls";

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

function GrpcWebPanel({initialCalls}: { initialCalls: GrpcWebCall[] }) {
  const [grpcWebCalls, setGrpcWebCalls] = useState(initialCalls)
  const handleNewEntry = (entry: chrome.devtools.network.Request) => {
    if (getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc") {
      entry.getContent((content, encoding) => {
        setGrpcWebCalls((prevState) => [...prevState, {
          ...parseHarEntry(entry, {content, encoding}),
          id: grpcWebCalls.length.toString()
        }])
      })
    }
  }
  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener(handleNewEntry)
    return () => chrome.devtools.network.onRequestFinished.removeListener(handleNewEntry)
  })
  return (
    <GrpcWebCalls calls={grpcWebCalls} onClearHistory={() => setGrpcWebCalls([])}/>
  )
}
