"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SafeListing } from "@/app/types";
import Container from "@/app/components/Container";
import Counter from "@/app/components/inputs/Counter";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import { categories } from "@/app/components/navbar/Categories";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import LocationSelect from "@/app/components/inputs/LocationSelect";
import Button from "@/app/components/Button";
import Textarea from "@/app/components/inputs/Textarea";
import useVietnamLocations from "@/app/hooks/useVietnamLocations";

const EditPropertyClient = ({ listing }: { listing: SafeListing }) => {
  const router = useRouter();
  const { getByValue } = useVietnamLocations();

  const [isLoading, setIsLoading] = useState(false);

  const currentLocation = getByValue(listing.locationValue);

  const defaultImages =
    listing.imageSrcs && listing.imageSrcs.length > 0
      ? listing.imageSrcs
      : listing.imageSrc
      ? [listing.imageSrc]
      : [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      category: listing.category,
      location: currentLocation || {
        value: listing.locationValue,
        label: listing.locationValue,
      },
      guestCount: listing.guestCount,
      roomCount: listing.roomCount,
      bathroomCount: listing.bathroomCount,
      imageSrcs: defaultImages,
      price: listing.price,
      title: listing.title,
      description: listing.description,
    },
  });

  const location = watch("location");
  const category = watch("category");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrcs = watch("imageSrcs");

  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/Map"), {
        ssr: false,
      }),
    []
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .put(`/api/listings/${listing.id}`, data)
      .then(() => {
        toast.success("Đã cập nhật chỗ ở!");
        router.push("/properties");
        router.refresh();
      })
      .catch((error) => {
        toast.error(error.response?.data || "Có lỗi xảy ra.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pb-20">
        <div className="pt-10 pb-6">
          <h1 className="text-3xl font-bold">Sửa chỗ ở</h1>
          <p className="text-neutral-500 mt-2">
            Cập nhật thông tin chỗ ở của bạn
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-10">
          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold">Danh mục</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((item) => (
                <CategoryInput
                  key={item.label}
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </div>
          </section>

          <hr />

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold">Vị trí</h2>

              <LocationSelect
                value={location}
                onChange={(value) => setCustomValue("location", value)}
              />
            </div>

            <div className="h-[300px] rounded-xl overflow-hidden">
              <Map center={location?.latlng} />
            </div>
          </section>

          <hr />

          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>

            <Counter
              onChange={(value) => setCustomValue("guestCount", value)}
              value={guestCount}
              title="Khách"
              subTitle="Bạn cho phép tối đa bao nhiêu khách?"
            />

            <hr />

            <Counter
              onChange={(value) => setCustomValue("roomCount", value)}
              value={roomCount}
              title="Phòng ngủ"
              subTitle="Chỗ ở của bạn có bao nhiêu phòng ngủ?"
            />

            <hr />

            <Counter
              onChange={(value) => setCustomValue("bathroomCount", value)}
              value={bathroomCount}
              title="Phòng tắm"
              subTitle="Chỗ ở của bạn có bao nhiêu phòng tắm?"
            />
          </section>

          <hr />

          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold">Hình ảnh</h2>
            <p className="text-sm text-neutral-500">
              Ảnh đầu tiên sẽ được dùng làm ảnh bìa chính.
            </p>

            <ImageUpload
              onChange={(value) => setCustomValue("imageSrcs", value)}
              value={imageSrcs}
              maxImages={6}
            />
          </section>

          <hr />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="title"
              label="Tiêu đề"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />

            <Input
              id="price"
              label="Giá thuê"
              formatPrice
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />

            <div className="md:col-span-2">
              <Textarea
                id="description"
                label="Mô tả"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              label="Hủy"
              outline
              onClick={() => router.push("/properties")}
              disabled={isLoading}
            />

            <Button
              label="Lưu thay đổi"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditPropertyClient;