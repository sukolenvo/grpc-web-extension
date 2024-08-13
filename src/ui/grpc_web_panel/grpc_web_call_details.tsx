import {GrpcWebCall, GrpcWebFrame, GrpcWebFrameType} from "../../lib/grpc_web_call";
import {useEffect, useState} from "react";
import clsx from "clsx";
import './grpc_web_call_details.css'
import {Close} from "@mui/icons-material";
import {decodeEntryRequest, decodeEntryResponse} from "../../lib/grpc_web_decode";

type ActiveTab = "request" | "response"

export default function GrpcWebCallDetails({call, onClose}: { call: GrpcWebCall, onClose: () => void }) {
  const [selectedTab, setSelectedTab] = useState("request" as ActiveTab)
  const [grpcFrames, setGrpcFrames] = useState([])
  useEffect(() => {
    let cancelled = false
    const promise = selectedTab === "request" ? decodeEntryRequest(call.entry) : decodeEntryResponse(call.entry)
      promise.then(frames => {
        if (!cancelled) {
          setGrpcFrames(frames)
        }
      })
        .catch(e => {
          console.log("failed to decode grpc frames", call, e)
        })
    return () => {
      cancelled = true
    }
  }, [call, selectedTab]);
  return (
    <div className="absolute top-0 right-0 w-1/2 h-screen overflow-scroll pane">
      <div className="pane-header">
        <button onClick={onClose} className="p-1"><Close className="p-1"/></button>
        <GrpcWebCallDetailsTab onClick={() => setSelectedTab("request")} selected={selectedTab === "request"}
                               label="Request"/>
        <GrpcWebCallDetailsTab onClick={() => setSelectedTab("response")} selected={selectedTab === "response"}
                               label="Response"/>
      </div>
      <div>
        {grpcFrames.length === 0 &&
            <p className="italic p-1" style={{color: '#948f99'}}>
                Empty message
            </p>
        }
        {grpcFrames.map((frame, idx) => <GrpcWebFrameItem frame={frame} key={idx}/>)}
      </div>
    </div>
  );
}

function GrpcWebFrameItem({frame}: { frame: GrpcWebFrame }) {
  return (
    <div className="grpc-web-frame">
      {frame.type == GrpcWebFrameType.TRAILER ? <h4>Trailer</h4> : null}
      {frame.message.map((field, idx) => <pre key={idx}>{field.toString()}</pre>)}
    </div>
  )
}

function GrpcWebCallDetailsTab({onClick, label, selected}) {
  return (
    <button onClick={onClick} className={clsx({
      'active-button': selected
    })}>{label}</button>
  )
}
