import { useEffect, useState, useRef } from "react";
import notificationSound from "@/assets/notification-sound.mp3";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [wsUrl, setWsUrl] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
  }, []);

  // Connect to WebSocket with the provided URL
  const connectWebSocket = (url: string) => {
    // Close existing connection if any
    if (ws) {
      ws.close();
    }

    try {
      const socket = new WebSocket(url);
      setWsUrl(url);
      setWs(socket);

      // Set up event listeners
      socket.onopen = () => {
        console.log("WebSocket connection established");
        setConnectionStatus(true);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus(false);
      };

      socket.onmessage = (event) => {
        try {
          const cleanedData = event.data.trim();

          // Play notification sound
          if (audioRef.current) {
            audioRef.current
              .play()
              .catch((err) =>
                console.error("Error playing notification:", err)
              );
          }

          // Add message to state
          setMessages((prevMessages) => [...prevMessages, cleanedData]);
        } catch (error) {
          console.error(
            "Error handling message:",
            error,
            "Raw data:",
            event.data
          );
        }
      };

      return true;
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setConnectionStatus(false);
      return false;
    }
  };

  // Clean up WebSocket connection when component unmounts
  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  // Send message via WebSocket
  const sendMessage = (msg: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);

      // Optional: Add sent message to local state with a flag
      try {
        const msgObj = JSON.parse(msg);
        msgObj.sent = true;
        setMessages((prevMessages) => [
          ...prevMessages,
          JSON.stringify(msgObj),
        ]);
      } catch (error) {
        console.error("Error parsing sent message:", error);
      }
    } else {
      console.warn("WebSocket is not open.");
    }
  };

  // Mark notifications as read
  const markAsRead = (notificationId: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        command: "mark_read",
        notification_id: notificationId,
      });
      ws.send(message);

      // Update local state to mark notification as read
      setMessages((prevMessages) =>
        prevMessages.map((msgStr) => {
          try {
            const msg = JSON.parse(msgStr);
            if (msg.id === notificationId) {
              return JSON.stringify({ ...msg, status: "read" });
            }
            return msgStr;
          } catch {
            return msgStr;
          }
        })
      );
    } else {
      console.warn("WebSocket is not open.");
    }
  };

  return {
    messages,
    sendMessage,
    markAsRead,
    connectWebSocket,
    connectionStatus,
    currentUrl: wsUrl,
  };
};
