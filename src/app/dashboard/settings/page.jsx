'use client'; // <-- Mark this component as a client-side component

import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../component/DashboardLayout';

const SettingsPage = () => {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  const handleSave = () => {
    console.log("Save clicked", formData);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Settings - Earth By Human</title>
        <meta name="description" content="User settings page" />
      </Head>

      <div className="py-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section: Personal Information */}
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6 space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Personal Information</h2>

            <form>
              <div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-5 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-5 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-5 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">BIO</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="mt-2 block w-full px-5 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Cancel and Save buttons below BIO */}
                <div className="flex justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-1/2 px-5 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-1/2 px-5 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Section: Photo Upload */}
          <div className="flex-shrink-0 w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Your Photo</h2>

            {/* Photo Preview Section */}
            <div className="flex justify-center mb-6">
              <div
                className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-300"
                style={{
                  backgroundImage: `url(${photo || 'https://via.placeholder.com/150'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!photo && <span className="text-gray-400">No Photo</span>}
              </div>
            </div>

            {/* Delete and Update Buttons */}
            <div className="flex justify-center gap-[9px] mb-6">
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-700 focus:outline-none"
                onClick={() => setPhoto(null)}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
              >
                Update
              </button>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-md space-y-4">
              <div className="flex justify-center items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7-7-7 7M12 2v18" />
                  </svg>
                </div>
              </div>
              <span className="text-red-600 text-sm font-medium">Click to upload or drag and drop</span>
              <span className="text-gray-600 text-xs">SVG, PNG, JPG, or GIF (max. 800 X 800px)</span>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose File
              </label>
            </div>

            {/* Action Buttons: Cancel and Save */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                type="button"
                className="w-1/2 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-1/2 px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
