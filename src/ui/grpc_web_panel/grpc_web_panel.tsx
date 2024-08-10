import GrpcWebCalls from "./grpc_web_calls";
import {GrpcWebCall} from "../../lib/grpc_web_call";
import {useEffect, useState} from "react";
import parseHarEntry, {getHeader} from "../../lib/har_entry_parse";

export default function GrpcWebPanel({initialCalls}: { initialCalls: GrpcWebCall[] }) {
  const [grpcWebCalls, setGrpcWebCalls] = useState(initialCalls)
  const handleNewEntry = (entry: chrome.devtools.network.Request) => {
    if (getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc") {
      entry.getContent((content, encoding) => {
        setGrpcWebCalls([...grpcWebCalls, {
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
    <GrpcWebCalls calls={grpcWebCalls}/>
  )
}
