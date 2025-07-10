import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaStar } from "react-icons/fa";

export default function Cta() {
  return (
    <div className="bg-gray-50">
        <div className="container mx-auto px-6 py-20 max-w-[1350]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Column: Text Content */}
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-1.5 rounded-full mb-6">
                        <FaStar className="text-yellow-500" />
                        Hop on the Fun Wagon!
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Join Our Portal Today!
                    </h2>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto lg:mx-0 mb-8">
                        Unlock exclusive benefits and stay updated with the latest in nature, science, and insights by signing up with us. Join now and embark on a journey to enhance your knowledge and experience with us!
                    </p>
                    <Link href="/contact-us">
                        <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg inline-flex items-center gap-2">
                            Contact Us
                            <FaArrowRight />
                        </button>
                    </Link>
                </div>

                {/* Right Column: Image */}
                <div className="flex justify-center">
                    <Image
                        src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/CTA.png"
                        alt="A penguin swimming underwater"
                        width={500}
                        height={350}
                        className="rounded-2xl shadow-xl"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

            </div>
        </div>
    </div>
  );
}