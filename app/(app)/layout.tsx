import type { ReactNode } from "react";
import IconTray from "components/IconTray";
import AuthProtected from "components/AuthProtected";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProtected>
      <div className="grow flex flex-col">
          {children}
          <IconTray />
      </div>
    </AuthProtected>
  );
}
