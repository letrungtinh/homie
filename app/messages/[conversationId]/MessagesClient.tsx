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
import useVietnamLocations from "@/app/hooks/useVietnamLocations";

import MessageSidebar from "./MessageSidebar";
import MessageBody from "./MessageBody";
import MessageListingInfo from "./MessageListingInfo";

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
  category?: string;
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
  const { getByValue } = useVietnamLocations();

  const [messages, setMessages] = useState<Message[]>(
    conversation.messages || []
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);

  const [mobileView, setMobileView] = useState<"sidebar" | "chat" | "detail">(
    "chat"
  );

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
    [getByValue]
  );

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

      if (!trimmedMessage) return;

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
              if (item.id !== conversation.id) return item;

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
            })
          );
        })
        .catch(() => {
          toast.error("Gửi tin nhắn thất bại!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [conversation.id, message]
  );

  return (
    <div className="w-full px-4 md:px-8 py-6 bg-neutral-50">
      {/* MOBILE */}
      <div className="block xl:hidden min-h-[calc(100vh-135px)]">
        {mobileView === "sidebar" && (
          <MessageSidebar
            conversations={conversations}
            currentUserId={currentUser.id}
            activeConversationId={conversation.id}
            getLocationTitle={getLocationTitle}
            onSelectConversation={() => setMobileView("chat")}
          />
        )}

        {mobileView === "chat" && (
          <MessageBody
            messages={messages}
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            currentUserId={currentUser.id}
            otherUser={otherUser}
            listingTitle={conversation.listing.title}
            messageContainerRef={messageContainerRef}
            onSendMessage={onSendMessage}
            onBackToSidebar={() => setMobileView("sidebar")}
            onOpenDetail={() => setMobileView("detail")}
          />
        )}

        {mobileView === "detail" && (
          <MessageListingInfo
            listing={conversation.listing}
            host={conversation.host}
            getLocationTitle={getLocationTitle}
            formatPrice={formatPrice}
            onBackToChat={() => setMobileView("chat")}
          />
        )}
      </div>

      {/* DESKTOP */}
      <div
        className="
          hidden
          xl:grid
          xl:grid-cols-[340px_minmax(0,1fr)_400px]
          gap-6
          min-h-[calc(100vh-135px)]
        "
      >
        <MessageSidebar
          conversations={conversations}
          currentUserId={currentUser.id}
          activeConversationId={conversation.id}
          getLocationTitle={getLocationTitle}
        />

        <MessageBody
          messages={messages}
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          currentUserId={currentUser.id}
          otherUser={otherUser}
          listingTitle={conversation.listing.title}
          messageContainerRef={messageContainerRef}
          onSendMessage={onSendMessage}
        />

        <MessageListingInfo
          listing={conversation.listing}
          host={conversation.host}
          getLocationTitle={getLocationTitle}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default MessagesClient;