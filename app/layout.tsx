import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./global.css"

const APP_NAME = "Serwist example";
const APP_DESCRIPTION = "This is an example of using Serwist with Next.js";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s - PWA App",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

// export const viewport: Viewport = {
//   themeColor: "rgb(23, 23, 23)",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
      </head>
      {/* <body className="h-screen bg-gradient-to-b from-ebony-950 from-70% to-black-pearl-950">{children}</body> */}
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
