'use client';

import { useState } from 'react';
import CookieConsent from 'react-cookie-consent';

import Link from 'next/link';

const CookiesBanner = () => {
  const [lang] = useState('en');

  const handleAccept = async () => {


    // Prepare cookie data to send to the API
    const cookieData = {
      name: 'cookies',
      value: 'accepted',
      path: '/',
      domain: window.location.hostname, // optionally add domain if needed
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // expires 1 year from now
      httpOnly: false,
      secure: window.location.protocol === 'https:',
    };

    try {
      const res = await fetch('/api/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cookieData),
      });

      if (!res.ok) {
        console.error('Failed to save cookie in DB', await res.text());
      }
    } catch (error) {
      console.error('Error saving cookie in DB:', error);
    }
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
      // cookieName="cookieAccepted"
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
          className="underline text-green-400 font-bold hover:text-green-300 transition"
          onClick={scrollToTop}
        >
          Privacy Policy
        </Link>
        &nbsp;and&nbsp;
        <Link
          href="/terms-and-conditions"
          className="underline text-green-400 font-bold hover:text-green-300 transition"
          onClick={scrollToTop}
        >
          Terms & Conditions
        </Link>
      </span>
    </CookieConsent>
  );
};

export default CookiesBanner;
