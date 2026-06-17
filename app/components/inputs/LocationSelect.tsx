"use client";

import useVietnamLocations from "@/app/hooks/useVietnamLocations";
import Select from "react-select";

export type LocationSelectValue = {
  label: string;
  latlng: number[];
  value: string;
};

interface LocationSelectProps {
  value?: LocationSelectValue;
  onChange: (value: LocationSelectValue) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
}) => {
  const { getAll } = useVietnamLocations();

  return (
    <div>
      <Select
        placeholder="Chọn tỉnh/thành phố"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as LocationSelectValue)}
        formatOptionLabel={(option: any) => (
          <div>{option.label}</div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default LocationSelect;