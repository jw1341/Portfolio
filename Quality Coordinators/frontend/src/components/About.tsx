"use client";
import React, { useState } from "react";

const About = () => {
  const [moduleVisibility, setVisibility] = useState(false);
  const aboutcontent = moduleVisibility ? (
    <button
      onMouseOver={() => {
        setVisibility(true);
      }}
      onMouseLeave={() => {
        setVisibility(false);
      }}
      onClick={() => {
        setVisibility(!moduleVisibility);
      }}
      className="overflow-hidden bg-[rgba(0,0,0,0.3)] opacity-70 w-[200px] flex justify-between items-center px-4 cursor-pointer rounded-full border border-white h-10 transition-all duration-200"
    >
      <p>About</p>
      <i className="fa-solid fa-wind"></i>
    </button>
  ) : (
    <button
      onMouseOver={() => {
        setVisibility(true);
      }}
      onMouseLeave={() => {
        setVisibility(false);
      }}
      onClick={() => {
        setVisibility(!moduleVisibility);
      }}
      className="bg-[rgba(0,0,0,0.3)] cursor-pointer rounded-full border border-white w-10 h-10 transition-all duration-200"
    >
      ?
    </button>
  );
  return (
    <div className="animate-icons flex flex-col gap-3 z-50 absolute bottom-5 left-5 text-white">
      {moduleVisibility && (
        <div className="animate-slide-up text-[14px] text-white opacity-90  w-[200px] p-3 rounded-lg full bg-[rgba(0,0,0,0.3)]">
          Enter the name of your city to get real-time air quality information.
          Stay informed about the air you breathe with up-to-date pollution data
          right at your fingertips.
        </div>
      )}
      {aboutcontent}
    </div>
  );
};

export default About;
