'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DashboardLayout from '../../../component/DashboardLayout';

const Profile = () => {
  const [counts, setCounts] = useState({
    total_blogs: 0,
    total_magazines: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`/api/dashboard/count`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCounts({
          total_blogs: data.total_blogs,
          total_magazines: data.total_magazines,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const { total_blogs, total_magazines } = counts;

  return (
    <DashboardLayout>
      <div className="overflow-hidden rounded-lg border border-stroke bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 shadow-xl">
        {/* Reduced Height Cover Image */}
        <div className="relative z-20 h-40 md:h-82">
          <img
            src="https://wmhindia.s3-eu-central-2.ionoscloud.com/dashboard/profile.png"
            alt="profile cover"
            className="h-full w-full rounded-t-lg object-cover object-center"
          />
        </div>

        <div className="px-4 pb-4 text-center lg:pb-6 xl:pb-8">
          {/* Smaller Profile Picture */}
          <div className="relative z-30 mx-auto -mt-20 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white shadow-xl border-4 border-gradient-to-tl from-blue-400 to-purple-600 p-1 sm:p-2 flex items-center justify-center">
            <Image
              src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/Final-logo-ebh.gif"
              alt="Earth by humans logo gif"
              width={150}
              height={100}
              priority
            />
          </div>

          {/* Profile Info */}
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-white">Earth By Humans</h3>
            <p className="text-gray-200 text-sm">Admin</p>

            {/* Counts */}
            <div className="flex justify-center">
              <div className="mt-4 mb-6 grid grid-cols-2 gap-6 px-4 w-full max-w-xl">
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white/10 p-5 hover:bg-gray-500 transition-colors duration-200 shadow-md">
                  <span className="text-white text-xl font-semibold">{total_blogs}</span>
                  <span className="text-base text-gray-300">Blogs</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white/10 p-5 hover:bg-gray-500 transition-colors duration-200 shadow-md">
                  <span className="text-white text-xl font-semibold">{total_magazines}</span>
                  <span className="text-base text-gray-300">Magazines</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mx-auto max-w-3xl px-4">
              <h4 className="text-lg font-semibold text-white">About Me</h4>
              <p className="mt-3 text-sm text-gray-200">
                World Model Hunt is one of a kind, model promotion and talent agency. With its own publication, World Model Hunt magazine, a talk show on YouTube, and growing social media, we focus on providing models and fashion influencers a platform to grow and succeed in the industry of Fashion and Modeling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
