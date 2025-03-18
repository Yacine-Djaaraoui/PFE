import { useEffect, useState } from "react";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/invitations/");
    setWs(socket);
    console.log(socket);
    socket.onopen = () => {
      console.log("connected");
    };
    socket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]); // Append new message
    };

    socket.onclose = () => console.log("WebSocket Disconnected");

    return () => socket.close(); // Cleanup WebSocket on unmount
  }, []);

  return { messages, sendMessage: (msg: string) => ws?.send(msg) };
};
