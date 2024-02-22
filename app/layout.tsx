import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./global.css"
import NavBar from "components/NavBar";

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
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1, // this causes a vertical scrollbar to appear
  minimumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}




export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen custom-background-gradient">
          <NavBar />
          <main className="flex grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
