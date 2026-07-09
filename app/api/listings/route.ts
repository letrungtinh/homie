import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Chưa đăng nhập", { status: 401 });
  }

  const body = await request.json();

  const {
    title,
    description,
    imageSrc,
    imageSrcs,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  if (
    !title ||
    !description ||
    !category ||
    !roomCount ||
    !bathroomCount ||
    !guestCount ||
    !location?.value ||
    !price
  ) {
    return new NextResponse("Thiếu thông tin", { status: 400 });
  }

  const images = Array.isArray(imageSrcs) ? imageSrcs : [];

  if (images.length === 0 && !imageSrc) {
    return new NextResponse("Vui lòng tải lên ít nhất 1 ảnh", { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc: images[0] || imageSrc,
      imageSrcs: images.length > 0 ? images : [imageSrc],
      category,
      roomCount: Number(roomCount),
      bathroomCount: Number(bathroomCount),
      guestCount: Number(guestCount),
      locationValue: location.value,
      price: Number(price),
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}