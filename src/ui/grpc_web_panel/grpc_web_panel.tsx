import GrpcWebCalls from "./grpc_web_calls";
import {GrpcStatus, GrpcWebCall} from "../../lib/grpc_call";
import {useEffect, useState} from "react";
import {Header} from "har-format";
import {decode} from "../../lib/grpc_web_decode";

const getHeader = (headers: Header[], header_name: string): string|undefined => {
  return headers.find(header => header.name.toLowerCase() === header_name)?.value
}

export default function GrpcWebPanel({initialCalls}: {initialCalls: GrpcWebCall[]}) {
  const [grpcWebCalls, setGrpcWebCalls] = useState(initialCalls)
  const handleNewEntry = (entry: chrome.devtools.network.Request) => {
    if (getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc") {
      entry.getContent((content, encoding) => {
        if (encoding == "base64") {
          setGrpcWebCalls([...grpcWebCalls, {
            id: grpcWebCalls.length.toString(),
            url: entry.request.url,
            status: getHeader(entry.response.headers, "grpc-status") as GrpcStatus || GrpcStatus.OK,
            duration_ms: entry.time,
            size_bytes: entry.response.content.size,
            request_frames: decode(entry.request.postData?.text),
            response_frames: decode(atob(content))
          }])
        } else {
          console.warn("Unexpected encoding " + encoding, content)
        }
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
