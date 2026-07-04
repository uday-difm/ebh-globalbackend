'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ReduxProviderWrapper from '../app/ReduxProviderWrapper';
import AuthProvider from '../app/AuthProvider';
import ScrollProgressBar from '../component/ScrollProgressBar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CookiesBanner from '../common/CookiesBanner';

export default function EbhPublicWrapper({ children }) {
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

  return (
    <ReduxProviderWrapper>
      <AuthProvider>
        <ScrollProgressBar />
        <Header />
        <main className="flex-grow">{children}</main>
        <CookiesBanner />
        <Footer />
      </AuthProvider>
    </ReduxProviderWrapper>
  );
}
