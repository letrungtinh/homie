export const dynamic = "force-dynamic";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return (
         <ClientOnly>
            <EmptyState
               title="Bạn chưa đăng nhập"
               subTitle="Vui lòng đăng nhập để xem các đơn đặt phòng."
            />
         </ClientOnly>
      );
   }

   const reservations = await getReservations({
      authorId: currentUser.id,
   });

   if (reservations.length === 0) {
      return (
         <ClientOnly>
            <EmptyState
               title="Chưa có đơn đặt phòng"
               subTitle="Hiện chưa có ai đặt chỗ ở của bạn."
            />
         </ClientOnly>
      );
   }

   return (
      <ClientOnly>
         <ReservationsClient
            reservations={reservations}
            currentUser={currentUser}
         />
      </ClientOnly>
   );
};

export default ReservationsPage;