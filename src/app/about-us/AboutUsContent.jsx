"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRight, FaHandHoldingHeart } from "react-icons/fa";
import Cta from "../../common/Cta";

const logos = [
  { url: "https://kladiscope.com/", name: "Kladiscope", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Kladiscope.png" },
  { url: "https://www.mallyfinancial.com/", name: "Mally Financial", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Mally%20Financial.png" },
  { url: "https://www.maayalakshmi.com/", name: "Maaya Laxmi", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Maaya%20Laxmi.png" },
  { url: "https://laymanlitigation.com/", name: "Layman Litigation", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Layman%20Litigation.png" },
  { url: "https://ahealthplace.com/", name: "A Health Place", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/A%20Health%20Place.png" },
  { url: "https://aeroway.one/", name: "Aeroway", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Aeroway.png" },
  { url: "https://arsenalfunding.com/", name: "Arsenal", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Arsenal.png" },
];

const features = [
  {
    icon: (
      <Image
        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Vector-advertise-with-us.png"
        alt="Boost Your Brand Icon"
        className="w-10 h-10 "
        width={500}
        height={600}
        priority
      />
    ),
    title: "Boost Your Brand",
    description:
      "Advertise with us and connect with an audience passionate about nature and science. Our trusted magazine and website offer ideal platforms to showcase your brand, increasing visibility and engagement.",
  },
  {
    icon: (
      <Image
        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Vector-advertisewithus.png"
        alt="Reach Audience Icon"
        width={500}
        height={600}
        className="w-10 h-10"
        priority
      />
    ),
    title: "Reach a Highly Engaged Audience",
    description:
      "Connect with a community that values authenticity and depth. Our engaged readers are more likely to respond to your message, supporting brands that share their values.",
  },
  {
    icon: (
      <Image
        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Vector-advertise-with-us.png"
        alt="Multi-Channel Impact Icon"
        className="w-10 h-10"
        width={500}
        height={600}
        priority
      />
    ),
    title: "Maximize Your Impact with a Multi-Channel Approach",
    description:
      "Maximize your impact with our multi-channel approach. Reach a wide audience through our visually stunning magazine and dynamic digital platform, amplifying your message.",
  },
  {
    icon: (
      <Image
        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Vector-advertisewithus.png"
        alt="Interactive Content Icon"
        width={500}
        height={600}
        className="w-10 h-10"
        priority
      />
    ),
    title: "Engage Through Interactive Content",
    description:
      "Tap into our popular quiz section, offering fun and educational quizzes on nature and science. Create memorable brand associations and engage your target audience uniquely.",
  },
  {
    icon: (
      <Image
        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Vector-advertise-with-us.png"
        alt="Blog Leadership Icon"
        width={500}
        height={600}
        className="w-10 h-10"
        priority
      />
    ),
    title: "Leverage Our Blog for Thought Leadership",
    description:
      "Advertise alongside our insightful blog content, positioning your brand as knowledgeable and credible. Our readers seek the latest in nature and science, providing the perfect context for your ads.",
  },
  {
    icon: (
      <Image
        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Vector-advertisewithus.png"
        alt="Mission-Driven Platform Icon"
        width={500}
        height={600}
        className="w-10 h-10"
        priority
      />
    ),
    title: "Join a Mission-Driven Platform",
    description:
      "Align your brand with our mission to heal and understand the planet. Partner with Earth by Humans to enhance your brand's reputation and impact through our sustainability-focused content.",
  },
];

export default function AboutUsContent() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (logos.length - 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleLogos = logos.slice(currentIndex, currentIndex + 4);

  return (
    <main className="pt-[9px] bg-white">
      {/* Hero Section */}
      <div className="relative py-12 md:py-[100px] max-w-[1350px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-black relative z-10">
          {/* Text Column */}
          <div className="flex flex-col gap-8 my-auto" data-aos="fade-right">
            <div className="space-y-2">
              {/* === FOCUS HERE FOR H1 FIX === */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center md:text-start leading-tight mt-20 whitespace-nowrap">
                About Earth By Humans
              </h2>
              {/* === END FOCUS === */}
            </div>
            <p className="text-base text-gray-700 text-justify leading-relaxed">
              In a world teeming with information, yet often lacking in-depth understanding, Earth by Humans was born out of a profound passion for our planet. Founded by Mr. Sitanshu Srivastava, our platform seeks to bridge the gap between scientific knowledge and public awareness. With a commitment to authenticity and clarity, we delve into the intricate tapestry of Earth,
              exploring both its natural wonders and the innovations that shape its future.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link href="/contact-us">
                <div className="group relative w-[180px] bg-green-600 text-white py-3 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                  <div className="absolute w-[120px] h-[250px] bg-blue-700 transform rotate-[35deg] transition-all duration-500 top-[-200%] left-[-100%] group-hover:left-[-20%] z-10">
                  </div>
                  <div className="absolute w-[270px] h-[120px] bg-blue-700 transform rotate-[125deg] transition-all duration-500 left-[100%] group-hover:left-[10%] z-10">
                  </div>
                  <span className="transition-colors rounded-full duration-500 text-lg z-50 group-hover:text-white flex gap-2 items-center">
                    Contact Us
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Image Column */}
          <div className="flex justify-center ps-10 mt-10 items-center mt-8 md:mt-12 relative" data-aos="zoom-in">
            <div className="relative">
              <div className="absolute  inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
              <Image
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/About.png"
                alt="Earth Illustration"
                width={400}
                height={400}
                priority
                className="relative z-10 drop-shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="text-black py-12">
        <div className="max-w-[1350px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
              Our <span className="text-[#3853a4]">Partners</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We’re proud to collaborate with these amazing organizations.
            </p>
          </div>
          <div className="w-full flex justify-center mb-8">
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 via-[#3853a4] to-green-400 rounded-full opacity-40"></div>
          </div>
          <div className="py-12 px-4">
            <div className="flex flex-wrap justify-center gap-8">
              {visibleLogos.map((logo) => (
                <Link key={logo.name} href={logo.url} target="_blank" rel="noopener noreferrer"
                  className="group p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-[#3853a4] transition-all duration-500 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3853a4] flex flex-col items-center w-[200px] min-h-[120px]">
                  <div className="flex flex-col items-center">
                    <div className="w-[180px] h-[60px] flex items-center justify-center mb-3">
                      <Image src={logo.src} alt={logo.name} width={160} height={50} style={{ objectFit: 'contain' }} className="transition-all duration-500 group-hover:drop-shadow-lg" />
                    </div>
                    <div className="text-center font-bold text-gray-800 text-base tracking-wide mt-1 mb-1 group-hover:text-[#3853a4] transition-colors duration-300">
                      {logo.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advertise Section */}
      <div className="text-black">
        <div className="py-20 max-w-[1350px] mx-auto px-4">
          <div className="text-center" data-aos="fade-up">
            <div className="flex flex-col items-center mb-2">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-[#3853a4] text-white shadow-lg mb-3">
                <FaHandHoldingHeart size={28} />
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 relative inline-block">
                Advertise <span className="text-[#3853a4]">With Us!</span>
                <span className="block w-16 h-1 to-green-400 rounded-full mt-2 mx-auto opacity-40"></span>
              </h2>
            </div>
            <p className="mt-6 text-lg text-gray-600 max-w-[1500px] mx-auto mb-12 leading-relaxed text-center">
              Ready to take your brand to the next level? Partner with us and reach a wider audience through our print and digital channels. Our platform offers prime opportunities to showcase your products and services to a highly engaged community.
              Let's work together to create campaigns that captivate and convert. Advertise with us and watch your business grow!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100}
                  className="relative bg-white p-8 rounded-3xl border-t-4 border-green-700 hover:border-[#3853a4] border border-gray-200 shadow-md hover:shadow-xl transform transition-transform duration-700 ease-in-out hover:scale-[1.05] flex flex-col items-center text-center group">
                  <div className=" p-5 rounded-full border border-green-200 mb-4 shadow group-hover:shadow-lg transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#3853a4] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <Cta />
    </main>
  );
}