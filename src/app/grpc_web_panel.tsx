import {createRoot} from 'react-dom/client';
import '../tailwind-input.css'
import './grpc_web_panel.css'
import GrpcWebCalls from "../ui/grpc_web_panel/grpc_web_calls";

const root = createRoot(document.getElementById('root'));
root.render(<GrpcWebCalls />);
