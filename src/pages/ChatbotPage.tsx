import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiCpu, FiUser } from "react-icons/fi";
import * as api from "../api/api"; // Đảm bảo api.js có hàm post
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const ChatbotPage = ({ isFloating = false }) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Chào bạn! Tôi là chatbot tư vấn sản phẩm giày dép. Bạn muốn hỏi về giá, size, loại, hay tồn kho của sản phẩm nào?",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();

    // 1. Hiển thị tin nhắn người dùng
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setPrompt("");
    setLoading(true);

    try {
      // 💡 API CALL TỚI ENDPOINT CHAT CỦA SPRING AI
      // Endpoint /chat POST trong Backend của bạn nhận prompt và trả về String response
      const responseData = await api.post("/chat", { prompt: userMessage });

      // 2. Hiển thị phản hồi từ AI
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            responseData.aiResponse ||
            "Xin lỗi, tôi không thể xử lý yêu cầu này lúc này.",
        },
      ]);
    } catch (error: any) {
      console.error("Lỗi Chatbot:", error);

      const message =
        error?.response?.data?.error ||
        "Hệ thống AI đang bận. Vui lòng thử lại sau.";

      setMessages((prev) => [...prev, { sender: "ai", text: message }]);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const ChatBubble = ({ message }: any) => (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md ${
          message.sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        <div className="flex items-start gap-2">
          {message.sender === "ai" && (
            <FiCpu size={20} className="mt-1 text-gray-600" />
          )}
          <p className="whitespace-pre-wrap">{message.text}</p>
          {message.sender === "user" && <FiUser size={20} className="mt-1" />}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={
        isFloating
          ? "h-full flex flex-col"
          : "min-h-screen bg-gray-50 p-6 md:p-10"
      }
    >
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl flex flex-col h-[80vh]">
        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              loading
                ? "Đang chờ AI trả lời..."
                : "Hỏi tôi về sản phẩm (giá, size, loại, tồn kho)..."
            }
            className="flex-1 p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "..." : <FiSend size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
