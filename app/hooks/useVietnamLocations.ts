import { vietnamLocations } from "@/app/data/vietnamLocations";

const useVietnamLocations = () => {
  const getAll = () => vietnamLocations;

  const getByValue = (value: string) => {
    return vietnamLocations.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useVietnamLocations;