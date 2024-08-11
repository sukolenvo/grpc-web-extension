import {DoNotDisturb} from "@mui/icons-material";

export default function GrpcWebPanelToolbox({onClearHistory}: {onClearHistory: () => void}) {
  return (
    <div>
      <DoNotDisturb className="p-1" onClick={onClearHistory}/>
    </div>
  )
}
