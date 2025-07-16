'use client';

import { useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';
import Link from 'next/link';

const CookiesBanner = () => {
  const [lang] = useState('en');

  const handleAccept = () => {
    Cookies.set('cookieAccepted', 'true', { expires: 365 });
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
      style={{ background: '#000' }}
      buttonStyle={{
        background: 'green',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        borderRadius: '6px',
        padding: '10px 24px',
      }}
      declineButtonStyle={{
        background: 'gray',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        borderRadius: '6px',
        padding: '10px 24px',

      }}
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
