import type { Metadata } from "next";
import NotificationPermission from "../components/NotificationPermission";
import NotificationSender from "../components/NotificationSender";
import StarRating from "../components/Score";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <div className="bg-red-300">
      <h1 className="text-3xl font-bold underline">Integrity Check v0.1</h1>
      <NotificationPermission />
      <NotificationSender />
      <StarRating />
    </div>
  );
}
