"use client";

import qs from "query-string";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import LocationSelect, { LocationSelectValue } from "../inputs/LocationSelect";
import Heading from "../Heading";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState<LocationSelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    const currentQuery = params ? qs.parse(params.toString()) : {};

    const updatedQuery: Record<string, string | number | undefined> = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange.startDate,
    dateRange.endDate,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Tìm kiếm";
    }

    return "Tiếp theo";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Quay lại";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Bạn muốn đi đâu?"
        subtitle="Chọn địa điểm phù hợp cho chuyến đi của bạn."
      />

      <LocationSelect
        value={location}
        onChange={(value) => setLocation(value)}
      />

      <hr />

      <Map key={location?.value} center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Bạn muốn đi vào thời gian nào?"
          subtitle="Chọn ngày nhận phòng và trả phòng."
        />

        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Thông tin thêm"
          subtitle="Giúp chúng tôi tìm chỗ ở phù hợp nhất cho bạn."
        />

        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Khách"
          subTitle="Có bao nhiêu khách?"
        />

        <hr />

        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Phòng ngủ"
          subTitle="Bạn cần bao nhiêu phòng ngủ?"
        />

        <hr />

        <Counter
          onChange={(value) => setBathroomCount(value)}
          value={bathroomCount}
          title="Phòng tắm"
          subTitle="Bạn cần bao nhiêu phòng tắm?"
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Bộ lọc tìm kiếm"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;