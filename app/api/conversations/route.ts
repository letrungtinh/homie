import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { message: "Thiếu thông tin phòng" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Không tìm thấy phòng" },
        { status: 404 }
      );
    }

    if (listing.userId === currentUser.id) {
      return NextResponse.json(
        { message: "Bạn không thể nhắn tin cho chính phòng của mình" },
        { status: 400 }
      );
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        guestId: currentUser.id,
        hostId: listing.userId,
        listingId: listing.id,
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    const conversation = await prisma.conversation.create({
      data: {
        guestId: currentUser.id,
        hostId: listing.userId,
        listingId: listing.id,
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo cuộc trò chuyện" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập" },
        { status: 401 }
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
      include: {
        guest: true,
        host: true,
        listing: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách cuộc trò chuyện" },
      { status: 500 }
    );
  }
}