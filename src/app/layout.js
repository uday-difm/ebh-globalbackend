import Footer from '@/common/Footer';
import Header from '@/common/Header';
import './globals.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./pagination.css";
import CookiesBanner from '@/common/CookiesBanner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        
        {/* This padding-top is essential to push all page content down */}
        <main className="flex-grow">
          {children}
        </main>
         <CookiesBanner />
        <Footer />
      </body>
    </html>
  );
}