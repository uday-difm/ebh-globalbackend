"use client";

import { useEffect } from "react";
import { useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { MdOutlineMaximize } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaUsers, FaPuzzlePiece, FaLightbulb, FaHandHoldingHeart } from "react-icons/fa";

const features = [
  {
    icon: <BsGraphUpArrow className="text-green-500" size={36} />,
    title: "Boost Your Brand",
    description:
      "Advertise with us and connect with an audience passionate about nature and science. Our trusted magazine and website offer ideal platforms to showcase your brand, increasing visibility and engagement.",
  },
  {
    icon: <FaUsers className="text-green-500" size={36} />,
    title: "Reach a Highly Engaged Audience",
    description:
      "Connect with a community that values authenticity and depth. Our engaged readers are more likely to respond to your message, supporting brands that share their values.",
  },
  {
    icon: <MdOutlineMaximize className="text-green-500" size={36} />,
    title: "Maximize Your Impact with a Multi-Channel Approach",
    description:
      "Maximize your impact with our multi-channel approach. Reach a wide audience through our visually stunning magazine and dynamic digital platform, amplifying your message.",
  },
  {
    icon: <FaPuzzlePiece className="text-green-500" size={36} />,
    title: "Engage Through Interactive Content",
    description:
      "Tap into our popular quiz section, offering fun and educational quizzes on nature and science. Create memorable brand associations and engage your target audience uniquely.",
  },
  {
    icon: <FaLightbulb className="text-green-500" size={36} />,
    title: "Leverage Our Blog for Thought Leadership",
    description:
      "Advertise alongside our insightful blog content, positioning your brand as knowledgeable and credible. Our readers seek the latest in nature and science, providing the perfect context for your ads.",
  },
  {
    icon: <FaHandHoldingHeart className="text-green-500" size={36} />,
    title: "Join a Mission-Driven Platform",
    description:
      "Align your brand with our mission to heal and understand the planet. Partner with Earth by Humans to enhance your brand's reputation and impact through our sustainability-focused content.",
  },
];

export default function AdvertiseWithUs() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
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
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Ready to take your brand to the next level? Partner with us and reach a wider audience through our print and digital channels. Our platform offers prime opportunities to showcase your products and services to a highly engaged community. Let's work together to create campaigns that captivate and convert. Advertise with us and watch your business grow!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="relative bg-white p-8 rounded-3xl border-t-4 border-green-700 hover:border-[#3853a4] border shadow-md hover:shadow-xl transform transition-transform duration-700 ease-in-out hover:scale-[1.05] flex flex-col items-center text-center group"
              >
                <div className="p-5 rounded-full border border-[#3853a4]/20 mb-4 shadow group-hover:shadow-lg transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#3853a4] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
