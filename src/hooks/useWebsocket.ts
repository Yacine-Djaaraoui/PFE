import { useEffect, useState } from "react";
import notificationSound from "@/assets/notification-sound.mp3";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const audio = new Audio(notificationSound);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const socket = new WebSocket(
      `ws://localhost:8000/ws/notifications/?token=${token}`
    );

    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const cleanedData = event.data.trim();
        const parsedData = JSON.parse(cleanedData);
        console.log(parsedData)
        if (parsedData.type === "notification") {
          audio.play();
          queryClient.invalidateQueries({ queryKey: ["teams"] });
          queryClient.invalidateQueries({ queryKey: ["themes"] });
          queryClient.invalidateQueries({ queryKey: ["members"] });
          queryClient.invalidateQueries({ queryKey: ["uploads"] });
          queryClient.invalidateQueries({ queryKey: ["meetings"] });
          queryClient.invalidateQueries({ queryKey: ["soutenance"] });
        }
        setMessages((prevMessages) => [...prevMessages, parsedData]);
      } catch (error) {
        console.error("JSON parsing error:", error, "Raw data:", event.data);
      }
    };

    return () => socket.close();
  }, []);

  // Function to send messages
  const sendMessage = (msg: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    } else {
      console.warn("WebSocket is not open.");
    }
  };

  // Function to mark notifications as read
  const markAsRead = (notificationId: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        command: "mark_read",
        notification_id: notificationId,
      });
      console.log(message);
      ws.send(message);
      // Update local state to mark notification as read
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === notificationId ? { ...msg, status: "read" } : msg
        )
      );
    } else {
      console.warn("WebSocket is not open.");
    }
  };

  return { messages, sendMessage, markAsRead };
};
