// src/services/socketService.js
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(process.env.REACT_APP_API_URL, {
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
