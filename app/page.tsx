import type { Metadata } from "next";
import NotificationSender from "components/NotificationSender";
import Ratings from "components/Ratings";

export const metadata: Metadata = {
  title: "Home",
};

const categories = [
  "Exercise",
  "Diet",
  "Sleep",
  "Work",
  "Relationships",
];

export default function Page() {
  return (
    <div className="flex flex-col grow items-center">
      {/* <NavBar /> */}
      {/* <NotificationPermission /> */}
      <div className="grow flex flex-col justify-center">
        <Ratings categories={categories} />
      </div>
        <NotificationSender />
    </div>
  );
}
