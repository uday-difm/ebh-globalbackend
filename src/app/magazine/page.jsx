"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRight } from "react-icons/fa";

// ------------------ Magazine Card ------------------
const Card = ({ data }) => {
  return (
    <div
      className="hover:rotate-[0deg] transition-transform duration-500"
      data-aos="zoom-in"
      data-aos-delay="100"
    >
      <div className="flex flex-col gap-4 mb-5 transition-transform border border-gray-300 transform hover:-translate-y-2 hover:scale-105 duration-500 ease-in-out shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-xl bg-gradient-to-br from-white to-gray-50 p-4">
        <Link href={`magazine/${data.magazine_slug}`}>
          <img
            src={data.magazine_cover_image}
            alt={data.magazine_title}
            className="object-cover rounded-xl cursor-pointer transition duration-300 hover:opacity-90"
            style={{ width: "500px", height: "auto" }}
          />
          <p className="text-xl font-bold text-blue-700 text-center">
            {data.magazine_title}
          </p>
          <button className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-green-700 transition duration-300">
            Read more <FaArrowRight className="text-xs" />
          </button>
        </Link>
      </div>
    </div>
  );
};

// ------------------ Ad Card ------------------

const AdCard = () => {
  return (
    <div
      className="hover:rotate-[0deg] transition-transform duration-500"
      data-aos="zoom-in"
      data-aos-delay="100"
    >
      <div className="flex flex-col pb-30 gap-4 mb-5 transition-transform shadow-md transform hover:-translate-y-2 hover:scale-105 duration-500 ease-in-out shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-xl bg-gradient-to-br from-white to-gray-50 p-4">
        <img
          src="https://res.cloudinary.com/dtjjgiitl/image/upload/q_auto:good,f_auto,fl_progressive/v1753426444/lueoutuyoznwvlhab3ez.jpg"
          alt="Advertisement"
          className="w-full h-auto mt-20 p-5 object-cover rounded-2xl cursor-pointer transition duration-300 hover:opacity-90"
        />
        <p className="text-xl text-center text-gray-800" style={{ fontFamily: 'poppins' }}>
          Showcase your brand to a large audience. Contact us for details
        </p>
        <Link href="/contact-us">
          <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-blue-700 transition duration-300">
            Contact us <FaArrowRight className="text-xs" />
          </button>
        </Link>
      </div>
    </div>
  );
};



// ------------------ Magazine Page ------------------
const Magazine = () => {
  const [loading, setLoading] = useState(true);
  const [magazines, setMagazines] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await axios.get("/api/magazine");
        if (response.status === 200) {
          setMagazines(response.data);
        } else {
          setError("Failed to fetch magazines");
        }
      } catch (err) {
        console.error("Error fetching magazines:", err);
        setError("Error fetching magazines");
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (loading) {
    return <div className="text-center mt-10 text-black">Loading magazines...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <>
      <title>Magazine Explore Editions Of Our Content | Earth by Humans</title>
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

      <div className="bg-white min-h-screen">
        <div className="container mx-auto mt-10 px-4 pt-20 pb-10">
          <div className="flex flex-col items-center gap-10 lg:px-[10%]">
            <div className="w-full flex justify-center ">
              <h1
                className="font-extrabold text-center mt-10 text-2xl md:text-4xl leading-snug tracking-tight text-[#54AE47]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Edition Spotlight:
                <br className="hidden md:block" />
                <span className="text-gray-700">
                  Discover & Dive into the Newest Magazine
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {magazines.slice(0, visibleCount).map((data, index) => (
                <React.Fragment key={index}>
                  <Card data={data} />
                  {(index + 1) % 4 === 0 && <AdCard />}
                </React.Fragment>
              ))}
            </div>


            {/* Ad Section */}
            <div className="w-full bg-gray-800  py-4 rounded">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-gray-100 text-xl font-bold">Advertisement Space</p>
                <p className="text-gray-300 text-base mt-4">
                  Your ad could be here! Contact us for details.
                </p>
              </div>
            </div>
            {visibleCount < magazines.length && (
              <button
                onClick={loadMore}
                className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Magazine;
