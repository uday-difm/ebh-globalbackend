"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = Cookies.get("cookie_table");
      if (consent !== "accepted") setIsVisible(true);
    } catch (e) {
      console.warn("Cookies unavailable:", e);
      setIsVisible(true);
    }
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
      try { Cookies.set("session_id", sessionId, { expires: 365 }); } catch (e) { console.warn("Set session_id failed:", e); }
    }
    return sessionId;
  };

  const handleAccept = async () => {
    const sessionId = ensureSessionId();

    // set client cookie immediately
    try { Cookies.set("cookie_table", "accepted", { expires: 365 }); } catch (e) { console.warn("Set cookie_table failed:", e); }
    setIsVisible(false);

    // 1) save consent (await and check)
    try {
      const res = await fetch("/api/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true, session_id: sessionId, consent_type: "general" }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Consent API error:", res.status, json);
      } else {
        console.log("Consent saved:", json);
      }
    } catch (err) {
      console.error("Failed to POST consent:", err);
    }

    // 2) collect readable cookies and save them (non-blocking)
    try {
      const raw = typeof document !== "undefined" ? document.cookie || "" : "";
      const pairs = raw.split(";").map((p) => p.trim()).filter(Boolean);
      const cookies = pairs.map((p) => {
        const eq = p.indexOf("=");
        const name = eq > -1 ? p.substring(0, eq) : p;
        const value = eq > -1 ? p.substring(eq + 1) : "";
        return { name: decodeURIComponent(name), value: decodeURIComponent(value), domain: window.location.hostname, path: "/" };
      });

      if (cookies.length > 0) {
        // send but don't block UI
        fetch("/api/cookies-storage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, cookies }),
        }).then(res => {
          if (!res.ok) console.warn("cookies-storage returned", res.status);
        }).catch(err => console.warn("Failed to store cookies:", err));
      }
    } catch (err) {
      console.warn("Failed to parse/send document.cookie:", err);
    }
  };

  const handleDecline = async () => {
    const sessionId = ensureSessionId();
    try { Cookies.set("cookie_table", "declined", { expires: 365 }); } catch (e) { console.warn(e); }
    setIsVisible(false);

    try {
      const res = await fetch("/api/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: false, session_id: sessionId, consent_type: "general" }),
      });
      if (!res.ok) console.error("Decline API returned", res.status);
    } catch (err) {
      console.error("Failed to POST decline:", err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex flex-col md:flex-row items-center justify-between z-50 shadow-lg">
      <p className="text-sm text-center md:text-left mb-2 md:mb-0">
        We use cookies to enhance your experience. By continuing to use our site, you agree to our{" "}
        <a href="/privacy-policy" className="underline font-semibold hover:text-yellow-400 transition">Privacy Policy</a> and{" "}
        <a href="/terms-of-service" className="underline font-semibold hover:text-yellow-400 transition">Terms and Conditions</a>.
      </p>

      <div className="flex space-x-2 mt-2 md:mt-0">
        <button onClick={handleAccept} className="bg-green-600 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition shadow">Accept Cookies</button>
        <button onClick={handleDecline} className="bg-gray-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition shadow">Decline</button>
      </div>
    </div>
  );
}
