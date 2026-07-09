"use client";

import { useRouter } from "next/navigation";

interface MessageUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
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

interface MessageSidebarProps {
  conversations: ConversationPreview[];
  currentUserId: string;
  activeConversationId: string;
  getLocationTitle: (locationValue?: string) => string;
  onSelectConversation?: () => void;
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({
  conversations,
  currentUserId,
  activeConversationId,
  getLocationTitle,
  onSelectConversation,
}) => {
  const router = useRouter();

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
    onSelectConversation?.();
  };

  return (
    <div className="flex flex-col min-w-0 bg-white border border-neutral-300 shadow-sm rounded-2xl overflow-hidden h-[calc(100vh-135px)]">
      <div className="p-5 border-b border-neutral-200">
        <div className="text-2xl font-semibold">Tin nhắn</div>
        <div className="text-sm text-neutral-500 mt-1">
          Các cuộc trò chuyện của bạn
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {conversations.length === 0 && (
          <div className="text-sm text-neutral-500 p-3">
            Bạn chưa có cuộc trò chuyện nào.
          </div>
        )}

        {conversations.map((item) => {
          const isActive = item.id === activeConversationId;
          const previewUser =
            item.guestId === currentUserId ? item.host : item.guest;
          const lastMessage = item.messages?.[0];

          return (
            <div
              key={item.id}
              onClick={() => handleSelectConversation(item.id)}
              className={`
                p-4 rounded-2xl cursor-pointer transition mb-3 border
                ${
                  isActive
                    ? "bg-cyan-50 border-cyan-300"
                    : "bg-white border-transparent hover:bg-neutral-50 hover:border-neutral-200"
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-sm text-neutral-900 truncate">
                  {previewUser.name || previewUser.email}
                </div>

                {lastMessage && (
                  <div className="text-xs text-neutral-400 shrink-0">
                    {formatDateTime(lastMessage.createdAt)}
                  </div>
                )}
              </div>

              <div className="text-sm text-neutral-700 mt-1 truncate">
                {lastMessage ? lastMessage.body : "Chưa có tin nhắn nào."}
              </div>

              <div className="text-xs text-neutral-500 mt-2 truncate">
                Địa điểm: {getLocationTitle(item.listing.locationValue)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageSidebar;