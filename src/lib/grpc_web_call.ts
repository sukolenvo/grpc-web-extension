export enum GrpcStatus {
  OK = "0",
  CANCELLED = "1",
  UNKNOWN = "2",
  INVALID_ARGUMENT = "3",
  DEADLINE_EXCEEDED = "4",
  NOT_FOUND = "5",
  ALREADY_EXISTS = "6",
  PERMISSION_DENIED = "7",
  RESOURCE_EXHAUSTED = "8",
  FAILED_PRECONDITION = "9",
  ABORTED = "10",
  OUT_OF_RANGE = "11",
  UNIMPLEMENTED = "12",
  INTERNAL = "13",
  UNAVAILABLE = "14",
  DATA_LOSS = "15",
  UNAUTHENTICATED = "16",
}

export enum GrpcWebFrameType {
  DATA = 0,
  TRAILER = 128,
}

export type GrpcField = {
  id: number,
  value: number | string | GrpcMessage,
  toString: () => string,
}

export type GrpcMessage = GrpcField[]

export type GrpcWebFrame = {
  type: GrpcWebFrameType,
  message: GrpcMessage,
}

export type GrpcWebCall = {
  id: string,
  url: string,
  status: GrpcStatus,
  grpcMessage: string,
  duration_ms: number,
  size_bytes: number,
  request_frames: GrpcWebFrame[],
  response_frames: GrpcWebFrame[],
}
