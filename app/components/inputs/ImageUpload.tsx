"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { MdAddAPhoto, MdClose } from "react-icons/md";
import { toast } from "react-hot-toast";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value = [],
  maxImages = 6,
}) => {
  const [images, setImages] = useState<string[]>(value || []);

  useEffect(() => {
    setImages(value || []);
  }, [value]);

  const updateImages = useCallback(
    (nextImages: string[]) => {
      setImages(nextImages);
      onChange(nextImages);
    },
    [onChange]
  );

  const handleUpload = useCallback(
    (result: any) => {
      const uploadedUrl = result.info?.secure_url;

      if (!uploadedUrl) {
        return;
      }

      setImages((current) => {
        if (current.length >= maxImages) {
          toast.error(`Chỉ được tải tối đa ${maxImages} ảnh`);
          return current;
        }

        if (current.includes(uploadedUrl)) {
          return current;
        }

        const nextImages = [...current, uploadedUrl].slice(0, maxImages);

        onChange(nextImages);

        return nextImages;
      });
    },
    [onChange, maxImages]
  );

  const handleRemove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, imageUrl: string) => {
      event.stopPropagation();

      const nextImages = images.filter((item) => item !== imageUrl);
      updateImages(nextImages);
    },
    [images, updateImages]
  );

  return (
    <div className="flex flex-col gap-4">
      <CldUploadWidget
        onSuccess={handleUpload}
        uploadPreset="dwcjcnshm"
        options={{
          maxFiles: maxImages,
          multiple: true,
          sources: ["local", "url"],
        }}
      >
        {({ open }) => {
          return (
            <div
              onClick={() => open?.()}
              className="
                relative
                cursor-pointer
                hover:opacity-70
                transition
                border-dashed
                border-2
                p-20
                border-neutral-300
                flex
                flex-col
                justify-center
                items-center
                gap-4
                text-neutral-600
              "
            >
              <MdAddAPhoto size={50} />

              <div className="font-semibold text-lg">Bấm để tải lên ảnh</div>

              <div className="text-sm text-neutral-500">
                Đã chọn {images.length}/{maxImages} ảnh
              </div>
            </div>
          );
        }}
      </CldUploadWidget>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="relative aspect-square rounded-xl overflow-hidden border"
            >
              <Image
                alt={`Upload ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                src={imageUrl}
              />

              {index === 0 && (
                <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Ảnh bìa
                </div>
              )}

              <button
                onClick={(event) => handleRemove(event, imageUrl)}
                type="button"
                className="
                  absolute
                  top-2
                  right-2
                  h-8
                  w-8
                  rounded-full
                  bg-white
                  shadow-md
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                "
              >
                <MdClose size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;