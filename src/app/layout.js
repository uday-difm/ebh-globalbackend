import { headers } from "next/headers";
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import prisma from "@/lib/prisma";
import './globals.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./pagination.css";

// ── Backend shell imports ─────────────────────────────────────────────────
import AuthProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SessionTimeoutHandler from "@/components/utils/SessionTimeoutHandler";
import { Toaster } from "sonner";
import "@/core/listeners";
import ReduxProviderWrapper from "@/app/ReduxProviderWrapper";

// ── EBH Public wrapper import ─────────────────────────────────────────────
import EbhPublicWrapper from "@/components/EbhPublicWrapper";
import { CtaPopups, CtaFloatingButtons } from "@yourcompany/global-backend-next/components";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export async function generateMetadata() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";
  const settings = await prisma.globalSettings.findUnique({
    where: { siteId },
    select: { websiteSettings: true }
  });
  const websiteSettings = settings?.websiteSettings || {};

  return {
    title: {
      default: websiteSettings.title || "Earth By Humans",
      template: websiteSettings.titleTemplate || "%s | Earth By Humans"
    },
    description: websiteSettings.description || "Earth By Humans publishes human-interest stories, environmental features, magazines and curated blog content about people, places and culture.",
    openGraph: {
      images: [
        {
          url: websiteSettings.ogImageUrl || "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif",
          alt: "Earth By Humans Logo",
        }
      ]
    }
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

function isAdminPath(pathname) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/crm") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/preview")
  );
}

function isPublicAuthPath(pathname) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forget-password")
  );
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "ebh";
  const settings = await prisma.globalSettings.findUnique({
    where: { siteId },
    select: {
      websiteSettings: true,
      analytics: true,
      scripts: true,
      ctaConfig: true,
    }
  });
  const websiteSettings = settings?.websiteSettings || {};
  const analytics = settings?.analytics || {};
  const scripts = settings?.scripts || {};
  const faviconUrl = websiteSettings.favicon || "/favicon.ico";
  const gaId = analytics.gaMeasurementId || analytics.googleAnalyticsId || "";
  const gtmId = analytics.gtmId || "";

  // ── Admin / CRM / Auth shell ────────────────────────────────────────────
  if (isAdminPath(pathname)) {
    const isPublicAuth = isPublicAuthPath(pathname);
    const content = isPublicAuth ? (
      <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
    ) : (
      children
    );

    return (
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <SessionTimeoutHandler timeoutMinutes={30} />
              {content}
              <Toaster richColors position="top-right" closeButton />
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // ── Public site layout ─────────────────────────────────────────────────
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
    <html lang="en" className={poppins.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={faviconUrl} />
        <meta property="og:image" content="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif" />
        <meta property="og:image:alt" content="Earth By Humans Logo" />

        <link
          rel="canonical"
          href={`https://www.earthbyhumans.com${pathname || ''}`}
        />

        <link rel="preconnect" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              id="gtag-loader"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
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
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `
              }}
            />
          </>
        )}

        {/* Google Tag Manager */}
        {gtmId && (
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `
            }}
          />
        )}

        {/* Custom Head Scripts from Admin Dashboard */}
        {scripts?.head && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const temp = document.createElement('div');
                  temp.innerHTML = ${JSON.stringify(scripts.head)};
                  const scripts = Array.from(temp.querySelectorAll('script'));
                  scripts.forEach(s => {
                    const newScript = document.createElement('script');
                    Array.from(s.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(s.innerHTML));
                    document.head.appendChild(newScript);
                  });
                  const nonScripts = Array.from(temp.childNodes).filter(node => node.tagName !== 'SCRIPT');
                  nonScripts.forEach(node => document.head.appendChild(node));
                })();
              `
            }}
          />
        )}

        {/* SCHEMA variable here */}
        <script
          id="site-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <Script
          id="adsense-loader"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>

      <body className="flex flex-col min-h-screen font-poppins" cz-shortcut-listen="true">
        {/* Custom Body Scripts from Admin Dashboard */}
        {scripts?.body && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const temp = document.createElement('div');
                  temp.innerHTML = ${JSON.stringify(scripts.body)};
                  const scripts = Array.from(temp.querySelectorAll('script'));
                  scripts.forEach(s => {
                    const newScript = document.createElement('script');
                    Array.from(s.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(s.innerHTML));
                    document.body.appendChild(newScript);
                  });
                  const nonScripts = Array.from(temp.childNodes).filter(node => node.tagName !== 'SCRIPT');
                  nonScripts.forEach(node => document.body.appendChild(node));
                })();
              `
            }}
          />
        )}
        <EbhPublicWrapper>
          {children}
        </EbhPublicWrapper>
        <CtaPopups ctaConfig={settings?.ctaConfig} />
        <CtaFloatingButtons ctaConfig={settings?.ctaConfig} />
      </body>
    </html>
  );
}
