import React from "react";
import Link from "next/link"; // Changed from react-router-dom
import { useSelector } from "react-redux";

const Profile = () => {
  const fullData = useSelector(state => state.auth); // Assuming Redux is set up in Next.js
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container py-28 max-w-[1200px] mx-auto px-[15px] flex justify-center items-center ">
      <div className=" w-full flex shadow-xl rounded-2xl py-20  flex-col items-start gap-5 px-[5%] ">
        <p className="text-3xl font-bold">Profile details</p>
        <hr className="black border-1 border-gray2 w-full"></hr>
        <div className=" w-full grid grid-cols-6 gap-5 md:gap-0 py-8">
         <div className="col-span-6 md:col-span-2 flex md:flex-row flex-col items-center">
         <p className="font-semibold text-xl" >Profile</p>
         </div>
          <div className="col-span-6 md:col-span-4 flex md:flex-row flex-col justify-between gap-5 ">
          <div className=" flex md:flex-row flex-col  gap-5 items-center ">
          <img src={fullData.profile ? fullData.profile : "https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/EBH-Profile.png"} alt="earthbyhumans profile" className="w-[100px] h-[100px] object-cover rounded-full " />
            <p>{fullData.name}</p>
          </div>
          <Link href="/edit-profile"> {/* Changed to Next.js Link with href */}
            <p onClick={scrollToTop} className="bg-light-sky hover:bg-light-green hover:text-dark-green transition-all duration-500 py-3 px-6 rounded-3xl text-dark-sky">Edit Profile</p>
          </Link>
          </div>
        </div>
        <hr className="black border-1 border-gray2 w-full"></hr>
        <div className=" w-full grid grid-cols-6 gap-5 md:gap-0 py-6">
         <div  className="col-span-6 md:col-span-2 text-xl flex md:flex-row flex-col items-center"> <p className="font-semibold">About</p></div>
          <div className="col-span-6 md:col-span-4 flex md:flex-row flex-col items-center"><p >{fullData.bio}</p></div>
        </div>
        <hr className="black border-1 border-gray2 w-full"></hr>
        <div className=" w-full grid grid-cols-6 gap-5 md:gap-0 py-6">
         <div  className="col-span-6 md:col-span-2 text-xl flex md:flex-row flex-col items-center"> <p className="font-semibold">Profession</p></div>
          <div className="col-span-6 md:col-span-4 flex md:flex-row flex-col items-center"><p >{fullData.profession}</p></div>
        </div>
        <hr className="black border-1 border-gray2 w-full"></hr>
        <div className=" w-full grid grid-cols-6 gap-5 md:gap-0 py-4">
         <div  className="col-span-6 md:col-span-2 flex md:flex-row text-xl flex-col items-center"> <p className="font-semibold">Username</p></div>
          <div className="col-span-6 md:col-span-4 flex md:flex-row flex-col items-center"><p >{fullData.username}</p></div>
        </div>
        <hr className="black border-1 border-gray2 w-full "></hr>
        <div className=" w-full grid grid-cols-6 gap-5 md:gap-0 pt-4">
         <div  className="col-span-6 md:col-span-2 flex md:flex-row text-xl flex-col items-center"> <p className="font-semibold">Email</p></div>
          <div className="col-span-6 md:col-span-4 flex md:flex-row flex-col items-center"><p >{fullData.email}</p></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;