import type { ReactNode } from "react";
import IconTray from "components/IconTray";
import AuthProtected from "components/AuthProtected";
// import NotificationSender from "components/NotificationSender";


// const APP_NAME = "Integrity Check";
// const APP_DESCRIPTION = "Quantify and analyze your personal growth through daily integrity ratings"

// export const metadata: Metadata = {
//   applicationName: APP_NAME,
//   title: {
//     default: APP_NAME,
//     template: "%s - Integrity Check",
//   },
//   description: APP_DESCRIPTION,
//   manifest: "/manifest.json",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: APP_NAME,
//   },
//   formatDetection: {
//     telephone: false,
//   },
//   icons: {
//     shortcut: "/favicon.ico",
//     apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
//   },
// };

// // export const viewport: Viewport = {
// //   themeColor: "rgb(23, 23, 23)",
// // };
// const fullConfig = resolveConfig(tailwindConfig)
// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   // maximumScale: 1, // this causes a vertical scrollbar to appear
//   minimumScale: 1,
//   userScalable: false,
//   themeColor: fullConfig.theme.colors['ebony'][950],
//   // Also supported by less commonly used
//   // interactiveWidget: 'resizes-visual',
// }




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
