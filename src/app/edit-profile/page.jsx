"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/actions/action';
import { useRouter } from 'next/navigation';

const EditProfile = () => {
  const fullData = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    userId,
    name = '',
    username = '',
    email = '',
    profession = '',
    bio = '',
    profile: profileImage = '',
  } = fullData || {};

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    profession: '',
    bio: '',
    profileImage: '',
  });

  useEffect(() => {
    setFormData({
      name,
      username,
      email,
      profession,
      bio,
      profileImage,
    });
  }, [name, username, email, profession, bio, profileImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
        profileFile: file,
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
        uploadData.append('image', formData.profileFile);

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadResult = await uploadResponse.json();
      uploadedImageUrl = uploadResult.imageUrl;
      }

      const response = await fetch('/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...formData, profile: uploadedImageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update Redux state with new profile data
      dispatch(setAuth(true, userId, formData.name, uploadedImageUrl, formData.username, formData.profession, formData.email, formData.bio));

      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-10 text-black" >
        <h2 className="text-4xl font-bold text-dark-sky mb-6">Edit Profile</h2>
        <hr className="mb-6 border-gray-300" />

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Choose a username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profession" className="text-sm font-medium text-gray-700">Profession</label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Your profession"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className=" border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-light-sky focus:border-dark-sky transition"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
            <label htmlFor="profileImage" className="text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
            {formData.profileImage && (
              <img
                src={formData.profileImage}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div>

          <div className="col-span-1 md:col-span-2 mt-4 bg-gray-900 p-4 rounded-md">
            <button
              type="submit"
              className="bg-dark-sky hover:bg-light-green text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out w-full md:w-auto"
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
