import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";


export const initNewSocket = () => {
  // token only added to localStorage after successful auth/login
  const token = localStorage.getItem("messenger-token")

  const socket = io(window.location.origin, {
    auth: { token },
    reconnectionDelayMin: 5000,
    transport: ['websocket']
  });

  socket.on("connect", () => {
    console.log('Connected to server - SocketID:', socket.id)
  });

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from server");
  });

  return socket
}

// default socket setup to load socket on window reload when token already cached
let socket = initNewSocket();

export default socket;