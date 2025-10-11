"use client";

import { useEffect, useState } from 'react';
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
  const [darkMode, setDarkMode] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ebh-dark-mode');
    if (stored === 'true') setDarkMode(true);
  }, []);

  // Apply dark mode class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('ebh-dark-mode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('ebh-dark-mode', 'false');
    }
  }, [darkMode]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Updated Analytics Code */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NEWID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NEWID', { page_path: window.location.pathname });
            `
          }}
        />

        {/* Organisation Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.earthbyhumans.com/#organization",
              "name": "Earth by Humans",
              "alternateName": "Earth By Humans",
              "url": "https://www.earthbyhumans.com",
              "logo": "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/favicon.ico",
              "image": "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/favicon.ico",
              "description": "Earth by Humans — curated stories, videos and products celebrating sustainable living, ethical design and mindful consumption.",
              "email": "mailto:info@earthbyhumans.com",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "info@earthbyhumans.com",
                "availableLanguage": "English",
                "areaServed": "Global"
              },
              "sameAs": [
                "https://www.linkedin.com/company/earth-by-humans/",
                "https://www.facebook.com/earthbyhumans",
                "https://www.instagram.com/earth_by_humans/",
                "https://www.youtube.com/@EarthByHumans",
                "https://x.com/earthbyhumans"
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.earthbyhumans.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }`
          }}
        />

        {/* AdSense (without data-nscript) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />

      </head>
      <body className="flex flex-col min-h-screen font-poppins" cz-shortcut-listen="true">
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


