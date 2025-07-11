import React, { useEffect, useState, useRef } from "react";

const Setting = () => {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // State for image preview
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    user_profile: '',
    profession: "",
    bio: "",
  });

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      name: fullData.name || '',
      username: fullData.username || '',
      email: fullData.email || '',
      profession: fullData.profession || '',
      user_profile: fullData.profile || '',
      bio: fullData.bio || '',
    }));
  }, [fullData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: value ? "" : "This field is required",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        user_profile: file,
      });
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'bio' && key !== 'user_profile' && !formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(editUserProfile(fullData.userId, formData));
  };

  return (
    <main className="container mx-auto py-14 mt-28">
      <div className="p-2 md:p-4">
        <div className="w-full px-6 pb-8 sm:rounded-lg shadow-xl max-w-4xl mx-auto">
          <div className="grid mx-auto mt-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                {avatarPreview ? ( // Render the image preview if available
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src={avatarPreview}
                    alt="Avatar Preview"
                  />
                ) : fullData.profile ? ( // If no preview, but user has profile picture, use it
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src={fullData.profile}
                    alt="User Profile"
                  />
                ) : ( // If no preview and no user profile, show default avatar
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png"
                    alt="Default Avatar"
                  />
                )}

                <div className="grid grid-cols-1 gap-4 sm:ml-8">
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Update your profile
                  </h2>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="py-1.5 px-4 text-base font-medium transition duration-300 focus:outline-none bg-green rounded-lg border border-gray hover:bg-blue focus:z-10 text-white"
                    >
                      Change avatar
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>

              <div className="items-center mt-8 sm:mt-10">
                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium dark:text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray focus:border-green focus:outline-none focus:ring-1 focus:ring-green text-sm rounded-lg block w-full p-2.5"
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-gray text-sm rounded-lg focus:border-green focus:outline-none focus:ring-1 focus:ring-green block w-full p-2.5"
                      placeholder="Your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                  <div className="w-full">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="border border-gray text-sm rounded-lg focus:border-green focus:outline-none focus:ring-1 focus:ring-green block w-full p-2.5"
                      placeholder="Your username"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="profession"
                      className="block mb-2 text-sm font-medium dark:text-white"
                    >
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="border border-gray text-sm rounded-lg focus:border-green focus:outline-none focus:ring-1 focus:ring-green block w-full p-2.5"
                      placeholder="Your profession"
                    />
                    {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}
                  </div>
                </div>


                <div className="mb-6">
                  <label
                    htmlFor="bio"
                    className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-gray focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                    placeholder="Write your bio here..."
                  ></textarea>
                  {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-white bg-green hover:bg-blue transition-all duration-500  focus:border-green focus:outline-none focus:ring-1 focus:ring-greenhover:bg-blue focus:ring-blue font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Setting;