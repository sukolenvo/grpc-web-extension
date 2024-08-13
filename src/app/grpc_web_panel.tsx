import {createRoot} from 'react-dom/client';
import '../tailwind-input.css'
import './grpc_web_panel.css'
import toGrpcWebCall, {getHeader} from "../lib/har_entry_parse";
import {GrpcWebCall} from "../lib/grpc_web_call";
import {useEffect, useState} from "react";
import GrpcWebCalls from "../ui/grpc_web_panel/grpc_web_calls";

chrome.devtools.network.getHAR(harLog => {
  const initialCalls = harLog.entries
    .filter(entry => getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc")
    .map((entry, idx) => {
      const grpcWebCall = toGrpcWebCall(entry);
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
      setGrpcWebCalls((prevState) => [...prevState, {
        ...toGrpcWebCall(entry),
        id: grpcWebCalls.length.toString()
      }])
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
