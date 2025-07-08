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
  const id = params?.id;

  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMagazine = async () => {
      try {
        const res = await axios.get(`/api/magazine-details/${id}`);
        if (res.status === 200 && res.data?.length > 0) {
          const fetched = res.data[0];
          fetched.formatted_date = formatDate(fetched.formatted_date || fetched.magazine_date);
          setMagazine(fetched);
        }
      } catch (err) {
        console.error("Error fetching magazine:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading magazine...</div>;
  }

  if (!magazine) {
    return <div className="text-center py-20 text-red-500">Magazine not found.</div>;
  }

  return (
    <>
      <Head>
        <title>Earth By Humans | Blog - {magazine.magazine_title}</title>
        <meta name="keywords" content={magazine.magazine_tag} />
        <meta property="og:title" content={magazine.magazine_title} />
        <meta property="og:url" content={`http://localhost:3000/magazine-details/${magazine.magazine_id}`} />
        <meta property="og:image" content={magazine.magazine_cover_image} />
      </Head>

      <div className="max-w-[1400px] mx-auto px-5 py-16">
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
              src={magazine.magazine_cover_image}
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
              dangerouslySetInnerHTML={{ __html: magazine.magazine_description }}
            />
          </div>
        </div>

        <iframe
          src={magazine.magazine_link}
          frameBorder="0"
          className="w-full h-[600px] md:h-[700px] mt-10"
        ></iframe>

        <div className="flex flex-wrap gap-2 pt-12">
          <p className="text-green-700 text-2xl font-semibold">Tags:</p>
          {magazine.magazine_tags?.split(", ").map((tag, index) => (
            <span
              key={index}
              className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default MagazineDetails;
