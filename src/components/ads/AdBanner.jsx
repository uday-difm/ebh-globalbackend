"use client";

import { useEffect, useState } from "react";

export default function AdBanner({ zone, fallback = null }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchAd() {
      try {
        const response = await fetch(`/api/ads/serve?zone=${encodeURIComponent(zone)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ads for zone: ${zone}`);
        }
        const result = await response.json();
        
        // Adjust for any nested API response format (e.g. apiSuccess formats as { success: true, data: { ads: [...] } })
        const adsList = result.data?.ads || result.ads;

        if (active && Array.isArray(adsList) && adsList.length > 0) {
          // Select an ad randomly from the active ones
          const randomIndex = Math.floor(Math.random() * adsList.length);
          const selectedAd = adsList[randomIndex];
          setAd(selectedAd);

          // Track impression
          fetch("/api/ads/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ adId: selectedAd.id, type: "impression" }),
          }).catch((err) => console.error("Ad impression tracking failed:", err));
        }
      } catch (error) {
        console.warn("AdBanner fetch error:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAd();

    return () => {
      active = false;
    };
  }, [zone]);

  const handleAdClick = () => {
    if (!ad) return;
    fetch("/api/ads/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adId: ad.id, type: "click" }),
    }).catch((err) => console.error("Ad click tracking failed:", err));
  };

  if (loading) {
    return null;
  }

  if (!ad) {
    return fallback;
  }

  // Render AdSense / Custom HTML script injection
  if (ad.type === "adsense" && ad.code) {
    return (
      <div 
        className="ad-container ad-adsense my-4 w-full flex justify-center overflow-hidden"
        dangerouslySetInnerHTML={{ __html: ad.code }}
      />
    );
  }

  // Render Image Banner
  if (ad.type === "banner" && ad.imageUrl) {
    return (
      <div className="ad-container ad-banner my-4 w-full flex justify-center">
        <a
          href={ad.targetUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className="block relative overflow-hidden max-w-full hover:opacity-90 transition-opacity rounded-lg shadow-sm"
        >
          {/* Using img tag to avoid next/image domain whitelisting restrictions for external advertiser assets */}
          <img
            src={ad.imageUrl}
            alt={ad.name || "Advertisement"}
            className="object-contain max-h-[300px] w-auto h-auto rounded-lg mx-auto"
            loading="lazy"
          />
        </a>
      </div>
    );
  }

  return fallback;
}
