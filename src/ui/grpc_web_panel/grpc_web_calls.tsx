import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {getGrpcStatusName, GrpcWebCall} from "../../lib/grpc_web_call";
import GrpcWebPanelToolbox from "./toolbox";
import GrpcWebCallItem from "./grpc_web_call_item";
import GrpcWebCallDetails from "./grpc_web_call_details";
import './grpc_web_calls.css'

export default function GrpcWebCalls({calls, onClearHistory}: { calls: GrpcWebCall[], onClearHistory: () => void }) {
  const scrollContainerRef = useRef(undefined)
  const scrollToBottom = useRef(true)
  const ignoreScrollTill = useRef(Date.now())
  const [selectedCall, setSelectedCall] = useState(undefined)
  const [filter, setFilter] = useState(undefined)

  const handleOnItemSelected = (call: GrpcWebCall) => {
    setSelectedCall(call)
  }
  const handleOnClearHistory = () => {
    onClearHistory()
    setSelectedCall(undefined)
    scrollToBottom.current = true
  }
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        if (ignoreScrollTill.current < Date.now()) {
          scrollToBottom.current = (container.scrollTop + container.clientHeight) / container.scrollHeight > 0.99;
        }
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef.current === undefined]);
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container && selectedCall === undefined) {
      if (scrollToBottom.current) {
        ignoreScrollTill.current = Date.now() + 200
        container.scrollTo(0, container.scrollHeight)
      }
    }
  }, [calls])
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }
  const handleKeyDown = (e) => {
    console.log(e)
    if (e.key == 'ArrowDown' && selectedCall) {
      const index = calls.indexOf(selectedCall)
      if (index < calls.length - 1) {
        setSelectedCall(calls[index + 1])
        e.preventDefault()
      }
    } else if (e.key == 'ArrowUp' && selectedCall) {
      const index = calls.indexOf(selectedCall)
      if (index > 0) {
        setSelectedCall(calls[index - 1])
        e.preventDefault()
      }
    }
  }
  return (
    <main className="flex h-screen flex-col">
      <GrpcWebPanelToolbox onClearHistory={handleOnClearHistory} onFilterChange={handleFilterChange}/>
      {calls.length === 0 && <RecordingRequestsEmptyView/>}
      {calls.length > 0 &&
          <div className="overflow-y-scroll flex-grow scroll-smooth" ref={scrollContainerRef}>
              <table className="w-full" onKeyDown={handleKeyDown}>
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
                  {calls
                    .filter(call => filter === undefined || call.url.toLowerCase().includes(filter.toLowerCase())
                      || call.grpcMessage.toLowerCase().includes(filter.toLowerCase())
                      || getGrpcStatusName(call.status).toLowerCase().includes(filter.toLowerCase()))
                    .map(call => <GrpcWebCallItem key={call.id} call={call} onClick={() => handleOnItemSelected(call)}
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
