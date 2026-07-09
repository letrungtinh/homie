import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Chưa đăng nhập", { status: 401 });
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    return new NextResponse("ID chỗ ở không hợp lệ", { status: 400 });
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Chưa đăng nhập", { status: 401 });
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    return new NextResponse("ID chỗ ở không hợp lệ", { status: 400 });
  }

  const body = await request.json();

  const {
    title,
    description,
    price,
    category,
    location,
    guestCount,
    roomCount,
    bathroomCount,
    imageSrc,
    imageSrcs,
  } = body;

  const images = Array.isArray(imageSrcs) ? imageSrcs : [];

  if (
    !title ||
    !description ||
    !price ||
    !category ||
    !location?.value ||
    !guestCount ||
    !roomCount ||
    !bathroomCount
  ) {
    return new NextResponse("Thiếu thông tin", { status: 400 });
  }

  if (images.length === 0 && !imageSrc) {
    return new NextResponse("Vui lòng tải lên ít nhất 1 ảnh", { status: 400 });
  }

  const updatedListing = await prisma.listing.updateMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
    data: {
      title,
      description,
      price: Number(price),
      category,
      locationValue: location.value,
      guestCount: Number(guestCount),
      roomCount: Number(roomCount),
      bathroomCount: Number(bathroomCount),
      imageSrc: images[0] || imageSrc,
      imageSrcs: images.length > 0 ? images : [imageSrc],
    },
  });

  if (updatedListing.count === 0) {
    return new NextResponse("Không tìm thấy chỗ ở để sửa", { status: 404 });
  }

  return NextResponse.json(updatedListing);
}