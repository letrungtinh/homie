"use client";

import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

import {
  FaUmbrellaBeach,
  FaMountain,
  FaSwimmingPool,
  FaHome,
  FaBuilding,
  FaHouseUser,
  FaPaw,
  FaCity,
  FaCamera,
} from "react-icons/fa";

import {
  GiCastle,
  GiForestCamp,
  GiCutDiamond,
} from "react-icons/gi";

export const categories = [
  {
    label: "Biển",
    icon: FaUmbrellaBeach,
    description: "Gần biển hoặc có view biển",
  },
  {
    label: "Núi",
    icon: FaMountain,
    description: "Gần núi hoặc có view núi",
  },
  {
    label: "Hồ bơi",
    icon: FaSwimmingPool,
    description: "Có hồ bơi",
  },
  {
    label: "Homestay",
    icon: FaHome,
    description: "Không gian ấm cúng như ở nhà",
  },
  {
    label: "Villa",
    icon: GiCastle,
    description: "Biệt thự nguyên căn",
  },
  {
    label: "Căn hộ",
    icon: FaBuilding,
    description: "Căn hộ đầy đủ tiện nghi",
  },
  {
    label: "Nhà nguyên căn",
    icon: FaHouseUser,
    description: "Thuê toàn bộ căn nhà",
  },
  {
    label: "Cắm trại",
    icon: GiForestCamp,
    description: "Glamping hoặc khu cắm trại",
  },
  {
    label: "Sang trọng",
    icon: GiCutDiamond,
    description: "Chỗ ở cao cấp",
  },
  {
    label: "Thú cưng",
    icon: FaPaw,
    description: "Cho phép mang theo thú cưng",
  },
  {
    label: "Trung tâm",
    icon: FaCity,
    description: "Nằm ở trung tâm thành phố",
  },
  {
    label: "View đẹp",
    icon: FaCamera,
    description: "Có view đẹp để ngắm cảnh",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;