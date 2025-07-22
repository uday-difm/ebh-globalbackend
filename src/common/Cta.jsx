import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Cta() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-br from-white to-green-50 py-20 relative z-10">
      <div className="container mx-auto px-6 max-w-[1350px]">
        <div className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center transition-all">

          {/* Text Section */}
          <div className="text-center lg:text-left" data-aos="fade-up text-black">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
              <FaStar className="text-yellow-400 animate-bounce" />
              Hop on the Fun Wagon!
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Join Our Portal Today!
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Unlock exclusive benefits and stay updated with the latest in nature, science, and insights. Join us and embark on a journey of learning and exploration.
            </p>

            <Link href="/contact-us">
              <button className="group bg-green-600 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-500 text-lg flex items-center gap-3">
                Contact Us
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex justify-center" data-aos="zoom-in">
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
              <Image
                src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/CTA.png"
                alt="CTA - Penguin underwater"
                width={520}
                height={360}
                className="object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
