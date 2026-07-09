"use client";

import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import { SafeUser } from "@/app/types";
import Image from "next/image";
import Link from "next/link";

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

interface Conversation {
  id: string;
  guestId: string;
  hostId: string;
  listingId: string;
  updatedAt: string;
  listing: {
    id: string;
    title: string;
    imageSrc: string;
    locationValue: string;
  };
  guest: MessageUser;
  host: MessageUser;
  messages: LastMessage[];
}

interface MessagesListClientProps {
  currentUser: SafeUser;
  conversations: Conversation[];
}

const MessagesListClient: React.FC<MessagesListClientProps> = ({
  currentUser,
  conversations,
}) => {
  return (
    <Container>
      <div className="max-w-screen-md mx-auto py-8">
        <Heading
          title="Tin nhắn"
          subtitle="Danh sách các cuộc trò chuyện của bạn"
        />

        <div className="mt-8 flex flex-col gap-4">
          {conversations.length === 0 && (
            <div className="text-neutral-500">
              Bạn chưa có cuộc trò chuyện nào.
            </div>
          )}

          {conversations.map((conversation) => {
            const otherUser =
              conversation.guestId === currentUser.id
                ? conversation.host
                : conversation.guest;

            const lastMessage = conversation.messages?.[0];

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  border
                  border-neutral-200
                  rounded-xl
                  hover:shadow-md
                  transition
                  bg-white
                "
                style={{
                  overflow: "hidden",
                }}
              >
                <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={conversation.listing.imageSrc}
                    alt={conversation.listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div
                  className="flex flex-col flex-1"
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="font-semibold text-base"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {conversation.listing.title}
                  </div>

                  <div
                    className="text-sm text-neutral-500"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Đang trò chuyện với {otherUser.name || otherUser.email}
                  </div>

                  <div
                    className="text-sm text-neutral-600 mt-2"
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    title={
                      lastMessage
                        ? lastMessage.body
                        : "Chưa có tin nhắn nào."
                    }
                  >
                    {lastMessage
                      ? lastMessage.body
                      : "Chưa có tin nhắn nào."}
                  </div>
                </div>

                {lastMessage && (
                  <div className="text-xs text-neutral-400 shrink-0 ml-3">
                    {new Date(lastMessage.createdAt).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default MessagesListClient;