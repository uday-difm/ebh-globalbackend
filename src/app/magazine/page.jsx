"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link"; // ✅ Correct import for Next.js

const Card = ({ data }) => {
  return (
    <div className="bg-white p-4 flex justify-center">
      <div className="flex flex-col gap-6 mb-5">
        <p className="text-3xl xl:h-14 2xl:h-auto font-bold text-blue-700">
          {data.magazine_title}
        </p>
        <Link href={`/magazine-details/${data.magazine_slug}`}>
          <img
            src={data.magazine_cover_image}
            alt={data.magazine_title}
            className="object-cover cursor-pointer hover:opacity-90 transition duration-300"
            style={{ width: "500px", height: "auto" }}
          />
        </Link>
      </div>
    </div>
  );
};

const Magazine = () => {
  const [loading, setLoading] = useState(true);
  const [magazines, setMagazines] = useState([]);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="text-center mt-10">Loading magazines...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col items-center gap-10 lg:px-[10%]">
          <div className="w-full flex justify-center pt-7">
            <h1
              className="font-bold text-center"
              style={{
                color: "#54AE47",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
              }}
            >
              Edition Spotlight: Discover and Dive into the Newest Magazine
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {magazines.map((data, index) => (
              <Card key={index} data={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Magazine;
