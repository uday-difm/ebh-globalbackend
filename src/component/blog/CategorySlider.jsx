"use client";

import Slider from "react-slick";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CategorySlider({ categories }) {
    const pathname = usePathname();

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            // ... your responsive settings
        ],
    };

    const isActive = (slug) => pathname === `/blog/category/${slug}`;
    const isAllActive = pathname === '/blog';

    return (
        <Slider {...sliderSettings}>
            <div className="px-2">
                 <Link href="/blog">
                    <button className={`w-full py-2 px-4 rounded-full font-semibold transition-colors ${isAllActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        All
                    </button>
                 </Link>
            </div>
            {categories.map((cat) => (
                <div key={cat.category_id} className="px-2">
                    <Link href={`/blog/category/${cat.category_slug}`}>
                        <button className={`w-full py-2 px-4 rounded-full font-semibold transition-colors truncate ${isActive(cat.category_slug) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {cat.category_name}
                        </button>
                    </Link>
                </div>
            ))}
        </Slider>
    );
}