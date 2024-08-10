import {GrpcStatus, GrpcWebCall} from "../../lib/grpc_web_call";
import clsx from "clsx";
import './grpc_web_call_item.css'

export default function GrpcWebCallItem({call, onClick, active}: { call: GrpcWebCall, onClick: ()=>void, active: boolean }) {
  return (
    <tr onClick={onClick} className={clsx({
      'active-item': active
    })}>
      <td >
        {call.url}
      </td>
      <td>
        <div>
          {Object.keys(GrpcStatus).find(it => GrpcStatus[it] === call.status)}
        </div>
        <div className="secondary-text">
          {call.grpcMessage}
        </div>
      </td>
      <td>
        {call.duration_ms.toFixed(0)} ms
      </td>
      <td>
        {(call.size_bytes / 1024).toFixed(2)} KB
      </td>
    </tr>
  );
}
