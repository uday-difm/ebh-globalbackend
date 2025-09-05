"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { FaCalendarAlt, FaTag } from "react-icons/fa";
import { Loader } from '../../../common/Loader';

const formatDate = (dateString) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const MagazineDetails = () => {
  const params = useParams();
  const router = useRouter();

  let slug = params?.slug;
  if (Array.isArray(slug)) slug = slug.join("-");

  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      router.replace('/not-found'); // 🚨 Invalid URL structure
      return;
    }

    const fetchMagazine = async () => {
      try {
        setLoading(true);

        // Use Promise.all to wait for both the API call and a 3-second delay
        const [res] = await Promise.all([
          axios.get(`/api/magazine/${slug}`),
          new Promise(resolve => setTimeout(resolve, 300)) // 👈 Add the 3-second timer here
        ]);

        const fetched = Array.isArray(res.data) ? res.data[0] : res.data;

        if (res.status === 200 && fetched && Object.keys(fetched).length > 0 && !fetched.error) {
          fetched.formatted_date = formatDate(fetched.formatted_date || fetched.magazine_date);
          setMagazine(fetched);
        } else {
          router.replace("/not-found"); // 🚨 No data found
        }
      } catch (err) {
        router.replace("/not-found"); // 🚨 API error or 404
      } finally {
        setLoading(false);
      }
    };
    fetchMagazine();
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (!magazine) {
    return null; // Prevent rendering if no magazine data after loading
  }

  return (
    <>
      <title>{magazine.magazine_title}</title>
      <meta
        name="description"
        content="Explore all past and current editions of Earth by Humans Magazine. Dive into captivating content on nature, science, and sustainability."
      />
      <meta
        name="keywords"
        content="magazine, editions, nature, science, sustainability, conservation, environment, digital magazine, archives, publications"
      />
      <meta
        property="og:description"
        content="Explore all past and current editions of Earth by Humans Magazine. Dive into captivating content on nature, science, and sustainability."
      />
      <link
        rel="icon"
        href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png"
        type="image/png"
      />
      <div className="max-w-[1400px] mx-auto px-5 mt-20 py-16 text-black">
        <h2 className="text-4xl font-bold text-[#54AE47] mb-4">{magazine.magazine_title}</h2>

        <div className="flex items-center text-sm gap-4 text-gray-700 mb-8">
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-green-600" />
            {magazine.formatted_date}
          </span>
          <span className="flex items-center gap-1">
            <FaTag className="text-green-600" />
            {magazine.magazine_category}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6 text-justify">
          <div className="col-span-12 lg:col-span-3 flex flex-col items-center gap-4">
            <img
              src={magazine.magazine_cover_image || "/no-image.png"}
              alt={magazine.magazine_title}
              className="h-[400px] w-[300px] object-cover shadow-xl"
            />
            {magazine.MagCloudLink && (
              <a
                href={magazine.MagCloudLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-sky-600 hover:underline"
              >
                Want to buy? Click here ↑
              </a>
            )}
          </div>

          <div className="col-span-12 lg:col-span-9 lg:px-[10%] text-lg">
            <div
              className="bg-white px-4 tracking-wide font-poppins"
              dangerouslySetInnerHTML={{
                __html: magazine.magazine_description || "No Description",
              }}
            />
          </div>
        </div>

        {magazine.magazine_link && (
          <iframe
            src={magazine.magazine_link}
            frameBorder="0"
            className="w-full h-[600px] md:h-[700px] mt-10"
          ></iframe>
        )}

        <div className="flex flex-wrap gap-2 pt-12">
          <p className="text-green-700 text-2xl font-semibold">Tags:</p>
          {magazine.magazine_tags
            ? magazine.magazine_tags.split(", ").map((tag, index) => (
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
