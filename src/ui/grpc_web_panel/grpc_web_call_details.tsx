import {GrpcWebCall, GrpcWebFrame, GrpcWebFrameType} from "../../lib/grpc_web_call";
import {useEffect, useState} from "react";
import clsx from "clsx";
import './grpc_web_call_details.css'
import {Close} from "@mui/icons-material";
import {decodeEntryRequest, decodeEntryResponse, decodeEntryStatusDetails} from "../../lib/grpc_web_decode";
import {getHeader} from "../../lib/har_entry_parse";

type ActiveTab = "request" | "response" | "status-details"

export default function GrpcWebCallDetails({call, onClose}: { call: GrpcWebCall, onClose: () => void }) {
  const [selectedTab, setSelectedTab] = useState("request" as ActiveTab)
  const [grpcFrames, setGrpcFrames] = useState([])
  useEffect(() => {
    let cancelled = false
    const promise = selectedTab === "request" ? decodeEntryRequest(call.entry) :
      selectedTab === "response" ? decodeEntryResponse(call.entry) : decodeEntryStatusDetails(call.entry)
    promise.then(frames => {
      if (!cancelled) {
        setGrpcFrames(frames)
      }
    })
      .catch(e => {
        console.log("failed to decode grpc frames", call, e)
        if (!cancelled) {
          setGrpcFrames([])
        }
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
        {getHeader(call.entry.response.headers, "grpc-status-details-bin") &&
            <GrpcWebCallDetailsTab onClick={() => setSelectedTab("status-details")}
                                   selected={selectedTab === "status-details"}
                                   label="Status"/>
        }
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
