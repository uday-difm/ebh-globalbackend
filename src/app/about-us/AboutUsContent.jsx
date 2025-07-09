"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FaUsers,
    FaPuzzlePiece,
    FaLightbulb,
    FaHandHoldingHeart,
    FaStar,
} from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineMaximize } from "react-icons/md";
import Cta from '@/common/Cta';

const logos = [
    { url: "https://kladiscope.com/", name: "Kladiscope", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Kladiscope.png" },
    { url: "https://www.mallyfinancial.com/", name: "Mally Financial", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Mally%20Financial.png" },
    { url: "https://www.maayalakshmi.com/", name: "Maaya Laxmi", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Maaya%20Laxmi.png" },
    { url: "https://laymanlitigation.com/", name: "Layman Litigation", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Layman%20Litigation.png" },
    { url: "https://ahealthplace.com/", name: "A Health Place", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/A%20Health%20Place.png" },
    { url: "https://aeroway.one/", name: "Aeroway", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Aeroway.png" },
    { url: "https://arsenalfunding.com/", name: "Arsenal", src: "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/logos/Arsenal.png" },
];

export default function AboutUsContent() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (logos.length - 3));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const visibleLogos = logos.slice(currentIndex, currentIndex + 4);

    const features = [
        { icon: <BsGraphUpArrow className="text-green-500" size={36} />, title: "Boost Your Brand", description: "Advertise with us and connect with an audience passionate about nature and science. Our trusted magazine and website offer ideal platforms to showcase your brand, increasing visibility and engagement." },
        { icon: <FaUsers className="text-green-500" size={36} />, title: "Reach a Highly Engaged Audience", description: "Connect with a community that values authenticity and depth. Our engaged readers are more likely to respond to your message, supporting brands that share their values." },
        { icon: <MdOutlineMaximize className="text-green-500" size={36} />, title: "Maximize Your Impact with a Multi-Channel Approach", description: "Maximize your impact with our multi-channel approach. Reach a wide audience through our visually stunning magazine and dynamic digital platform, amplifying your message." },
        { icon: <FaPuzzlePiece className="text-green-500" size={36} />, title: "Engage Through Interactive Content", description: "Tap into our popular quiz section, offering fun and educational quizzes on nature and science. Create memorable brand associations and engage your target audience uniquely." },
        { icon: <FaLightbulb className="text-green-500" size={36} />, title: "Leverage Our Blog for Thought Leadership", description: "Advertise alongside our insightful blog content, positioning your brand as knowledgeable and credible. Our readers seek the latest in nature and science, providing the perfect context for your ads." },
        { icon: <FaHandHoldingHeart className="text-green-500" size={36} />, title: "Join a Mission-Driven Platform", description: "Align your brand with our mission to heal and understand the planet. Partner with Earth by Humans to enhance your brand's reputation and impact through our sustainability-focused content." },
    ];

    return (
        <main className="pt-[96px] bg-white">
            {/* --- AboutHero Section --- */}
            <div className="md:py-[100px] 2xl:px-16 max-w-[1350px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-8 my-auto px-[15px]">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-start mt-5">
                            About Earth By Humans
                        </h1>
                        <p className="text-lg text-justify">
                            In a world teeming with information, yet often lacking in-depth understanding, Earth by Humans was born out of a profound passion for our planet. Founded by Mr. Sitanshu Srivastava, our platform seeks to bridge the gap between scientific knowledge and public awareness. With a commitment to authenticity and clarity, we delve into the intricate tapestry of Earth, exploring both its natural wonders and the innovations that shape its future.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Link href="/contact-us">
                                <div className="relative group max-w-[150px] overflow-hidden rounded-full cursor-pointer p-1.5">
                                    <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full" />
                                    <div className="absolute w-[120px] h-[200px] bg-blue-700 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10" />
                                    <div className="absolute w-[220px] h-[90px] bg-blue-700 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10" />
                                    <button className="relative z-20 w-[150px] text-white py-2 px-6 text-sm rounded-full transition-colors duration-300">
                                        contact-us<span className="p-1.5">➜</span>
                                    </button>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <Image
                            src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/About.png"
                            alt="An illustrative image of planet Earth"
                            width={500}
                            height={500}
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* --- Partner Section --- */}
            <div className="bg-gray-50">
                <div className="py-2 max-w-[1350px] mx-auto px-4">
                    <div className="text-center container mx-auto py-7 flex flex-col justify-center items-center">
                        <h2 className="text-3xl md:text-6xl font-bold mb-9">Our Partners</h2>
                        <div className="md:flex grid grid-cols-1 justify-center items-center space-x-4">
                            {visibleLogos.map((logo) => (
                                <div key={logo.name} className="flex justify-center grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                    <a href={logo.url} target="_blank" rel="noopener noreferrer">
                                        <Image src={logo.src} alt={logo.name} width={180} height={60} style={{ objectFit: "contain" }} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Advertise Section --- */}
            <div className="bg-gray-50">
                <div className="py-20 max-w-[1350px] mx-auto px-4">
                    <div className="text-center px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Advertise With Us!</h2>
                        <p className="mt-8 text-justify md:text-center mb-8">
                            Ready to take your brand to the next level? Partner with us and reach a wider audience through our print and digital channels. Our platform offers prime opportunities to showcase your products and services to a highly engaged community. Let's work together to create campaigns that captivate and convert. Advertise with us and watch your business grow!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="p-4 col-span-12 sm:col-span-3 rounded-full h-16 w-16 border border-light-green flex items-center justify-center">{feature.icon}</div>
                                        <h3 className="text-xl col-span-12 sm:col-span-9">{feature.title}</h3>
                                    </div>
                                    <p className="mt-5 text-justify md:text-start text-pretty">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CTA Section --- */}
            <Cta />

        </main>
    );
}
