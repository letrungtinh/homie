import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";

import ToastProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Homiee",
  description: "We are Homiee",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${font.className} h-full antialiased`}>
        <ClientOnly>
          <ToastProvider />
          <RentModal />
          <RegisterModal />
          <LoginModal />

          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className = "pb-20 pt-28 ">
          {children}
          </div>
      </body>
    </html>
  );
}
