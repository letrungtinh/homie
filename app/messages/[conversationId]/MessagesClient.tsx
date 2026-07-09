"use client";

/* eslint-disable @next/next/no-img-element */

import { SafeUser } from "@/app/types";
import axios from "axios";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { IoMdSend } from "react-icons/io";
import { useRouter } from "next/navigation";
import useVietnamLocations from "@/app/hooks/useVietnamLocations";
import Button from "@/app/components/Button";

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

interface LastMessage {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
}

interface ListingInfo {
  id: string;
  title: string;
  imageSrc: string;
  locationValue: string;
  price?: number;
}

interface Conversation {
  id: string;
  guestId: string;
  hostId: string;
  listingId: string;
  listing: ListingInfo;
  guest: MessageUser;
  host: MessageUser;
  messages?: Message[];
}

interface ConversationPreview {
  id: string;
  guestId: string;
  hostId: string;
  listingId: string;
  updatedAt: string;
  listing: ListingInfo;
  guest: MessageUser;
  host: MessageUser;
  messages: LastMessage[];
}

interface MessagesClientProps {
  currentUser: SafeUser;
  conversation: Conversation;
}

const MessagesClient: React.FC<MessagesClientProps> = ({
  currentUser,
  conversation,
}) => {
  const router = useRouter();
  const { getByValue } = useVietnamLocations();

  const [messages, setMessages] = useState<Message[]>(
    conversation.messages || [],
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const otherUser = useMemo(() => {
    return conversation.guestId === currentUser.id
      ? conversation.host
      : conversation.guest;
  }, [
    conversation.guestId,
    conversation.host,
    conversation.guest,
    currentUser.id,
  ]);

  const getLocationTitle = useCallback(
    (locationValue?: string) => {
      if (!locationValue) {
        return "Chưa cập nhật";
      }

      const location = getByValue(locationValue) as
        | {
            label?: string;
            title?: string;
            name?: string;
            value?: string;
          }
        | undefined;

      return (
        location?.label || location?.title || location?.name || locationValue
      );
    },
    [getByValue],
  );

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) {
      return "Chưa cập nhật";
    }

    return `${new Intl.NumberFormat("vi-VN").format(price)} đ / đêm`;
  };

  useEffect(() => {
    axios
      .get(`/api/conversations/${conversation.id}/messages`)
      .then((response) => {
        setMessages(response.data || []);
      })
      .catch(() => {
        toast.error("Không thể tải tin nhắn.");
      });
  }, [conversation.id]);

  useEffect(() => {
    axios
      .get("/api/conversations")
      .then((response) => {
        setConversations(response.data || []);
      })
      .catch(() => {
        toast.error("Không thể tải danh sách cuộc trò chuyện.");
      });
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const onSendMessage = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedMessage = message.trim();

      if (!trimmedMessage) {
        return;
      }

      setIsLoading(true);

      axios
        .post(`/api/conversations/${conversation.id}/messages`, {
          message: trimmedMessage,
        })
        .then((response) => {
          const newMessage = response.data;

          setMessages((current) => [...current, newMessage]);
          setMessage("");

          setConversations((current) =>
            current.map((item) => {
              if (item.id !== conversation.id) {
                return item;
              }

              return {
                ...item,
                messages: [
                  {
                    id: newMessage.id,
                    body: newMessage.body,
                    senderId: newMessage.senderId,
                    createdAt: newMessage.createdAt,
                  },
                ],
              };
            }),
          );
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Gửi tin nhắn thất bại!",
            );
          } else {
            toast.error("Gửi tin nhắn thất bại!");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [conversation.id, message],
  );

  return (
    <div className="w-full px-8 py-6 bg-neutral-50">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px minmax(0, 1fr) 36px 400px",
          height: "calc(100vh - 135px)",
          minHeight: "680px",
          width: "100%",
        }}
      >
        {/* CỘT TRÁI: DANH SÁCH TIN NHẮN */}
        <div
          className="flex flex-col min-w-0 bg-white border border-neutral-300 shadow-sm rounded-2xl overflow-hidden"
          style={{
            minHeight: 0,
          }}
        >
          <div className="p-5 border-b border-neutral-200">
            <div className="text-2xl font-semibold">Tin nhắn</div>
            <div className="text-sm text-neutral-500 mt-1">
              Các cuộc trò chuyện của bạn
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3" style={{ minHeight: 0 }}>
            {conversations.length === 0 && (
              <div className="text-sm text-neutral-500 p-3">
                Bạn chưa có cuộc trò chuyện nào.
              </div>
            )}

            {conversations.map((item) => {
              const isActive = item.id === conversation.id;

              const previewUser =
                item.guestId === currentUser.id ? item.host : item.guest;

              const lastMessage = item.messages?.[0];

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/messages/${item.id}`)}
                  className={`
                    p-4
                    rounded-2xl
                    cursor-pointer
                    transition
                    mb-3
                    border
                    ${
                      isActive
                        ? "bg-cyan-50 border-cyan-300"
                        : "bg-white border-transparent hover:bg-neutral-50 hover:border-neutral-200"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="font-semibold text-sm text-neutral-900"
                      style={{
                        minWidth: 0,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {previewUser.name || previewUser.email}
                    </div>

                    {lastMessage && (
                      <div className="text-xs text-neutral-400 shrink-0">
                        {formatTime(lastMessage.createdAt)}
                      </div>
                    )}
                  </div>

                  <div
                    className="text-sm text-neutral-700 mt-1"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {lastMessage ? lastMessage.body : "Chưa có tin nhắn nào."}
                  </div>

                  <div
                    className="text-xs text-neutral-500 mt-2"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Địa điểm: {getLocationTitle(item.listing.locationValue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT GIỮA: KHUNG CHAT */}
        <div
          className="flex flex-col min-w-0 bg-white border border-neutral-300 shadow-sm rounded-2xl overflow-hidden"
          style={{
            minHeight: 0,
          }}
        >
          <div className="p-5 border-b border-neutral-200 flex items-center gap-4">
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

            <div className="flex flex-col min-w-0">
              <div className="font-semibold text-lg truncate">
                {otherUser.name || otherUser.email}
              </div>

              <div className="text-sm text-neutral-500 truncate">
                Đang trò chuyện về phòng: {conversation.listing.title}
              </div>
            </div>
          </div>

          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto p-5 bg-white"
            style={{
              minHeight: 0,
            }}
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.
              </div>
            ) : (
              <div
                className="flex flex-col gap-4"
                style={{
                  minHeight: "100%",
                  justifyContent: "flex-end",
                }}
              >
                {messages.map((item) => {
                  const isOwnMessage = item.senderId === currentUser.id;

                  return (
                    <div
                      key={item.id}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: isOwnMessage
                          ? "flex-end"
                          : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "75%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isOwnMessage ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          className={`
                            px-4
                            py-3
                            min-h-[42px]
                            flex
                            items-center
                            text-sm
                            leading-relaxed
                            shadow-sm
                            break-words
                            whitespace-pre-wrap
                            rounded-[22px]
                            ${
                              isOwnMessage
                                ? "bg-cyan-500 text-white"
                                : "bg-neutral-100 text-neutral-800"
                            }
                          `}
                          style={{
                            width: "fit-content",
                            maxWidth: "100%",
                          }}
                        >
                          {item.body}
                        </div>

                        <div className="text-[11px] text-neutral-400 mt-1 px-1">
                          {formatTime(item.createdAt)}
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
            className="p-4 border-t border-neutral-200 flex items-center gap-3 bg-white"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isLoading}
              placeholder="Soạn tin nhắn..."
              className="
                flex-1
                border
                border-neutral-300
                rounded-full
                px-5
                py-3
                outline-none
                focus:border-cyan-500
                disabled:opacity-70
              "
            />

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="
                h-12
                w-12
                flex
                items-center
                justify-center
                rounded-full
                bg-cyan-500
                text-white
                disabled:opacity-50
                disabled:cursor-not-allowed
                hover:bg-cyan-600
                transition
                shrink-0
              "
            >
              <IoMdSend size={22} />
            </button>
          </form>
        </div>

        {/* KHOẢNG CÁCH GIỮA KHUNG CHAT VÀ CỘT PHẢI */}
        <div />

        {/* CỘT PHẢI: THÔNG TIN CHUYẾN ĐI */}
        <div
          className="flex flex-col min-w-0 bg-white border border-neutral-300 shadow-md rounded-2xl overflow-hidden"
          style={{ minHeight: 0 }}
        >
          <div className="px-7 py-6 border-b border-neutral-200">
            <div className="text-2xl font-semibold">Lượt đặt</div>
          </div>

          <div
            className="px-7 py-6 flex flex-col gap-7 overflow-y-auto"
            style={{ minHeight: 0 }}
          >
            <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-neutral-100">
              {conversation.listing.imageSrc ? (
                <img
                  src={conversation.listing.imageSrc}
                  alt={conversation.listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-neutral-500">
                  Không có ảnh phòng
                </div>
              )}
            </div>

            <div>
              <div className="text-xl font-semibold">
                Bạn sẵn sàng đặt phòng chưa?
              </div>

              <div className="text-sm text-neutral-600 mt-2">
                Chủ phòng cho phép khách đặt ngay.
              </div>

              
              <Button
          label="Đặt phòng ngay"
          onClick={() =>
                  router.push(`/listings/${conversation.listing.id}`)
                }
        />
            </div>

            <div className="border-t border-neutral-200 pt-7">
              <div className="text-2xl font-semibold mb-5">
                Thông tin chuyến đi
              </div>

              <div
                onClick={() =>
                  router.push(`/listings/${conversation.listing.id}`)
                }
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  cursor-pointer
                  group
                "
              >
                <div className="min-w-0">
                  <div className="font-semibold text-base leading-snug break-words">
                    {conversation.listing.title}
                  </div>

                  <div className="text-sm text-neutral-500 mt-1 break-words">
                    Toàn bộ nhà ·{" "}
                    {getLocationTitle(conversation.listing.locationValue)}
                  </div>
                </div>

                <div className="text-3xl text-neutral-700 group-hover:translate-x-1 transition shrink-0">
                  ›
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-neutral-500">Chủ nhà là</div>
                  <div className="font-semibold text-base mt-1 break-words">
                    {conversation.host.name || conversation.host.email}
                  </div>
                </div>

                <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center">
                  {conversation.host.image ? (
                    <img
                      src={conversation.host.image}
                      alt={conversation.host.name || "Chủ nhà"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold text-neutral-500">
                      {(
                        conversation.host.name ||
                        conversation.host.email ||
                        "H"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <div className="text-sm text-neutral-500">Giá cho 1 đêm</div>
              <div className="font-semibold text-lg text-cyan-600 mt-1">
                {formatPrice(conversation.listing.price)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesClient;
