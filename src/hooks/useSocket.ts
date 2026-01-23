import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "@/config/api";

export const useSocket = (isAuthenticated: boolean) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = API_CONFIG.BASE_URL;
    // console.log(
    //   "🔌 Attempting to connect to socket (cookie-based):",
    //   socketUrl
    // );

    const s = io(socketUrl, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      // console.log("✅ Socket connected:", s.id);
      setIsConnected(true);
    });

    s.on("disconnect", (reason) => {
      // console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    s.on("connect_error", (err) => {
      // console.error("⚠️ Socket connection error:", err.message);
      setIsConnected(false);
    });

    setSocket(s);

    return () => {
      // console.log("🔌 Cleaning up socket connection...");
      s.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  return { socket, isConnected };
};
