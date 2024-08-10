import React, {useState} from "react";
import {GrpcWebCall} from "../../lib/grpc_call";
import GrpcWebCallItem from "./grpc_web_call_item";
import GrpcWebCallDetails from "./grpc_web_call_details";

export default function GrpcWebCalls({calls}: { calls: GrpcWebCall[] }) {
  const [selectedCall, setSelectedCall] = useState(undefined)
  const handleOnClick = (call: GrpcWebCall) => {
    setSelectedCall(call)
  }
  return (
    <main>
      <div className="h-screen overflow-y-scroll">
        <table className="w-full ">
          <thead>
          <tr>
            <td>
              URL
            </td>
            <td>
              Status
            </td>
            <td>
              Time
            </td>
            <td>
              Size
            </td>
          </tr>
          </thead>
          <tbody>
          {calls.map(call => <GrpcWebCallItem key={call.id} call={call} onClick={() => handleOnClick(call)}
                                              active={call === selectedCall}/>)}
          </tbody>
        </table>
      </div>
      {selectedCall && <GrpcWebCallDetails call={selectedCall} onClose={() => setSelectedCall(undefined)}/>}
    </main>
  );
}
