import { useWebSocket } from "@/hooks/useWebsocket2";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  message: string;
  sent?: boolean;
  // Add any other properties your message might have
}

const WebSocketChat = () => {
  const [wsUrl, setWsUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { messages, sendMessage, connectWebSocket, connectionStatus } =
    useWebSocket();
  const messagesEndRef = useRef(null);

  const handleConnect = () => {
    if (!wsUrl) return;
    connectWebSocket(wsUrl);
    setIsConnected(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !connectionStatus) return;

    sendMessage(`{"message": "${message}"}`);
    setMessage("");
  };

  const messageToShow = messages
    .map((msg: string) => {
      try {
        return JSON.parse(msg);
      } catch (err) {
        console.error("Invalid message format", err);
        return null;
      }
    })
    .filter((msg): msg is Message => msg !== null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update connection status based on the hook's status
  useEffect(() => {
    setIsConnected(connectionStatus);
  }, [connectionStatus]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {" "}
        MiniLab WebSocket{" "}
      </h1>

      {/* WebSocket URL Connection */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="WebSocket URL (ws:// or wss://)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={isConnected}
          />
          <button
            onClick={handleConnect}
            disabled={isConnected || !wsUrl}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              isConnected
                ? "bg-green-100 text-green-800 cursor-not-allowed"
                : wsUrl
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isConnected ? "Connected" : "Connect"}
          </button>
        </div>
      </div>

      {/* Messages Display */}
      <div className="flex-1 mb-4 overflow-y-auto border border-gray-200 rounded-lg bg-white p-4">
        <div className="space-y-3">
          {messages && messages.length > 0 ? (
            messageToShow?.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                  msg.sent
                    ? "bg-blue-100 text-blue-900 ml-auto"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm p-2">{msg.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              {isConnected
                ? "No messages yet. Start chatting!"
                : "Connect to a WebSocket to start chatting"}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(e);
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !message.trim()}
          className={`px-6 py-3 rounded-lg font-medium ${
            !isConnected || !message.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WebSocketChat;
