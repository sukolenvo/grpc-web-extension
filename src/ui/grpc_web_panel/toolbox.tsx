import {DoNotDisturb} from "@mui/icons-material";
import './toolbox.css'
import {ChangeEvent} from "react";

export default function GrpcWebPanelToolbox({onClearHistory, onFilterChange}: {
  onClearHistory: () => void,
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="grpc-web-panel-toolbox">
      <DoNotDisturb className="p-1" onClick={onClearHistory}/>
      <input placeholder="Filter" onChange={onFilterChange}/>
    </div>
  )
}
