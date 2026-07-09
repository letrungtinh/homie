import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EditPropertyClient from "./EditPropertyClient";

interface IParams {
  listingId?: string;
}

const EditPropertyPage = async ({
  params,
}: {
  params: Promise<IParams>;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Chưa đăng nhập" subTitle="Vui lòng đăng nhập" />
      </ClientOnly>
    );
  }

  const resolvedParams = await params;

  const listing = await getListingById(resolvedParams);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState title="Không tìm thấy" subTitle="Không tìm thấy chỗ ở này" />
      </ClientOnly>
    );
  }

  if (listing.userId !== currentUser.id) {
    return (
      <ClientOnly>
        <EmptyState
          title="Không có quyền"
          subTitle="Bạn không thể sửa chỗ ở này"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <EditPropertyClient listing={listing} />
    </ClientOnly>
  );
};

export default EditPropertyPage;