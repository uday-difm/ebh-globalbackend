"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRight } from "react-icons/fa";
import { FcAdvertising } from "react-icons/fc";

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
            className="object-cover rounded-xl cursor-pointer transition duration-300 hover:opacity-90 mt-2"
            style={{ width: "500px", height: "auto" }}
          />
          <p className="text-xl font-bold text-blue-700 text-center mt-3">
            {data.magazine_title}
          </p>
          <div className="flex justify-center mt-3">
            <div className="group relative  w-[130px] bg-green-600 text-white py-3 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
              <div className="absolute w-[100px] h-[250px] bg-blue-700 transform rotate-[35deg] transition-all duration-700 top-[-250%] left-[-100%] group-hover:left-[-20%] z-10">
              </div>
              <div className="absolute w-[270px] h-[120px] bg-blue-700 transform rotate-[125deg] transition-all duration-700 left-[100%] group-hover:left-[10%] z-10">
              </div>
              <span className="transition-colors rounded-full duration-500 text-sm z-50 group-hover:text-white flex gap-1 items-center">
                Read More
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

// ------------------ Ad Card ------------------

const AdCard = () => (
  <div
    className="flex flex-col justify-center items-center text-white gap-4 mb-5 transition-transform duration-500 transform hover:-translate-y-2 hover:scale-105 ease-in-out hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded-xl bg-gradient-to-br from-white via-green-100 to-green-300 p-5 sm:p-6 md:p-8 lg:p-10 min-h-[220px] border border-green-500"

  >
    <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4 sm:p-6">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-5">
        <FcAdvertising size={40} className="text-green-500" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
        Advertise With Us
      </h3>

      <p className="text-green-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6 max-w-xs sm:max-w-sm">
        Showcase your brand to our engaged audience of nature enthusiasts and environmental advocates
      </p>

      <Link href="/contact-us" scroll={true} passHref>
        <div className="group relative w-[150px] sm:w-[150px] bg-green-600 text-white py-3 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
          <div className="absolute w-[120px] h-[250px] bg-blue-700 transform rotate-[35deg] transition-all duration-700 top-[-200%] left-[-120%] group-hover:left-[-20%] z-10" />
          <div className="absolute w-[270px] h-[120px] bg-blue-700 transform rotate-[125deg] transition-all duration-700 left-[100%] group-hover:left-[10%] z-10" />
          <span className="transition-colors rounded-full duration-500 text-sm sm:text-md z-50 group-hover:text-white flex gap-2 items-center">
            Get Started
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </div>
  </div>
);


// ------------------ Magazine Page ------------------
const Magazine = () => {
  const [loading, setLoading] = useState(true);
  const [magazines, setMagazines] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const [response] = await Promise.all([
          axios.get("/api/magazine"),
          new Promise((resolve) => setTimeout(resolve, 3000)), // 👈 The 3-second timer
        ]);
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
        <div className="container mx-auto mt-10 pt-20 pb-10 max-w-[1350px]">
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
            <div className="w-full bg-gradient-to-br from-green-300 via-green-100 to-green-300 mt-6 py-4 rounded-2xl shadow-lg">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-10 h-10  backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FcAdvertising size={25} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black">Advertisement Space</h3>
                </div>
                <p className="text-black/90 text-base mb-4 max-w-xl mx-auto">
                  Reach our engaged audience of nature enthusiasts and environmental advocates. Your brand could be featured here!
                </p>
                <Link href="/contact-us" scroll={true} passHref>
                  <div className="group relative w-[150px] mx-auto bg-green-500 text-white py-3 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                    <div className="absolute w-[120px] h-[250px] bg-blue-700 transform rotate-[35deg] transition-all duration-700 top-[-200%] left-[-120%] group-hover:left-[-20%] z-10">
                    </div>
                    <div className="absolute w-[270px] h-[120px] bg-blue-700 transform rotate-[125deg] transition-all duration-700 left-[100%] group-hover:left-[10%] z-10">
                    </div>
                    <span className="transition-colors rounded-full duration-500 text-md z-50 justify-center group-hover:text-white flex gap-2 items-center">
                      Contact Us
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {visibleCount < magazines.length && (
              <div className="relative w-[150px]  py-3 group overflow-hidden rounded-full cursor-pointer">
                <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>
                <div className="absolute w-[115px] h-[200px] bg-blue-600 transform rotate-[35deg] transition-all duration-700 ease-in-out top-[-245%] left-[-100%] group-hover:left-0 z-10"></div>
                <div className="absolute w-[200px] h-[90px] bg-blue-600 transform rotate-[125deg] transition-all duration-700 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                <button onClick={loadMore} className="relative z-20 text-white font-bold px-9 text-sm rounded-full transition-colors duration-300">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Magazine;
