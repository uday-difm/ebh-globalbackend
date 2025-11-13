"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setAuth } from "../redux/actions/action";
import Image from "next/image";

const Profile = () => {
  const fullData = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // local state to hold a safe string URL for profile image preview
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/auth/profile?userId=${fullData.userId}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");

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

    if (fullData.userId) fetchProfile();
  }, [fullData.userId, dispatch]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Keep track if we created an object URL so we can revoke it on cleanup
  useEffect(() => {
    let objectUrl;
    // If profile is a File/Blob (e.g. selected on edit page and stored in redux),
    // create an object URL. If it's a string, use it directly. Otherwise use default.
    if (profile && typeof profile === "object" && ("size" in profile || profile instanceof Blob)) {
      try {
        objectUrl = URL.createObjectURL(profile);
        setProfileUrl(objectUrl);
      } catch (e) {
        console.error("Could not create object URL for profile file:", e);
        setProfileUrl(defaultProfileImage);
      }
    } else if (profile && typeof profile === "string") {
      setProfileUrl(profile);
    } else {
      setProfileUrl(defaultProfileImage);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex items-center justify-between flex-wrap mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Profile Details</h2>
          <Link href="/edit-profile" onClick={scrollToTop}>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition">
              Edit Profile
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-10">
          <div className="flex flex-col items-center gap-4">
            {/* Use native <img> to avoid next/image loader issues for blob URLs */}
            <Image
              src={profileUrl || defaultProfileImage}
              alt="Profile"
              width={128}   // w-32 = 128px
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow"
              unoptimized  
            />
            <p className="text-xl font-semibold text-gray-800">{name}</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Username</p>
              <p className="text-lg text-gray-700 font-semibold">{username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-lg text-gray-700 font-semibold">{email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Profession</p>
              <p className="text-lg text-gray-700 font-semibold">{profession}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-gray-700">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
