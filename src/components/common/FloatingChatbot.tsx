import React, { useState } from "react";
import { FiMessageSquare, FiX } from "react-icons/fi";
import ChatbotPage from "../../pages/ChatbotPage";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          className="mb-4 bg-white rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform origin-bottom-right"
          style={{ width: "400px", height: "550px" }}
        >
          <div className="h-full overflow-hidden flex flex-col">
            <div className="p-3 bg-orange-500 text-white rounded-t-xl flex justify-between items-center flex-shrink-0">
              <h3 className="font-semibold">Tư vấn Sản phẩm Giày dép AI</h3>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-orange-700 rounded-full transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ChatbotPage isFloating={true} />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className={`bg-orange-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "scale-85 opacity-100 hover:bg-orange-600"
            : "scale-85 opacity-100 hover:bg-orange-600"
        }`}
        title={isOpen ? "Đóng chat" : "Mở chat"}
      >
        <FiMessageSquare size={28} />
      </button>
    </div>
  );
};

export default FloatingChatbot;
