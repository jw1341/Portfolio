"use client";
import React, { useState } from "react";
import DecryptedText from "./DecryptedText";

const Contact = () => {
  const [ishover, sethover] = useState(false);
  const [formvisibility, setformvisibility] = useState(false);
  return (
    <div>
      <div className={`${formvisibility ? 'opacity-100 z-300  ' : 'opacity-0'} transition-all duration-300 flex items-center justify-center absolute w-full h-full top-0 left-0`}>
        <button onClick = {()=>setformvisibility(false)} className = "bg-[rgba(0,0,0,0.3)] absolute w-full h-full top-0 left-0"/>
        <form className = "z-500 rounded-lg bg-[rgba(0,0,0,0.7)] w-[500px] flex flex-col p-3 gap-3">
            <div className = "flex w-full justify-between items-center">
                <h2 className = "array text-[25px]">Contact Us!</h2>
                <p>x</p>
            </div>
            <p>Name</p>
            <input className = "bg-white text-black rounded-lg" type = "text"></input>
            <p>Feedback</p>
            <input className = "bg-white text-black rounded-lg h-[100px]" type = "text"></input>
            <button className = "bg-white text-black rounded-lg">Submit</button>
        </form>
      </div>
      <div className="animate-icons z-50 absolute bottom-5 right-5 text-white">
        {ishover ? (
          <button
            onMouseOver={() => {
              sethover(true);
            }}
            onMouseLeave={() => {
              sethover(false);
            }}
            onClick={()=>{setformvisibility(!formvisibility)}}
            className="px-5 py-3 bg-[rgba(0,0,0,0.3)] border rounded-full transition-all duration-200"
          >
            <DecryptedText
              revealDirection="center"
              animateOn="view"
              text="Contact Us!"
              speed={40}
              maxIterations={10}
              useOriginalCharsOnly={true}
              characters="AIR QUALITY CHECKER "
              parentClassName="text-white text-[16px]"
            />
          </button>
        ) : (
          <button
            onMouseOver={() => {
              sethover(true);
            }}
            onMouseLeave={() => {
              sethover(false);
            }}
            className="px-4 py-3 bg-[rgba(0,0,0,0.3)] border rounded-full transition-all duration-200"
          >
            Feedback?
          </button>
        )}
      </div>
    </div>
  );
};

export default Contact;
