'use client';

import { useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';
import Link from 'next/link';

const CookiesBanner = () => {
  const [lang] = useState('en'); // Reserved for i18n use if needed

  const handleAccept = () => {
    Cookies.set('cookieAccepted', 'true', { expires: 365 }); // 1 year
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <CookieConsent
      location="bottom"
      enableDeclineButton
      buttonText="Accept"
      declineButtonText="Close"
      cookieName="cookieAccepted"
      style={{ background: '#000' }} // Tailwind can’t be used directly here
      buttonWrapperClasses="flex gap-4"
      buttonClasses="bg-green-600 text-white font-bold text-base rounded px-6 py-2 "
      declineButtonClasses="bg-white text-black font-bold text-base rounded px-6 py-2"
      setDeclineCookie={false}
      onAccept={({ acceptedByScrolling }) => {
        if (!acceptedByScrolling) handleAccept();
      }}
    >
      <span className="text-white text-sm sm:text-base leading-relaxed">
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.&nbsp;
        <Link
          href="/privacy-policy"
          className="underline text-purple-400 font-bold hover:text-purple-300 transition"
          onClick={scrollToTop}
        >
          Privacy Policy
        </Link>
        &nbsp;and&nbsp;
        <Link
          href="/terms-and-conditions"
          className="underline text-purple-400 font-bold hover:text-purple-300 transition"
          onClick={scrollToTop}
        >
          Terms & Conditions
        </Link>
        
      </span>
    </CookieConsent>
  );
};

export default CookiesBanner;
