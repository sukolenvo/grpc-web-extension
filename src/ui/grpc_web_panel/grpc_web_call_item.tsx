import {getGrpcStatusName, GrpcWebCall} from "../../lib/grpc_web_call";
import clsx from "clsx";
import './grpc_web_call_item.css'
import {Download, Info, Upload} from "@mui/icons-material";
import {getHeader} from "../../lib/har_entry_parse";

export default function GrpcWebCallItem({call, onClick, active}: { call: GrpcWebCall, onClick: ()=>void, active: boolean }) {
  return (
    <tr onClick={onClick} className={clsx('grpc-call-item',{
      'active-item': active
    })}>
      <td tabIndex={0}>
        {call.url}
      </td>
      <td>
        <div>
          {getGrpcStatusName(call.status)}{getHeader(call.entry.response.headers, 'grpc-status-details-bin') && <Info className="pl-1" style={{fontSize: '16px'}} titleAccess="Status details available" />}
        </div>
        <div className="secondary-text">
          {call.grpcMessage}
        </div>
      </td>
      <td>
        {call.duration_ms.toFixed(0)} ms
      </td>
      <td>
        <span className="pr-2">
          <Upload style={{fontSize: '16px'}} titleAccess="Request body size"/>{(call.request_size / 1024).toFixed(2)} KB
        </span>
        <span>
          <Download style={{fontSize: '16px'}} titleAccess="Response body size"/>{(call.response_size / 1024).toFixed(2)} KB
        </span>
      </td>
    </tr>
  );
}
