import type { Metadata } from "next";
import Ratings from "components/Ratings";
import AuthProtected from "components/AuthProtected";
import IconTray from "components/IconTray";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    // <AuthProtected>
      // <div className="grow flex flex-col">
          <Ratings />
          // <IconTray />
      // </div>
    // </AuthProtected>
  );
}
