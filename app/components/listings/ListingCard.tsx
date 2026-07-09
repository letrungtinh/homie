"use client";

import useVietnamLocations from "@/app/hooks/useVietnamLocations";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;

  secondaryActionLabel?: string;
  secondaryActionId?: string;
  onSecondaryAction?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  secondaryActionLabel,
  secondaryActionId = "",
  onSecondaryAction,
}) => {
  const router = useRouter();
  const { getByValue } = useVietnamLocations();

  const location = getByValue(data.locationValue);

  const coverImage = data.imageSrcs?.[0] || data.imageSrc || "/images/placeholder.jpg";

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) return;

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const handleSecondaryAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) return;

      onSecondaryAction?.(secondaryActionId);
    },
    [onSecondaryAction, secondaryActionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "dd/MM/yyyy", { locale: vi })} - ${format(
      end,
      "dd/MM/yyyy",
      { locale: vi }
    )}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-neutral-200">
          <Image
            alt="Listing"
            src={coverImage}
            className="object-cover h-full w-full group-hover:scale-110 transition"
            fill
          />

          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>

          {data.imageSrcs && data.imageSrcs.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {data.imageSrcs.length} ảnh
            </div>
          )}
        </div>

        <div className="font-semibold text-lg">
          {location?.label || data.locationValue}
        </div>

        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>

        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            {price.toLocaleString("vi-VN")} ₫
          </div>

          {!reservation && <div className="font-light">/ đêm</div>}
        </div>

        {(onAction || onSecondaryAction) && (
          <div className="flex flex-row gap-2">
            {onSecondaryAction && secondaryActionLabel && (
              <Button
                disabled={disabled}
                small
                outline
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
              />
            )}

            {onAction && actionLabel && (
              <Button
                disabled={disabled}
                small
                label={actionLabel}
                onClick={handleCancel}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;