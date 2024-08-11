import React, {useState} from "react";
import {GrpcWebCall} from "../../lib/grpc_web_call";
import GrpcWebPanelToolbox from "./toolbox";
import GrpcWebCallItem from "./grpc_web_call_item";
import GrpcWebCallDetails from "./grpc_web_call_details";
import './grpc_web_calls.css'

export default function GrpcWebCalls({calls, onClearHistory}: { calls: GrpcWebCall[], onClearHistory: () => void }) {
  const [selectedCall, setSelectedCall] = useState(undefined)
  const handleOnItemSelected = (call: GrpcWebCall) => {
    setSelectedCall(call)
  }
  const handleOnClearHistory = () => {
    onClearHistory()
    setSelectedCall(undefined)
  }
  return (
    <main className="flex h-screen flex-col">
      <GrpcWebPanelToolbox onClearHistory={handleOnClearHistory}/>
      {calls.length === 0 && <RecordingRequestsEmptyView/>}
      {calls.length > 0 &&
          <div className="overflow-y-scroll flex-grow">
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
                  {calls.map(call => <GrpcWebCallItem key={call.id} call={call} onClick={() => handleOnItemSelected(call)}
                                                      active={call === selectedCall}/>)}
                  </tbody>
              </table>
            {selectedCall && <GrpcWebCallDetails call={selectedCall} onClose={() => setSelectedCall(undefined)}/>}
          </div>
      }
    </main>
  );
}

function RecordingRequestsEmptyView() {
  return (
    <div className="flex justify-center text-center flex-col flex-grow empty-view">
      <p>
        Recording network activity...
      </p>
      <p>
        Perform a request or Reload the page to see network logs.
      </p>
    </div>
  )
}
