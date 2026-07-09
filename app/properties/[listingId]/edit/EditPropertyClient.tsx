"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SafeListing } from "@/app/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import Counter from "@/app/components/inputs/Counter";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import { categories } from "@/app/components/navbar/Categories";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import LocationSelect from "@/app/components/inputs/LocationSelect";
import Button from "@/app/components/Button";
import Textarea from "@/app/components/inputs/Textarea";

const EditPropertyClient = ({ listing }: { listing: SafeListing }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      category: listing.category,
      location: {
        value: listing.locationValue,
        label: listing.locationValue,
      },
      guestCount: listing.guestCount,
      roomCount: listing.roomCount,
      bathroomCount: listing.bathroomCount,
      imageSrc: listing.imageSrc,
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
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/Map"), {
        ssr: false,
      }),
    [location]
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
      .catch(() => {
        toast.error("Có lỗi xảy ra.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pb-20">
        <Heading
          title="Sửa chỗ ở"
          subtitle="Cập nhật thông tin chỗ ở của bạn"
        />

        <div className="mt-10 flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <Heading
              title="Danh mục chỗ ở"
              subtitle="Chọn loại chỗ ở phù hợp"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((item) => (
                <CategoryInput
                  key={item.label}
                  onClick={(category) =>
                    setCustomValue("category", category)
                  }
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>

          <hr />

          <div className="flex flex-col gap-8">
            <Heading
              title="Vị trí chỗ ở"
              subtitle="Cập nhật địa điểm của chỗ ở"
            />

            <LocationSelect
              value={location}
              onChange={(value) => setCustomValue("location", value)}
            />

            <Map center={location?.latlng} />
          </div>

          <hr />

          <div className="flex flex-col gap-8">
            <Heading
              title="Thông tin cơ bản"
              subtitle="Cập nhật số khách, phòng ngủ và phòng tắm"
            />

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
          </div>

          <hr />

          <div className="flex flex-col gap-8">
            <Heading
              title="Hình ảnh chỗ ở"
              subtitle="Cập nhật hình ảnh đại diện cho chỗ ở"
            />

            <ImageUpload
              onChange={(value) => setCustomValue("imageSrc", value)}
              value={imageSrc}
            />
          </div>

          <hr />

          <div className="flex flex-col gap-8">
     

            <Input
              id="title"
              label="Tiêu đề"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />

            <Textarea
              id="description"
              label="Mô tả"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>

          <hr />

          <div className="flex flex-col gap-8">

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
          </div>

          <div className="flex flex-row gap-4">
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