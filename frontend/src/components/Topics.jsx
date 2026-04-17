import React from "react";
import { Tilt } from "react-tilt";
import { Link, useNavigate } from "react-router-dom";

const Topics = () => {
  const navigate = useNavigate();
  const defaultOptions = {
    reverse: false, // reverse the tilt direction
    max: 35, // max tilt rotation (degrees)
    perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000, // Speed of the enter/exit transition
    transition: true, // Set a transition on enter/exit.
    axis: null, // What axis should be disabled. Can be X or Y.
    reset: true, // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
  };
  const topics = [
    { name: "Web Development", to: "/webdev" },
    { name: "Quick Compiler", to: "/mt01/codeeditor" },
    { name: "Tutorials", to: "/tutorials" },
    { name: "Articles", to: "/articles" },
    { name: "Dev Challenges", to: "/devchallenges" },
    { name: "Interview Experiences", to: "/interviewexperiences" },
    { name: "Mock Tests", to: "/mocktests" },
    { name: "Core CS Subjects", to: "/studymetarials/csfundamentals" },
  ];
  const handleButtonClick = (item) => {
    // e.stopPropagation();
    console.log("Navigating to:", item);
    if (item.to) {
      navigate(item.to);
    } else {
      alert("This topic is not yet available.");
    }
  };
  return (
    <div className="w-[55%] h-full grid grid-cols-2 gap-5 less800:w-[80%]">
      {topics.map((item, index) => (
        <Tilt
         options={defaultOptions}
          key={index}
          
          className="text-white bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-600 text-center flex justify-center items-center cursor-pointer rounded-lg border border-1 border-purple-700 hover:bg-gradient-to-l hover:from-pink-600 hover:via-purple-700 hover:to-indigo-900 hover:scale-110 hover:ease-in-out less800:h-[80px]"
        >
           <div
            onClick={() => handleButtonClick(item)}
            className="w-full h-full flex justify-center items-center"
          >
            {item.name}
          </div>
        </Tilt>
      ))}
    </div>
  );
};

export default Topics;
