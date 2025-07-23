"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link"; // ✅ Correct import for Next.js
import AOS from "aos";
import "aos/dist/aos.css";

const Card = ({ data }) => {
  return (
    <div
      className="hover:rotate-[0deg] hover:shadow-2xl transition-transform duration-500"
      data-aos="zoom-in"
      data-aos-delay="100"
    >
      <div className="flex flex-col gap-6 mb-5 transition-transform transform hover:-translate-y-2 hover:scale-105 duration-500 ease-in-out shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-xl bg-gradient-to-br from-white to-gray-50">
        <p className="text-2xl xl:h-14 font-bold text-blue-700 text-center px-4 pt-4">
          {data.magazine_title}
        </p>
        <Link href={`magazine/${data.magazine_slug}`}>
          <img
            src={data.magazine_cover_image}
            alt={data.magazine_title}
            className="object-cover rounded-xl cursor-pointer transition duration-300 hover:opacity-90"
            style={{ width: "500px", height: "auto" }}
          />
        </Link>
      </div>
    </div>
  );
};

//--------------------------------------
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
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col items-center gap-10 lg:px-[10%]">
          <div className="w-full flex justify-center ">
            <h1
              className="font-extrabold text-center mt-10 text-2xl md:text-4xl leading-snug tracking-tight text-[#54AE47]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Edition Spotlight:
              <br className="hidden md:block" />
              <span className="text-gray-700"> Discover & Dive into the Newest Magazine</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {magazines.slice(0, visibleCount).map((data, index) => (
              <Card key={index} data={data} />
            ))}
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
  );
};

export default Magazine;
