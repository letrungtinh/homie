import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

import MessagesClient from "./MessagesClient";

interface IParams {
  conversationId: string;
}

const MessagePage = async ({ params }: { params: Promise<IParams> }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Bạn cần đăng nhập"
        subTitle="Vui lòng đăng nhập để sử dụng chức năng nhắn tin."
      />
    );
  }

  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      guest: true,
      host: true,
      listing: true,
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    return (
      <EmptyState
        title="Không tìm thấy cuộc trò chuyện"
        subTitle="Cuộc trò chuyện này không tồn tại hoặc đã bị xóa."
      />
    );
  }

  const isParticipant =
    conversation.guestId === currentUser.id ||
    conversation.hostId === currentUser.id;

  if (!isParticipant) {
    return (
      <EmptyState
        title="Không có quyền truy cập"
        subTitle="Bạn không thuộc cuộc trò chuyện này."
      />
    );
  }

  const safeConversation = JSON.parse(JSON.stringify(conversation));

  return (
    <MessagesClient
      currentUser={currentUser}
      conversation={safeConversation}
    />
  );
};

export default MessagePage;