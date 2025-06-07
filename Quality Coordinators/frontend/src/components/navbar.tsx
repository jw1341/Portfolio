"use client";
import Link from "next/link";
import React, { useState } from "react";
import Developers from "./Developers";

interface Props {
    className?:string;
}

const Navbar = ({className}:Props) => {
    const [ishover, sethover] = useState(false);
    const github = ishover
    ? <Link onMouseEnter = {()=>{sethover(true)}} onMouseLeave = {()=>{sethover(false)}} className = "flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full transition-all duration-200" href={""}>
        <p>Github</p>
        <i className="animate-git text-[21px] fa-brands fa-github"></i>
      </Link>
    : <Link onMouseEnter = {()=>{sethover(true)}} onMouseLeave = {()=>{sethover(false)}} className = "bg-white text-black px-4 py-3 rounded-full transition-all duration-200" href={""}>
        Github
      </Link>;
    return (
        <div className =  {`${className} p-5 w-full`}>
            <div className = "w-full flex justify-between bg-[rgba(0,0,0,0.2)] p-5 rounded-[20px] items-center">
                <div className = "flex gap-[5px] items-center">
                    <div className = "overflow-hidden w-8 h-8 flex justify-center text-white items-center bg-[rgba(0,0,0,0.2)] rounded-lg">
                       <div className = "flex gap-7">
                            <i className="animate-wind fa-solid fa-wind"></i>
                            <i className="animate-wind fa-solid fa-wind"></i>
                            <i className="animate-wind fa-solid fa-wind"></i>
                            <i className="animate-wind fa-solid fa-wind"></i>
                       </div>
                    </div>
                    <Link className ="text-white" href={"/"}>Quality Coordinators</Link>
                </div>
                <div className="gap-5 items-center hidden sm:flex">
                    <Developers/>
                    {github}
                </div>
                <div className = "flex sm:hidden">
                    {/* <i className="text-[21px] fa-solid fa-bars"></i> */}
                    <i className="text-[25px] fa-brands fa-github"></i>
                </div>
            </div>
        </div>
    )
}

export default Navbar;