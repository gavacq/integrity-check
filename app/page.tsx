import type { Metadata } from "next";
import NotificationSender from "components/NotificationSender";
import Ratings from "components/Ratings";
import AuthProtected from "components/AuthProtected";
import { AuthProvider } from "providers/AuthContext";
import IconTray from "components/IconTray";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <div className="flex flex-col grow justify-center">
      {/* <NavBar /> */}
      {/* <NotificationPermission /> */}
        <AuthProvider>
          <AuthProtected>
            <Ratings />
            <IconTray />
          </AuthProtected>
        </AuthProvider>
        {/* <NotificationSender /> */}
    </div>
  );
}
