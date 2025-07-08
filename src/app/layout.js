// app/layout.tsx
import Footer from '@/common/Footer';
import './globals.css'; // your Tailwind styles

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