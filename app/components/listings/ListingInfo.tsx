"use client";

import { useState } from "react";
import useVietnamLocations from "@/app/hooks/useVietnamLocations";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import Modal from "../modals/Modal";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map"), { ssr: false });

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;

  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
}) => {
  const { getByValue } = useVietnamLocations();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const coordinates = getByValue(locationValue)?.latlng;

  const shortDescription =
    description.length > 180
      ? description.substring(0, 180) + "..."
      : description;

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Được đăng bởi {user?.name}</div>
          <Avatar src={user?.image} />
        </div>

        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{guestCount} khách.</div>
          <div>{roomCount} phòng ngủ.</div>
          <div>{bathroomCount} phòng tắm.</div>
        </div>
      </div>

      <hr />

      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}

      <hr />

      <div>
        <div className="text-lg font-light text-neutral-500 whitespace-pre-line">
          {shortDescription}
        </div>

        {description.length > 180 && (
          <button
            onClick={() => setIsDescriptionOpen(true)}
            className="mt-2 font-semibold underline"
          >
            Xem thêm
          </button>
        )}

        <Modal
          isOpen={isDescriptionOpen}
          onClose={() => setIsDescriptionOpen(false)}
          onSubmit={() => setIsDescriptionOpen(false)}
          title="Mô tả chỗ ở"
          actionLabel="Đóng"
          body={
            <div className="text-neutral-700 whitespace-pre-line leading-7 max-h-[60vh] overflow-y-auto">
              {description}
            </div>
          }
        />
      </div>

      <hr />

      <Map center={coordinates} />
    </div>
  );
};

export default ListingInfo;