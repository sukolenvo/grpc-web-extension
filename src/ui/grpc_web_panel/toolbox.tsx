import {DoNotDisturb} from "@mui/icons-material";
import './toolbox.css'

export default function GrpcWebPanelToolbox({onClearHistory}: {onClearHistory: () => void}) {
  return (
    <div className="grpc-web-panel-toolbox">
      <DoNotDisturb className="p-1" onClick={onClearHistory}/>
    </div>
  )
}
