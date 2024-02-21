import type { Metadata } from "next";
import NotificationPermission from "../components/NotificationPermission";
import NotificationSender from "../components/NotificationSender";
import StarRating from "../components/Score";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <>
      <h1>Integrity Check v0.1</h1>
      <NotificationPermission />
      <NotificationSender />
      <StarRating />
    </>
  );
}
