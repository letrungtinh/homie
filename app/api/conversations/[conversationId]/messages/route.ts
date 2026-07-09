import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  conversationId: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập" },
        { status: 401 }
      );
    }

    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        { message: "Thiếu mã cuộc trò chuyện" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Không tìm thấy cuộc trò chuyện" },
        { status: 404 }
      );
    }

    const isParticipant =
      conversation.guestId === currentUser.id ||
      conversation.hostId === currentUser.id;

    if (!isParticipant) {
      return NextResponse.json(
        { message: "Bạn không có quyền xem cuộc trò chuyện này" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy tin nhắn" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập" },
        { status: 401 }
      );
    }

    const { conversationId } = await params;
    const body = await request.json();
    const { message } = body;

    if (!conversationId || !message?.trim()) {
      return NextResponse.json(
        { message: "Thiếu nội dung tin nhắn" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Không tìm thấy cuộc trò chuyện" },
        { status: 404 }
      );
    }

    const isParticipant =
      conversation.guestId === currentUser.id ||
      conversation.hostId === currentUser.id;

    if (!isParticipant) {
      return NextResponse.json(
        { message: "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này" },
        { status: 403 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        body: message.trim(),
      },
      include: {
        sender: true,
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Có lỗi xảy ra khi gửi tin nhắn" },
      { status: 500 }
    );
  }
}