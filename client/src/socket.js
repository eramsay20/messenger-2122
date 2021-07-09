import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const socket = io(window.location.origin);
// add user auth here?
socket.on("connect", () => {
  console.log("connected to server");
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

export default socket;

// From Socket.io Documentation:
// Please note that you shouldn’t register event handlers in the connect handler itself, 
// as a new handler will be registered every time the Socket reconnects