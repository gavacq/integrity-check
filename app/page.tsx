import type { Metadata } from "next";
import NotificationPermission from "../components/NotificationPermission";
import NotificationSender from "../components/NotificationSender";
import StarRating from "../components/StarRating";
import Ratings from "components/Ratings";
import NavBar from "components/NavBar";

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
