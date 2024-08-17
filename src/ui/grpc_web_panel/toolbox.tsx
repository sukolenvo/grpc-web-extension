import {DoNotDisturb, Upload} from "@mui/icons-material";
import './toolbox.css'
import {ChangeEvent, useRef} from "react";

export default function GrpcWebPanelToolbox({onClearHistory, onFilterChange, onHarUpload}: {
  onClearHistory: () => void,
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
  onHarUpload: (e: ChangeEvent<HTMLInputElement>) => void,
}) {
  const harUploadFileInput = useRef(undefined);
  const handleOnHarUpload = () => {
    harUploadFileInput.current.click()
  }
  return (
    <div className="grpc-web-panel-toolbox">
      <DoNotDisturb className="p-1" onClick={onClearHistory} titleAccess="Clear logs"/>
      <input placeholder="Filter" onChange={onFilterChange}/>
      <input type="file" className="hidden" ref={harUploadFileInput} onChange={onHarUpload}/>
      <Upload className="p-1" onClick={handleOnHarUpload} titleAccess="Upload HAR"/>
    </div>
  )
}
