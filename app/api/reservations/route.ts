import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Chưa đăng nhập", { status: 401 });
  }

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return new NextResponse("Thiếu dữ liệu đặt phòng", { status: 400 });
  }

  const conflict = await prisma.reservation.findFirst({
    where: {
      listingId,
      startDate: {
        lte: new Date(endDate),
      },
      endDate: {
        gte: new Date(startDate),
      },
    },
  });

  if (conflict) {
    return new NextResponse("Phòng đã có người đặt trong thời gian này", {
      status: 409,
    });
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}