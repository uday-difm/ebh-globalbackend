"use client";

import { useEffect } from 'react';
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
import ScrollProgressBar from '../component/ScrollProgressBar';
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Add as needed
  variable: '--font-poppins',
})

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // This hook scrolls the window to the top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

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

        {/* Google AdSense — add this once in the head */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9048723765319602"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col min-h-screen font-poppins">
        <ReduxProviderWrapper>
          <AuthProvider>
            <ScrollProgressBar />
            {!pathname.startsWith('/dashboard') && <Header />}
            <main className="flex-grow">
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


// 'use client';

// import { useEffect } from 'react';
// import Script from 'next/script';
// import Footer from '../common/Footer';
// import Header from '../common/Header';
// import './globals.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./pagination.css";
// import CookiesBanner from '../common/CookiesBanner';
// import ReduxProviderWrapper from './ReduxProviderWrapper';
// import AuthProvider from './AuthProvider';
// import { usePathname } from 'next/navigation';
// import ScrollProgressBar from '../component/ScrollProgressBar';

// export default function RootLayout({ children }) {
//   const pathname = usePathname();

//   // ✅ Scroll to top on route change
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [pathname]);

//   return (
//     <html lang="en">
//       <head>
//         {/* This script is required for the 3D model */}
//         <Script
//           src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
//           type="module"
//           strategy="beforeInteractive"
//           crossOrigin="anonymous"
//         />
//       </head>
//       <body className="flex flex-col min-h-screen">
//         <ReduxProviderWrapper>
//           <AuthProvider>
//             <ScrollProgressBar />
//             {/* ✅ Hide Header/Footer on dashboard routes */}
//             {!pathname.startsWith('/dashboard') && <Header />}
//             <main className="flex-grow">
//               {children}
//             </main>
//             <CookiesBanner />
//             {!pathname.startsWith('/dashboard') && <Footer />}
//           </AuthProvider>
//         </ReduxProviderWrapper>
//       </body>
//     </html>
//   );
// }


