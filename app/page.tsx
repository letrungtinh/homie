export const dynamic = "force-dynamic";

import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingParams } from "./actions/getListings";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import ListingSection from "./components/listings/ListingSection";

interface HomeProps {
  searchParams?: Promise<IListingParams>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;
  const isFiltered = Object.keys(params || {}).length > 0;
  const listings = await getListings(params || {});
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }
  if (isFiltered) {
  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              data={listing}
              currentUser={currentUser}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}

  const hcmListings = listings.filter(
    (listing) => listing.locationValue === "tp-ho-chi-minh",
  );

  const haNoiListings = listings.filter(
    (listing) => listing.locationValue === "ha-noi",
  );

  const daNangListings = listings.filter(
    (listing) => listing.locationValue === "da-nang",
  );

  const hueListings = listings.filter(
    (listing) => listing.locationValue === "hue",
  );

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 flex flex-col gap-12">
          <ListingSection
            title="Nơi lưu trú được ưu chuộng tại Thành phố Hồ Chí Minh"
            listings={hcmListings}
            currentUser={currentUser}
          />

          <ListingSection
            title="Nơi lưu trú tại Hà Nội"
            listings={haNoiListings}
            currentUser={currentUser}
          />

          <ListingSection
            title="Chỗ ở tại Đà Nẵng"
            listings={daNangListings}
            currentUser={currentUser}
          />

          <ListingSection
            title="Còn phòng tại thành phố Huế vào tháng tới"
            listings={hueListings}
            currentUser={currentUser}
          />
        </div>
      </Container>
    </ClientOnly>
  );
};


export default Home;
