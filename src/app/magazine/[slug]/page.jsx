"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useParams } from "next/navigation";
import { FaCalendarAlt, FaTag } from "react-icons/fa";

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
  let slug = params?.slug;
  console.log("Params from useParams():", params, "slug:", slug);
  if (Array.isArray(slug)) slug = slug.join("-");

  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchMagazine = async () => {
      try {
        console.log("Fetching magazine for slug:", slug);
        const res = await axios.get(`/api/magazine/${slug}`, { timeout: 30000 });
        console.log("Fetched magazine data:", res.data);
        let fetched = Array.isArray(res.data) ? res.data[0] : res.data;
        if (res.status === 200 && fetched && Object.keys(fetched).length > 0 && !fetched.error) {
          fetched.formatted_date = formatDate(fetched.formatted_date || fetched.magazine_date);
          setMagazine(fetched);
          console.log("Magazine state set:", fetched);
        } else {
          console.warn("No data found for slug:", slug);
          setMagazine(null);
        }
      } catch (err) {
        console.error("Error fetching magazine:", err);
        setMagazine(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [slug]);

  // Log magazine state before render
  console.log("Rendering magazine:", magazine);

  if (loading) {
    return <div className="text-center py-20">Loading magazine...</div>;
  }

  if (!slug) {
    return <div className="text-center py-20 text-red-500">No slug found in URL.</div>;
  }

  if (!magazine) {
    return <div className="text-center py-20 text-red-500">Magazine not found.</div>;
  }

  return (
    <>
      <Head>
        <title>Earth By Humans | Blog - {magazine.magazine_title || ""}</title>
        <meta name="keywords" content={magazine.magazine_tags || ""} />
        <meta property="og:title" content={magazine.magazine_title || ""} />
        <meta property="og:url" content={`http://localhost:3000/magazine-details/${magazine.magazine_slug || slug}`} />
        <meta property="og:image" content={magazine.magazine_cover_image || ""} />
      </Head>

      <div className="max-w-[1400px] mx-auto px-5 mt-15 py-16 text-black">
        <h2 className="text-4xl font-bold text-[#54AE47] mb-4">{magazine.magazine_title || "No Title"}</h2>

        <div className="flex items-center text-sm gap-4 text-gray-700 mb-8">
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-green-600" />
            {magazine.formatted_date || "No Date"}
          </span>
          <span className="flex items-center gap-1">
            <FaTag className="text-green-600" />
            {magazine.magazine_category || "No Category"}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6 text-justify">
          <div className="col-span-12 lg:col-span-3 flex flex-col items-center gap-4">
            <img
              src={magazine.magazine_cover_image || "/no-image.png"}
              alt={magazine.magazine_title || "No Title"}
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
              dangerouslySetInnerHTML={{ __html: magazine.magazine_description || "No Description" }}
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



