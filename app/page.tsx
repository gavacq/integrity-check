import type { Metadata } from "next";
import NotificationPermission from "../components/NotificationPermission";
import NotificationSender from "../components/NotificationSender";
import StarRating from "../components/StarRating";
import Ratings from "components/Ratings";
import NavBar from "components/NavBar";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <div className="flex flex-col grow items-center">
      {/* <NavBar /> */}
      {/* <NotificationPermission /> */}
      <div className="grow flex flex-col justify-center">
        <Ratings categories={[
          "Exercise",
          // "Diet",
          // "Sleep",
          // "Work",
          // "Relationships",
        ]} />
      </div>
      <div className="bg-shuttle-gray-800 rounded mt-auto w-5/6">
        <NotificationSender />
      </div>
    </div>
  );
}
