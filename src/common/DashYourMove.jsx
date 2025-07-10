import React from "react";
import YourMove from "../app/yourmove/page"; // Adjust path based on your Next.js project structure

function DashYourMove({ analyticUpdate }) {
  return (
    <div className="w-full">
      <div className="container 2xl:px-16 mx-auto py-[60px] px-[15px]">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-blue text-center font-bold">
            Track Your Score
          </h2>
        </div>
        <YourMove analyticUpdate={analyticUpdate}/>
      </div>
    </div>
  );
}

export default DashYourMove;