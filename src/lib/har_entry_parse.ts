import HAREntry = chrome.devtools.network.HAREntry;
import {GrpcStatus, GrpcWebCall} from "./grpc_web_call";
import {decode} from "./grpc_web_decode";
import {Header} from "har-format";

export type ResponseContent = {
  content: string,
  encoding: string | undefined,
}

export const getHeader = (headers: Header[], header_name: string): string|undefined => {
  return headers.find(header => header.name.toLowerCase() === header_name)?.value
}

function getResponseMessage(responseContent: ResponseContent): string {
  if (responseContent.content === "" || responseContent.content === undefined) {
    return ""
  }
  if (responseContent.encoding == "base64") {
    return atob(responseContent.content)
  }
  console.warn("Unexpected encoding " + responseContent.encoding, responseContent.content)
  return ""
}

export default function parseHarEntry(entry: HAREntry, responseContent: ResponseContent): GrpcWebCall {
  return {
    id: "",
    url: entry.request.url,
    status: getHeader(entry.response.headers, "grpc-status") as GrpcStatus || GrpcStatus.OK,
    grpcMessage: getHeader(entry.response.headers, "grpc-message") || "",
    duration_ms: entry.time,
    size_bytes: entry.response.content.size,
    request_frames: decode(entry.request.postData?.text),
    response_frames: decode(getResponseMessage(responseContent))
  }
}
