import HAREntry = chrome.devtools.network.HAREntry;
import {GrpcStatus, GrpcWebCall} from "./grpc_web_call";
import {Header} from "har-format";

export const getHeader = (headers: Header[], header_name: string): string|undefined => {
  return headers.find(header => header.name.toLowerCase() === header_name)?.value
}

export default function toGrpcWebCall(entry: HAREntry): GrpcWebCall {
  return {
    id: "",
    url: entry.request.url,
    status: getHeader(entry.response.headers, "grpc-status") as GrpcStatus || GrpcStatus.OK,
    grpcMessage: getHeader(entry.response.headers, "grpc-message") || "",
    duration_ms: entry.time,
    size_bytes: entry.response.content.size,
    entry: entry,
  }
}
