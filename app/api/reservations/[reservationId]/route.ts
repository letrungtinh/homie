import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Chưa đăng nhập", { status: 401 });
  }

  const { reservationId } = await params;

  if (!reservationId || typeof reservationId !== "string") {
    return new NextResponse("ID không hợp lệ", { status: 400 });
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [
        {
          userId: currentUser.id,
        },
        {
          listing: {
            is: {
              userId: currentUser.id,
            },
          },
        },
      ],
    },
  });

  return NextResponse.json(reservation);
}