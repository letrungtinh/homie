"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";

interface MessageUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ListingInfo {
  id: string;
  title: string;
  imageSrc: string;
  locationValue: string;
  price?: number;
  category?: string;
}

interface MessageListingInfoProps {
  listing: ListingInfo;
  host: MessageUser;
  getLocationTitle: (locationValue?: string) => string;
  formatPrice: (price?: number) => string;
  onBackToChat?: () => void;
}

const MessageListingInfo: React.FC<MessageListingInfoProps> = ({
  listing,
  host,
  getLocationTitle,
  formatPrice,
  onBackToChat,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-w-0 bg-white border border-neutral-300 shadow-md rounded-2xl overflow-hidden h-[calc(100vh-135px)]">
      <div className="px-7 py-6 border-b border-neutral-200">
        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="xl:hidden text-sm font-semibold underline mb-4"
          >
            Quay lại tin nhắn
          </button>
        )}

        <div className="text-2xl font-semibold">Lượt đặt</div>
      </div>

      <div className="px-7 py-6 flex flex-col gap-7 overflow-y-auto">
        <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-neutral-100">
          {listing.imageSrc ? (
            <img
              src={listing.imageSrc}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-neutral-500">
              Không có ảnh phòng
            </div>
          )}
        </div>

        <div>
          <div className="text-xl font-semibold">
            Bạn sẵn sàng đặt phòng chưa?
          </div>

          <div className="text-sm text-neutral-600 mt-2 mb-4">
            Chủ phòng cho phép khách đặt ngay.
          </div>

          <Button
            label="Đặt phòng ngay"
            onClick={() => router.push(`/listings/${listing.id}`)}
          />
        </div>

        <div className="border-t border-neutral-200 pt-7">
          <div className="text-2xl font-semibold mb-5">
            Thông tin chuyến đi
          </div>

          <div
            onClick={() => router.push(`/listings/${listing.id}`)}
            className="flex items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="min-w-0">
              <div className="font-semibold text-base leading-snug break-words">
                {listing.title}
              </div>

              <div className="text-sm text-neutral-500 mt-1 break-words">
                {listing.category || "Chỗ ở"} ·{" "}
                {getLocationTitle(listing.locationValue)}
              </div>
            </div>

            <div className="text-3xl text-neutral-700 group-hover:translate-x-1 transition shrink-0">
              ›
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-neutral-500">Chủ nhà là</div>
              <div className="font-semibold text-base mt-1 break-words">
                {host.name || host.email}
              </div>
            </div>

            <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center">
              {host.image ? (
                <img
                  src={host.image}
                  alt={host.name || "Chủ nhà"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-semibold text-neutral-500">
                  {(host.name || host.email || "H").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <div className="text-sm text-neutral-500">Giá cho 1 đêm</div>
          <div className="font-semibold text-lg text-cyan-600 mt-1">
            {formatPrice(listing.price)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageListingInfo;