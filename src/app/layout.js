// MODIFIED: Import the Script component from Next.js
import Script from 'next/script';
import Footer from '@/common/Footer';
import Header from '@/common/Header';
import './globals.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./pagination.css";
import CookiesBanner from '@/common/CookiesBanner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* This script is required for the 3D model */}
        <Script 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" 
          type="module"
          strategy="beforeInteractive" 
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
         <CookiesBanner />
        <Footer />
      </body>
    </html>
  );
}