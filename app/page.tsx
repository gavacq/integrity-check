import type { Metadata } from "next";
import NotificationPermission from "../components/NotificationPermission";
import NotificationSender from "../components/NotificationSender";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <>
      <h1>Next.js + Serwist</h1>
      <NotificationPermission />
      <NotificationSender />
    </>
  );
}
