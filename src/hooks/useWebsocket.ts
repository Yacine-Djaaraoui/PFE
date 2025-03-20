import { useEffect, useState } from "react";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const socket = new WebSocket(
      `ws://localhost:8000/ws/notifications/?token=${token}`
    );

    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => console.log("WebSocket Disconnected");

    return () => socket.close();
  }, []);

  return { messages, sendMessage: (msg: string) => ws?.send(msg) };
};
