"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Tag } from "lucide-react";
import { Loader } from "../../../common/Loader";
import Image from "next/image";
import Link from "next/link";

// Function to format the date
const formatDate = (dateString) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const MagazineDetails = () => {
  const { slug } = useParams(); // useParams will automatically extract slug
  const router = useRouter();

  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      router.replace("/not-found"); // 🚨 Invalid URL structure
      return;
    }

    const fetchMagazine = async () => {
      try {
        setLoading(true);

        // Fetch the magazine details
        const { data, status } = await axios.get(`/api/magazine/${slug}`);

        if (status === 200 && data && Object.keys(data).length > 0 && !data.error) {
          data.formatted_date = formatDate(data.magazine_date || data.formatted_date);
          setMagazine(data);
        } else {
          router.replace("/not-found"); // 🚨 No data found
        }
      } catch (err) {
        console.error("Error fetching magazine data:", err);
        router.replace("/not-found"); // 🚨 API error or 404
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [slug, router]);

  // If still loading, show the loader
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  // If magazine is not found, return null (don't render any content)
  if (!magazine) {
    return null;
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <title>{magazine.magazine_title}</title>
      <meta name="description" content="Explore all past and current editions of Earth by Humans Magazine. Dive into captivating content on nature, science, and sustainability." />
      <meta name="keywords" content="magazine, editions, nature, science, sustainability, conservation, environment, digital magazine, archives, publications" />
      <meta property="og:description" content="Explore all past and current editions of Earth by Humans Magazine. Dive into captivating content on nature, science, and sustainability." />
      <meta property="og:image" content={magazine.magazine_cover_image} />
      <meta property="og:image:alt" content={magazine.magazine_title} />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />

      {/* Magazine Details Section */}
      <div className="max-w-[1400px] mx-auto px-5 mt-20 py-16 text-black">
        <h2 className="text-4xl font-bold text-[#54AE47] mb-4">{magazine.magazine_title}</h2>

        {/* Meta Information */}
        <div className="flex items-center text-sm gap-4 text-gray-700 mb-8">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-green-600" />
            {magazine.formatted_date}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="h-4 w-4 text-green-600" />
            {magazine.magazine_category}
          </span>
        </div>

        {/* Magazine Cover and Purchase Link */}
        <div className="grid grid-cols-12 gap-6 text-justify">
          <div className="col-span-12 lg:col-span-3 flex flex-col items-center gap-4">
            <Image
              src={magazine.magazine_cover_image || "/no-image.png"}
              alt={magazine.magazine_title}
              width={500}
              height={600}
              className="h-[400px] w-[300px] object-cover shadow-xl"
            />
            {magazine.MagCloudLink && (
              <Link
                href={magazine.MagCloudLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center relative z-20 text-white font-semibold text-lg rounded-full px-6 py-2 transition-colors duration-300 items-center bg-green-600 hover:bg-green-700"
              >
                <span>Want to buy? Click here ↑</span>
              </Link>
            )}
          </div>

          {/* Magazine Description */}
          <div className="col-span-12 lg:col-span-9 lg:px-[10%] text-lg">
            <div
              className="bg-white px-4 tracking-wide font-poppins"
              dangerouslySetInnerHTML={{
                __html: magazine.magazine_description || "No Description available",
              }}
            />
          </div>
        </div>

        {/* Magazine Link (Iframe) */}
        {magazine.magazine_link && (
          <iframe
            src={magazine.magazine_link}
            frameBorder="0"
            className="w-full h-[600px] md:h-[700px] mt-10"
          />
        )}

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 pt-12">
          <p className="text-green-700 text-2xl font-semibold">Tags:</p>
          {magazine.magazine_tags && magazine.magazine_tags.trim()
            ? magazine.magazine_tags.split(",").map(tag => tag.trim()).filter(Boolean).map((tag, index) => (
              <span
                key={index}
                className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))
            : <span className="text-gray-400">No tags</span>}
        </div>
      </div>
    </>
  );
};

export default MagazineDetails;
