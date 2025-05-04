import { useWebSocket } from "@/hooks/useWebsocket2";
import React, { useState, useEffect, useRef } from "react";

const WebSocketChat = () => {
  const [wsUrl, setWsUrl] = useState("");
  const [message, setMessage] = useState("");
//   const [messageToShow, setMessageToShow] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const { messages, sendMessage, markAsRead } = useWebSocket();

  const messageToShow = messages
    .map((msg: string) => {
      try {
        return JSON.parse(msg);
      } catch (err) {
        console.error("Invalid message format", err);
        return null;
      }
    })
    .filter((msg): msg is Message => msg !== null); //
  const messagesEndRef = useRef(null);
  useWebSocket(wsUrl);
  const handleConnect = () => {
    if (!wsUrl) return;
    // Assuming useWebSocket has a connect method or handles this through state
    // This is a placeholder - adjust to your actual hook implementation
    setIsConnected(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    sendMessage(`{"message": "${message}"}`);
    // fetchMessage();
    setMessage("");
  };
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">WebSocket Chat</h1>

      {/* WebSocket URL Connection */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="WebSocket URL (ws:// or wss://)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleConnect}
            disabled={isConnected}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              isConnected
                ? "bg-green-100 text-green-800 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
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
                <p className="text-sm p-5">{msg.message}</p>
                {/* <p className="text-xs text-gray-500 text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p> */}
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
