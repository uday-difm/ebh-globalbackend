"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../redux/actions/action";
import { useRouter } from "next/navigation";
// import Image from "next/image"; // ← ADD THIS LINE

const EditProfile = () => {
  const fullData = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    userId,
    name = "",
    username = "",
    email = "",
    profession = "",
    bio = "",
    profile: profileImage = "",
  } = fullData;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    profession: "",
    bio: "",
    profileImage: "",
  });

  // Keep track of the preview object URL to revoke later
  const previewUrlRef = useRef(null);

  useEffect(() => {
    setFormData({
      name,
      username,
      email,
      profession,
      bio,
      profileImage,
    });
    // cleanup preview on unmount
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [name, username, email, profession, bio, profileImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // revoke previous preview if present
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const imageUrl = URL.createObjectURL(file);
      previewUrlRef.current = imageUrl;

      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
        profileFile: file, // keep file only in client memory
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = formData.profileImage;

      // If a new image file is selected, upload it first
      if (formData.profileFile) {
        const uploadData = new FormData();
        uploadData.append("image", formData.profileFile);

        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: uploadData,
          // include credentials so cookies/session are sent
          credentials: "include",
        });

        if (!uploadResponse.ok) {
          const text = await uploadResponse.text().catch(() => "");
          throw new Error(`Failed to upload image: ${uploadResponse.status} ${text}`);
        }

        const uploadResult = await uploadResponse.json();
        // The API might return { imageUrl } or { url } — handle both
        uploadedImageUrl = uploadResult.imageUrl ?? uploadResult.url ?? uploadedImageUrl;
      }

      // Build a clean payload (do not send profileFile or preview URL)
      const payload = {
        id: userId,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        profession: formData.profession,
        bio: formData.bio,
        profile: uploadedImageUrl,
      };

      const response = await fetch("/api/auth/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to update profile: ${response.status} ${text}`);
      }

      const updated = await response.json();

      // Update Redux state with the returned/confirmed data where possible.
      // Adjust this dispatch call to match your action signature.
      dispatch(
        setAuth(
          true,
          updated.id ?? userId,
          updated.name ?? payload.name,
          updated.profile ?? payload.profile,
          updated.username ?? payload.username,
          updated.profession ?? payload.profession,
          updated.email ?? payload.email,
          updated.bio ?? payload.bio
        )
      );

      // revoke preview URL after successful upload/navigation
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }

      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // optionally show user-friendly UI feedback here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-10 text-black">
        <h2 className="text-4xl font-bold text-dark-sky mb-6">Edit Profile</h2>
        <hr className="mb-6 border-gray-300" />

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Choose a username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profession" className="text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession || ""}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Your profession"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
            <label htmlFor="profileImage" className="text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
            {formData.profileImage && (
              // show preview only; not sending this preview URL to server
              <img
  src={formData.profileImage}
  alt="Profile Preview"
  className="mt-2 w-24 h-24 object-cover rounded-full"
/>
            )}
          </div>

          <div className="col-span-1 md:col-span-2 mt-4 p-4 rounded-md">
            <button
              type="submit"
              className="bg-dark-sky hover:bg-light-green bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out w-full md:w-auto"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
