import React from 'react';
import { io } from 'socket.io-client';
const SocketContext = React.createContext(null);

export default function SocketProvider({children}) {
  const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
export const useSocket = ()=> React.useContext(SocketContext);
