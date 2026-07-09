"use client";

import { FormEvent, RefObject } from "react";
import { IoMdSend } from "react-icons/io";

interface MessageUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  sender: MessageUser;
}

interface MessageBodyProps {
  messages: Message[];
  message: string;
  setMessage: (value: string) => void;
  isLoading: boolean;
  currentUserId: string;
  otherUser: MessageUser;
  listingTitle: string;
  messageContainerRef: RefObject<HTMLDivElement | null>;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  onBackToSidebar?: () => void;
  onOpenDetail?: () => void;
}

const MessageBody: React.FC<MessageBodyProps> = ({
  messages,
  message,
  setMessage,
  isLoading,
  currentUserId,
  otherUser,
  listingTitle,
  messageContainerRef,
  onSendMessage,
  onBackToSidebar,
  onOpenDetail,
}) => {
  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-w-0 bg-white border border-neutral-300 shadow-sm rounded-2xl overflow-hidden h-[calc(100vh-135px)]">
      <div className="p-4 md:p-5 border-b border-neutral-200 flex items-center gap-3">
        <button
          onClick={onBackToSidebar}
          className="xl:hidden text-sm font-semibold underline shrink-0"
        >
          Quay lại
        </button>

        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 bg-neutral-100 flex items-center justify-center">
          {otherUser.image ? (
            <img
              src={otherUser.image}
              alt={otherUser.name || "Avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-neutral-500">
              {(otherUser.name || otherUser.email || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="font-semibold text-lg truncate">
            {otherUser.name || otherUser.email}
          </div>

          <div className="text-sm text-neutral-500 truncate">
            Đang trò chuyện về phòng: {listingTitle}
          </div>
        </div>

        <button
          onClick={onOpenDetail}
          className="xl:hidden text-sm font-semibold underline shrink-0"
        >
          Chi tiết
        </button>
      </div>

      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-5 bg-white"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 text-center">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.
          </div>
        ) : (
          <div className="flex flex-col gap-4 min-h-full justify-end">
            {messages.map((item) => {
              const isOwnMessage = item.senderId === currentUserId;

              return (
                <div
                  key={item.id}
                  className={`w-full flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] flex flex-col ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`
                        px-4 py-3 min-h-[42px] flex items-center text-sm
                        leading-relaxed shadow-sm break-words whitespace-pre-wrap
                        rounded-[22px]
                        ${
                          isOwnMessage
                            ? "bg-cyan-500 text-white"
                            : "bg-neutral-100 text-neutral-800"
                        }
                      `}
                    >
                      {item.body}
                    </div>

                    <div className="text-[11px] text-neutral-400 mt-1 px-1">
                      {formatMessageTime(item.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form
        onSubmit={onSendMessage}
        className="p-3 md:p-4 border-t border-neutral-200 flex items-center gap-3 bg-white"
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isLoading}
          placeholder="Soạn tin nhắn..."
          className="
            flex-1 border border-neutral-300 rounded-full
            px-5 py-3 outline-none focus:border-cyan-500 disabled:opacity-70
          "
        />

        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="
            h-12 w-12 flex items-center justify-center rounded-full
            bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-cyan-600 transition shrink-0
          "
        >
          <IoMdSend size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageBody;