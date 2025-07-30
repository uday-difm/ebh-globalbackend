"use client";

import Script from 'next/script';
import Footer from '../common/Footer';
import Header from '../common/Header';
import './globals.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./pagination.css";
import CookiesBanner from '../common/CookiesBanner';
import ReduxProviderWrapper from './ReduxProviderWrapper';
import AuthProvider from './AuthProvider';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        {/* This script is required for the 3D model */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          type="module"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ReduxProviderWrapper>
          <AuthProvider>
            {!pathname.startsWith('/dashboard') && <Header />}
            <main className="flex-grow ">
              {children}
            </main>
            <CookiesBanner />
            {!pathname.startsWith('/dashboard') && <Footer />}
          </AuthProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}




