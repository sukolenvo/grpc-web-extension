import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {getGrpcStatusName, GrpcWebCall} from "../../lib/grpc_web_call";
import GrpcWebPanelToolbox from "./toolbox";
import GrpcWebCallItem from "./grpc_web_call_item";
import GrpcWebCallDetails from "./grpc_web_call_details";
import './grpc_web_calls.css'
import toGrpcWebCall, {getHeader, isGrpcWebCall} from "../../lib/har_entry_parse";
import {Har} from "har-format";

export default function GrpcWebCalls() {
  const [grpcWebCalls, setGrpcWebCalls] = useState([] as GrpcWebCall[])
  const scrollContainerRef = useRef(undefined)
  const scrollToBottom = useRef(true)
  const ignoreScrollTill = useRef(Date.now())
  const [selectedCall, setSelectedCall] = useState(undefined)
  const [filter, setFilter] = useState(undefined)

  const handleOnItemSelected = (call: GrpcWebCall) => {
    setSelectedCall(call)
  }
  const handleOnClearHistory = () => {
    setGrpcWebCalls([])
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
  }, [grpcWebCalls])
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }
  const handleKeyDown = (e) => {
    console.log(e)
    if (e.key == 'ArrowDown' && selectedCall) {
      const index = grpcWebCalls.indexOf(selectedCall)
      if (index < grpcWebCalls.length - 1) {
        setSelectedCall(grpcWebCalls[index + 1])
        e.preventDefault()
      }
    } else if (e.key == 'ArrowUp' && selectedCall) {
      const index = grpcWebCalls.indexOf(selectedCall)
      if (index > 0) {
        setSelectedCall(grpcWebCalls[index - 1])
        e.preventDefault()
      }
    }
  }
  const handleNewEntry = (entry: chrome.devtools.network.Request) => {
    if (isGrpcWebCall(entry)) {
      setGrpcWebCalls((prevState) => [...prevState, toGrpcWebCall(entry)])
    }
  }
  const handleHarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const har = JSON.parse(e.target.result as string) as Har
        har.log.entries.forEach(handleNewEntry)
      } catch (e) {
        console.error("Failed to parse HAR file", e)
      }
    }
    reader.readAsText(selectedFile)
  }
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      require('./sample.har.json').log.entries.forEach(handleNewEntry)
    } else {
      chrome.devtools.network.getHAR(harLog => {
        harLog.entries
          .filter(isGrpcWebCall)
          .forEach(handleNewEntry)
      })
      chrome.devtools.network.onRequestFinished.addListener(handleNewEntry)
      return () => chrome.devtools.network.onRequestFinished.removeListener(handleNewEntry)
    }
  }, [])
  return (
    <main className="flex h-screen flex-col">
      <GrpcWebPanelToolbox onClearHistory={handleOnClearHistory} onFilterChange={handleFilterChange} onHarUpload={handleHarUpload}/>
      {grpcWebCalls.length === 0 && <RecordingRequestsEmptyView/>}
      {grpcWebCalls.length > 0 &&
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
                  {grpcWebCalls
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
