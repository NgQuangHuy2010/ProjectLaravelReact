import React, { useState } from "react";
import styles from "./chat-popup.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const ChatBox = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    { message: "Xin chào !", direction: "incoming", sentTime: "10:00 AM" },
    { message: "Hi", direction: "outgoing", sentTime: "10:01 AM" },
  ]);
  const [messageInputValue, setMessageInputValue] = useState("");

  const handleSend = () => {
    if (messageInputValue) {
      const newMessage = {
        message: messageInputValue,
        sentTime: "now",
        direction: "outgoing",
      };
      setMessages([...messages, newMessage]);
      setMessageInputValue("");
    }
  };

  return (
    <div
      className={cx(
        "chat-box-container",
        "position-fixed",
        "bottom-3",
        "end-3"
      )}
    >
      {/* Nút mở chat */}
      {!isChatVisible && (
        <button
          onClick={() => setIsChatVisible(true)}
          className={cx(
            "chat-toggle-btn",
            "btn",
            "rounded-circle",
            "btn-chat-open"
          )}
        >
          <i className="fa-solid fa-comments"></i>
        </button>
      )}

      {/* Hộp thoại chat */}
      {isChatVisible && (
        <div className={cx("chat-box", "shadow")}>
          <div
            className={cx(
              "chat-header",
              "d-flex",
              "align-items-center",
              "justify-content-between"
            )}
          >
            Chat with Admin
            <button onClick={() => setIsChatVisible(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className={cx("chat-messages", "overflow-auto", "p-3")}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cx(
                  "d-flex pb-2",
                  msg.direction === "outgoing" ? "justify-content-end" : ""
                )}
              >
                <div
                  className={cx(
                    "message",
                    msg.direction === "outgoing" ? "outgoing" : "incoming"
                  )}
                >
                  <div>{msg.message}</div>
                  <small className="d-block text-muted">{msg.sentTime}</small>
                </div>
              </div>
            ))}
          </div>

          <div className={cx("chat-input", "d-flex", "p-3")}>
            <input
              type="text"
              placeholder="Type a message"
              value={messageInputValue}
              onChange={(e) => setMessageInputValue(e.target.value)}
              className="form-control me-2"
              // Thêm sự kiện onKeyDown để gửi khi nhấn Enter
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Ngăn ngừa hành động mặc định (gửi form)
                  handleSend(); // Gọi hàm gửi tin nhắn
                }
              }}
            />
            <button
              onClick={handleSend}
              className="btn btn-success"
              disabled={messageInputValue.trim() === ""}
            >
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
