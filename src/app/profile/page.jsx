"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAuth } from "../redux/actions/action";

const Profile = () => {
  const fullData = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/auth/profile?userId=${fullData.userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        dispatch(
          setAuth(
            true,
            data.userId,
            data.name,
            data.profile,
            data.username,
            data.profession,
            data.email,
            data.bio
          )
        );
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (fullData.userId) {
      fetchProfile();
    }
  }, [fullData.userId, dispatch]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const {
    name = "No name provided",
    bio = "No bio available",
    profession = "No profession listed",
    username = "N/A",
    email = "N/A",
    profile = "",
  } = fullData || {};

  const defaultProfileImage =
    "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png";

  return (
    <div className="container py-28 max-w-[1200px] mx-auto px-[15px] flex justify-center items-center">
      <div className="w-full flex shadow-xl rounded-2xl py-20 flex-col items-start gap-5 px-[5%] text-black">
        <p className="text-3xl font-bold">Profile details</p>
        <hr className="black border-1 border-gray2 w-full" />

        {/* Profile Section */}
        <div className="w-full grid grid-cols-6 gap-5 md:gap-0 py-8">
          <div className="col-span-6 md:col-span-2 flex md:flex-row flex-col items-center">
            <p className="font-semibold text-xl">Profile</p>
          </div>
          <div className="col-span-6 md:col-span-4 flex md:flex-row flex-col justify-between gap-5">
            <div className="flex md:flex-row flex-col gap-5 items-center">
              <img
                src={profile || defaultProfileImage}
                alt="Profile"
                className="w-[100px] h-[100px] object-cover rounded-full"
              />
              <p>{name}</p>
            </div>
            <Link href="/edit-profile" onClick={scrollToTop}>
              <p className="cursor-pointer bg-light-sky hover:bg-light-green hover:text-dark-green transition-all duration-500 py-3 px-6 rounded-3xl text-dark-sky">
                Edit Profile
              </p>
            </Link>
          </div>
        </div>

        {/* About */}
        <hr className="black border-1 border-gray2 w-full" />
        <div className="w-full grid grid-cols-6 gap-5 md:gap-0 py-6">
          <div className="col-span-6 md:col-span-2 text-xl flex items-center">
            <p className="font-semibold">About</p>
          </div>
          <div className="col-span-6 md:col-span-4 flex items-center">
            <p>{bio}</p>
          </div>
        </div>

        {/* Profession */}
        <hr className="black border-1 border-gray2 w-full" />
        <div className="w-full grid grid-cols-6 gap-5 md:gap-0 py-6">
          <div className="col-span-6 md:col-span-2 text-xl flex items-center">
            <p className="font-semibold">Profession</p>
          </div>
          <div className="col-span-6 md:col-span-4 flex items-center">
            <p>{profession}</p>
          </div>
        </div>

        {/* Username */}
        <hr className="black border-1 border-gray2 w-full" />
        <div className="w-full grid grid-cols-6 gap-5 md:gap-0 py-4">
          <div className="col-span-6 md:col-span-2 text-xl flex items-center">
            <p className="font-semibold">Username</p>
          </div>
          <div className="col-span-6 md:col-span-4 flex items-center">
            <p>{username}</p>
          </div>
        </div>

        {/* Email */}
        <hr className="black border-1 border-gray2 w-full" />
        <div className="w-full grid grid-cols-6 gap-5 md:gap-0 pt-4">
          <div className="col-span-6 md:col-span-2 text-xl flex items-center">
            <p className="font-semibold">Email</p>
          </div>
          <div className="col-span-6 md:col-span-4 flex items-center">
            <p>{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
