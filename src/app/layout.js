'use client';

import { useEffect, useState } from 'react';
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
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const stored = localStorage.getItem('ebh-dark-mode');
    if (stored === 'true') setDarkMode(true);
  }, []);

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

 
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.earthbyhumans.com/#org",
        "name": "Earth By Humans",
        "url": "https://www.earthbyhumans.com/",
        "logo": "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif",
        "description": "Earth By Humans publishes human-interest stories, environmental features, magazines and curated blog content about people, places and culture.",
        "sameAs": [
          "https://www.instagram.com/earth_by_humans/",
          "https://www.facebook.com/earthbyhumans",
          "https://www.youtube.com/@EarthByHumans",
          "https://x.com/earthbyhumans"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.earthbyhumans.com/#website",
        "url": "https://www.earthbyhumans.com/",
        "name": "Earth By Humans",
        "publisher": { "@id": "https://www.earthbyhumans.com/#org" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.earthbyhumans.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://www.earthbyhumans.com/#nav",
        "name": "Main Navigation",
        "url": [
          "https://www.earthbyhumans.com/",
          "https://www.earthbyhumans.com/about-us",
          "https://www.earthbyhumans.com/blogs",
          "https://www.earthbyhumans.com/magazines",
          "https://www.earthbyhumans.com/magazine",
          "https://www.earthbyhumans.com/category/fun-zone",
          "https://www.earthbyhumans.com/contact-us"
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <link
          rel="canonical"
          href={`https://www.earthbyhumans.com${pathname || ''}`}
        />

        <link rel="preconnect" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Analytics */}
        <Script
          id="gtag-loader"
          src="https://www.googletagmanager.com/gtag/js?id=G-NEWID"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NEWID', { page_path: window.location.pathname });
            `
          }}
        />

        {/* SCHEMA variable here */}
        <Script
          id="site-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <Script
          id="adsense-loader"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>

      <body className="flex flex-col min-h-screen font-poppins">
        <ReduxProviderWrapper>
          <AuthProvider>
            <ScrollProgressBar />
            {!pathname.startsWith('/dashboard') && <Header />}
            <main className="flex-grow">{children}</main>
            <CookiesBanner />
            {!pathname.startsWith('/dashboard') && <Footer />}
          </AuthProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
