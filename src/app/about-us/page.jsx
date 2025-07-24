// This is a Server Component for handling metadata.

import AboutUsContent from "./AboutUsContent";

// SEO Metadata for the page
export const metadata = {
  title: "About Earth by Humans Mission | Our Vision and Goals",
  description: "Learn everything you need to know about Earth by Humans and our mission to educate and inspire action for a sustainable future for all humans and animals.",
  keywords: "Earth by Humans mission, sustainable future education, environmental vision and goals",
  openGraph: {
    title: "About Earth by Humans Mission | Our Vision and Goals",
    description: "Learn everything you need to know about Earth by Humans and our mission to educate and inspire action for a sustainable future for all humans and animals.",
  },
};
// The main page component for the /about-us route
export default function AboutUsPage() {
  // It renders the client component which contains all the visual content.
  return <AboutUsContent />;
}