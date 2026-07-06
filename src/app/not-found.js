"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [customConfig, setCustomConfig] = useState({
    title: "Oops! Page not found",
    description: "The page you are looking for does not exist or has been moved.",
    buttonText: "Return to Homepage",
    buttonLink: "/",
    redirectOn404: false,
    redirectUrl: "/",
    redirectDelay: 5
  });
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    // Set default title
    document.title = "404 - Page Not Found";
    
    // Fetch custom 404 settings
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";
    fetch(`/api/settings?siteId=${encodeURIComponent(siteId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load settings");
        return res.json();
      })
      .then((data) => {
        const ws = data?.data?.websiteSettings ?? data?.websiteSettings;
        if (ws?.custom404 && ws.custom404.enabled !== false) {
          const config = {
            title: ws.custom404.title || "Page Not Found",
            description: ws.custom404.description || "The page you are looking for does not exist.",
            buttonText: ws.custom404.buttonText || "Go Home",
            buttonLink: ws.custom404.buttonLink || "/",
            redirectOn404: !!ws.custom404.redirectOn404,
            redirectUrl: ws.custom404.redirectUrl || "/",
            redirectDelay: Number(ws.custom404.redirectDelay ?? 5)
          };
          setCustomConfig(config);
          document.title = `404 - ${config.title}`;

          // If auto-redirect is enabled, initialize countdown
          if (config.redirectOn404) {
            setCountdown(config.redirectDelay);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load custom 404 configuration:", err);
      });
  }, []);

  // Handle countdown timer for redirect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      router.push(customConfig.redirectUrl);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, customConfig.redirectUrl, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6 text-black">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto w-24 h-24 text-green-600 animate-bounce mb-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h2 className="text-6xl font-extrabold text-gray-800 tracking-tight">404</h2>
        <p className="mt-4 text-2xl font-medium text-gray-700">
          {customConfig.title}
        </p>
        <p className="mt-2 text-gray-500">
          {customConfig.description}
        </p>
        {countdown !== null && (
          <p className="mt-3 text-sm text-amber-600 font-medium">
            Auto-redirecting to {customConfig.redirectUrl} in {countdown}s...
          </p>
        )}
        <Link
          href={customConfig.buttonLink}
          className="mt-6 inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-md font-semibold rounded-xl transition-all shadow-md"
        >
          {customConfig.buttonText}
        </Link>
      </div>
    </div>
  );
}
