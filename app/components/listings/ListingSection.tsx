"use client";

import { SafeListing, SafeUser } from "@/app/types";
import ListingCard from "./ListingCard";

interface ListingSectionProps {
  title: string;
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const ListingSection: React.FC<ListingSectionProps> = ({
  title,
  listings,
  currentUser,
}) => {
  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div className="w-full overflow-hidden">
        <div className="flex flex-row gap-6 overflow-x-auto pb-4">
          {listings.map((listing) => (
            <div key={listing.id} className="shrink-0 w-[260px]">
              <ListingCard data={listing} currentUser={currentUser} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingSection;