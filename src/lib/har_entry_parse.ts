import HAREntry = chrome.devtools.network.HAREntry;
import {GrpcStatus, GrpcWebCall} from "./grpc_web_call";
import {Header} from "har-format";

export function isGrpcWebCall(entry: HAREntry): boolean {
  return getHeader(entry.request.headers, "content-type") == "application/grpc-web-text" || getHeader(entry.request.headers, "content-type") == "application/grpc"
}

export const getHeader = (headers: Header[], header_name: string): string|undefined => {
  return headers.find(header => header.name.toLowerCase() === header_name)?.value
}

let nextId = 1

export default function toGrpcWebCall(entry: HAREntry): GrpcWebCall {
  return {
    id: (nextId++).toString(),
    url: entry.request.url,
    status: getHeader(entry.response.headers, "grpc-status") as GrpcStatus || GrpcStatus.OK,
    grpcMessage: getHeader(entry.response.headers, "grpc-message") || "",
    duration_ms: entry.time,
    response_size: Math.max(entry.response.content.size, Math.max(entry.response.bodySize, 0)),
    request_size: Math.max(entry.request.bodySize, 0),
    entry: entry,
  }
}
