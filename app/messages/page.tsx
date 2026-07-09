import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { redirect } from "next/navigation";

const MessagesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Bạn cần đăng nhập"
        subTitle="Vui lòng đăng nhập để xem tin nhắn."
      />
    );
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          guestId: currentUser.id,
        },
        {
          hostId: currentUser.id,
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 1,
  });

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="Chưa có tin nhắn"
        subTitle="Bạn chưa có cuộc trò chuyện nào."
      />
    );
  }

  redirect(`/messages/${conversations[0].id}`);
};

export default MessagesPage;