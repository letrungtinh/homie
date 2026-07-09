"use client";

import { useState } from "react";
import useVietnamLocations from "@/app/hooks/useVietnamLocations";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Modal from "../modals/Modal";

interface ListingHeadProps {
  title: string;
  imageSrc?: string | null;
  imageSrcs?: string[] | null;
  locationValue: string;
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  imageSrc,
  imageSrcs = [],
  locationValue,
  id,
  currentUser,
}) => {
  const { getByValue } = useVietnamLocations();
  const location = getByValue(locationValue);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const images =
    imageSrcs && imageSrcs.length > 0
      ? imageSrcs
      : imageSrc
      ? [imageSrc]
      : [];

  const coverImage = images[0];
  const sideImages = images.slice(1, 5);

  return (
    <>
      <Heading title={title} subtitle={location?.label} />

      <div className="relative">
        {images.length <= 1 ? (
          <div
            onClick={() => setIsImageModalOpen(true)}
            className="relative w-full h-[60vh] rounded-xl overflow-hidden cursor-pointer bg-neutral-100"
          >
            {coverImage ? (
              <Image
                alt={title}
                src={coverImage}
                fill
                className="object-cover w-full h-full hover:scale-105 transition"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                Chưa có ảnh
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden bg-neutral-100">
            <div
              onClick={() => setIsImageModalOpen(true)}
              className="relative aspect-square md:aspect-auto md:h-[60vh] md:col-span-2 md:row-span-2 cursor-pointer"
            >
              <Image
                alt={title}
                src={coverImage}
                fill
                className="object-cover w-full h-full hover:scale-105 transition"
              />
            </div>

            {sideImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                onClick={() => setIsImageModalOpen(true)}
                className="relative hidden md:block h-[calc(30vh-4px)] cursor-pointer"
              >
                <Image
                  alt={`${title} ${index + 2}`}
                  src={image}
                  fill
                  className="object-cover w-full h-full hover:scale-105 transition"
                />
              </div>
            ))}
          </div>
        )}

        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>

        {images.length > 1 && (
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="absolute bottom-5 right-5 bg-white text-neutral-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
          >
            {images.length} ảnh
          </button>
        )}
      </div>

      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={() => setIsImageModalOpen(false)}
        title="Tất cả hình ảnh"
        actionLabel="Đóng"
        body={
          <div className="max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100"
              >
                <Image
                  alt={`${title} ${index + 1}`}
                  src={image}
                  fill
                  className="object-cover w-full h-full"
                />

                {index === 0 && (
                  <div className="absolute top-3 left-3 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Ảnh bìa
                  </div>
                )}
              </div>
            ))}
          </div>
        }
      />
    </>
  );
};

export default ListingHead;