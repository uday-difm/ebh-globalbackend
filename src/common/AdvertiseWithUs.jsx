"use client";
import { useEffect } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaUsers, FaPuzzlePiece, FaLightbulb, FaHandHoldingHeart } from "react-icons/fa";
import { MdOutlineMaximize } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AdvertiseWithUs() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const features = [
    {
      icon: <BsGraphUpArrow size={28} />,
      title: "Boost Your Brand",
      description:
        "Advertise with us and connect with an audience passionate about nature and science. Our trusted platform enhances your brand’s visibility.",
    },
    {
      icon: <FaUsers size={28} />,
      title: "Reach a Highly Engaged Audience",
      description:
        "Connect with a community that values authenticity. Our readers support brands aligned with their values.",
    },
    {
      icon: <MdOutlineMaximize size={28} />,
      title: "Maximize Your Impact",
      description:
        "Reach wider audiences through print, digital, and social platforms with our integrated multi-channel campaigns.",
    },
    {
      icon: <FaPuzzlePiece size={28} />,
      title: "Engage Through Interactive Content",
      description:
        "Use our quizzes to create memorable and educational brand experiences your audience will love.",
    },
    {
      icon: <FaLightbulb size={28} />,
      title: "Leverage Our Blog",
      description:
        "Position your brand as a thought leader by advertising alongside expert insights and trending topics.",
    },
    {
      icon: <FaHandHoldingHeart size={28} />,
      title: "Join a Mission-Driven Platform",
      description:
        "Align your brand with our mission to protect the planet and elevate your reputation with purpose.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-green-50">
      <div className="container mx-auto px-6 max-w-[1350px] text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Advertise <span className="text-green-600">With Us</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          Partner with Earth by Humans to amplify your brand, connect authentically, and leave a lasting impact.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              data-aos="zoom-in-up"
              data-aos-delay={i * 100}
              className="bg-white/70 backdrop-blur-md border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.03] flex flex-col items-center text-center"
            >
              <div className="bg-green-100 text-green-600 rounded-full w-14 h-14 flex items-center justify-center shadow-md mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
