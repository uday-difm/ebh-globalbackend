"use client";
import { useEffect } from "react";
import { MdOutlineMaximize } from "react-icons/md";
import { PiSparkle } from "react-icons/pi";;
// import "aos/dist/aos.css";

export default function AdvertiseWithUs() {
  useEffect(() => {
    // AOS.init({ duration: 800, once: true });
  }, []);

  const features = [
    {
      icon: <PiSparkle size={28} color="#4ade80" />,
      title: "Boost Your Brand",
      description:
        "Advertise with us and connect with an audience passionate about nature and science. Our trusted magazine and website offer ideal platforms to showcase your brand, increasing visibility and engagement.",
    },
    {
      icon: <PiSparkle size={28} color="#4ade80" />,
      title: "Reach a Highly Engaged Audience",
      description:
        "Connect with a community that values authenticity and depth. Our engaged readers are more likely to respond to your advertising, supporting brands that share their values.",
    },
    {
      // Changed icon for "Maximize Your Impact"
      icon: <MdOutlineMaximize size={28} color="#4ade80" />,
      title: "Maximize Your Impact",
      description:
        "Maximize your impact with our multi-channel approach. Reach a wide audience through our visually stunning magazine and dynamic digital platform, amplifying your message.",
    },
    {
      icon: <PiSparkle size={28} color="#4ade80" />,
      title: "Engage Through Interactive Content",
      description:
        "Tap into our popular quiz section, offering fun and educational quizzes on nature and science. Create memorable brand associations and engage your target audience uniquely.",
    },
    {
      icon: <PiSparkle size={28} color="#4ade80" />,
      title: "Leverage Our Blog",
      description:
        "Advertise alongside our insightful blog content, positioning your brand as knowledgeable and credible. Our readers seek the latest in nature and science, providing the perfect context for your ads.",
    },
    {
      icon: <PiSparkle size={28} color="#4ade80" />,
      title: "Join a Mission-Driven Platform",
      description:
        "Align your brand with our mission to heal and understand the planet. Partner with Earth by Humans to enhance your brand's reputation and impact through our sustainability-focused content.",
    },
  ];

  return (
    <section className="bg-gradient-to-br">
      <div className="container mx-auto px-6 max-w-[1350px] text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Advertise <span className="text-green-600">With Us</span>
        </h2>
        <p className="text-lg font-medium text-black mt-6 leading-relaxed mb-16 max-w-4xl mx-auto">
          Ready to take your brand to the next level? Partner with us and reach a wider audience
          through our print and digital channels. Our platform offers prime opportunities to showcase
          your products and services to a highly engaged community. Let's work together to create
          campaigns that captivate and convert. Advertise with us and watch your business grow!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              // data-aos="zoom-in-up"
              // data-aos-delay={i * 100}
              className="bg-white/70 backdrop-blur-md border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.03] flex flex-col items-center text-center"
            >
              <div className="bg-green-100 text-green-600 rounded-full w-14 h-14 flex items-center justify-center shadow-md mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
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
