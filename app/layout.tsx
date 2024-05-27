import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './global.css';
import NavBar from 'components/NavBar';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config.cjs';
import { AuthProvider } from '../providers/AuthContext';
import { CSPostHogProvider } from 'providers/PostHog';

const APP_NAME = 'Integrity Check';
const APP_DESCRIPTION =
  'Quantify and analyze your personal growth through daily integrity ratings';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: '%s - Integrity Check',
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};


const fullConfig = resolveConfig(tailwindConfig);
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: fullConfig.theme.colors['ebony'][950],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen custom-background-gradient">
          <AuthProvider>
            <CSPostHogProvider>
              <NavBar />
              <main className="flex grow">{children}</main>
            </CSPostHogProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
