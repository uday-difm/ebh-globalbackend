// app/layout.tsx
import Footer from '@/common/Footer';
import './globals.css'; // your Tailwind styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./pagination.css"; // We will create this file next

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Main content area should grow */}
        <main className="flex-grow">{children}</main>

        {/* Footer always at the bottom */}
        <Footer />
      </body>
    </html>
  );
}
//   