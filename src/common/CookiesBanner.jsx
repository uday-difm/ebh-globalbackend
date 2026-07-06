"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/api/compliance/config?siteId=ebh")
      .then(res => res.json())
      .then(resData => {
        const data = resData?.data?.compliance;
        if (data) {
          setConfig(data);
          // Only show banner if cookie consent banner is enabled in settings
          if (data.cookieConsentEnabled !== false) {
            const consent = Cookies.get("cookie_table");
            if (consent !== "accepted" && consent !== "declined") {
              setIsVisible(true);
            }
          }
        } else {
          // If no config, run on static defaults
          const consent = Cookies.get("cookie_table");
          if (consent !== "accepted" && consent !== "declined") {
            setIsVisible(true);
          }
        }
      })
      .catch(e => {
        console.warn("Failed to load compliance config, running on defaults:", e);
        const consent = Cookies.get("cookie_table");
        if (consent !== "accepted" && consent !== "declined") {
          setIsVisible(true);
        }
      });
  }, []);

  const ensureSessionId = () => {
    let sessionId = null;
    try {
      sessionId = Cookies.get("session_id");
    } catch (e) {
      console.warn("Cookies.get failed:", e);
    }
    if (!sessionId) {
      sessionId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : "s_" + Date.now();
      try { Cookies.set("session_id", sessionId, { expires: 30 }); } catch (e) { console.warn("Set session_id failed:", e); }
    }
    return sessionId;
  };

  const handleAccept = async () => {
    const sessionId = ensureSessionId();

    try { Cookies.set("cookie_table", "accepted", { expires: 365 }); } catch (e) { console.warn("Set cookie_table failed:", e); }
    try {
      localStorage.setItem("cookie_consent", JSON.stringify({ analytics: true, marketing: true }));
      window.dispatchEvent(new Event("cookieConsentChanged"));
    } catch (e) {}
    setIsVisible(false);

    try {
      const res = await fetch("/api/visitors/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: sessionId, accepted: true, analytics: true, marketing: true }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Consent API error:", res.status, json);
      }
    } catch (err) {
      console.error("Failed to POST consent:", err);
    }

    try {
      const raw = typeof document !== "undefined" ? document.cookie || "" : "";
      const pairs = raw.split(";").map((p) => p.trim()).filter(Boolean);
      const cookies = pairs.map((p) => {
        const eq = p.indexOf("=");
        const name = eq > -1 ? p.substring(0, eq) : p;
        const value = eq > -1 ? p.substring(eq + 1) : "";
        return { name: decodeURIComponent(name), value: decodeURIComponent(value), domain: window.location.hostname, path: "/" };
      });
    } catch (err) {
      console.warn("Failed to parse/send document.cookie:", err);
    }
  };

  const handleDecline = async () => {
    const sessionId = ensureSessionId();
    try { Cookies.set("cookie_table", "declined", { expires: 1 }); } catch (e) { console.warn(e); }
    try {
      localStorage.setItem("cookie_consent", JSON.stringify({ analytics: false, marketing: false }));
      window.dispatchEvent(new Event("cookieConsentChanged"));
    } catch (e) {}
    setIsVisible(false);

    try {
      const res = await fetch("/api/visitors/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: sessionId, accepted: false, analytics: false, marketing: false }),
      });
      if (!res.ok) console.error("Decline API returned", res.status);
    } catch (err) {
      console.error("Failed to POST decline:", err);
    }
  };

  if (!isVisible) return null;

  const message = config?.cookieConsentMessage || 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.';
  const acceptText = config?.acceptButtonText || 'Accept Cookies';
  const declineText = config?.declineButtonText || 'Close';
  return (
    <div className="fixed left-0 right-0 bg-black text-white p-4 flex flex-col md:flex-row items-center justify-between z-50 shadow-lg bottom-0 border-t border-slate-800 font-sans animate-in slide-in-from-bottom duration-250">
      <p className="text-sm text-center md:text-left mb-2 md:mb-0 max-w-5xl">
        {message} Read our{" "} 
        <a href="/legal/privacy" className="underline font-semibold text-green-400 hover:text-green-700 transition">Privacy Policy</a> and{" "}
        <a href="/legal/terms" className="underline font-semibold text-green-400 hover:text-green-700 transition">Terms and Conditions</a>.
      </p>

      <div className="flex space-x-2 mt-2 md:mt-0 shrink-0">
        <button onClick={handleDecline} className="bg-gray-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition shadow text-xs">
          {declineText}
        </button>
        <button onClick={handleAccept} className="bg-green-600 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition shadow text-xs">
          {acceptText}
        </button>
      </div>
    </div>
  );
}
