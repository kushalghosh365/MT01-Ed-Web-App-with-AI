import React from "react";
import AvatarGroup from "../components/AvatarGroup";
import Topics from "../components/Topics";
import { Tilt } from "react-tilt";

const Body = () => {
  return (
    <div className="w-full h-[85vh] bg-white flex justify-center items-center less800:h-auto less800:p-5">
      <div className="w-[85%] h-[80%]  flex gap-10 less800:flex-col less800:w-full less800:h-auto less800:items-center less800:gap-10">
        <div className="w-[45%] h-full  flex-col p-5 less800:w-[80%]">
          <h6 className="text-black text-[42px] font-bold leading-none">
            Code yourself by <br /> your own with help of{" "}
            <span className="text-[#2ECC71] font-bold mt-2">MT01</span>
          </h6>
          <h1 className="text-gray-500 mt-2">
            Elevate your programming skills, solve challenges, and unlock the
            world of coding possibilities.
          </h1>
          <div className="flex items-center justify-items-start">
            <Tilt className=" flex justify-center items-center cursor-pointer w-[140px] h-[50px] bg-blue-600 rounded-full mt-10 text-white ">
              View Courses
            </Tilt>
            <Tilt className=" flex justify-center items-center cursor-pointer w-[140px] h-[50px] bg-white rounded-full border border-1 border-blue-600 mt-10 text-blue-600 ml-10">
              Watch Video
            </Tilt>
          </div>
          <div className="mt-10 w-[200px] border-blue-600  h-[60px] rounded-lg ">
           <AvatarGroup/>
           <span className="text-white text-center">100+ Happy Learners</span>
          </div>
        </div>
          <Topics/>
      </div>
    </div>
  );
};

export default Body;
