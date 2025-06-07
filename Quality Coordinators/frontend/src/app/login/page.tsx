"use client"
import Navbar from "@/components/navbar";
import React, { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    return (
        <div className = "w-full h-full flex items-center justify-center">
            <Navbar className="z-50 absolute top-0" />
            <form className = "w-[500px] flex flex-col gap-3 bg-[rgba(0,0,0,0.3)] p-3 rounded-lg">
                <h1 className = "array text-[21px]">Login</h1>
                <p className = "leading-none">Username</p>
                <input onChange = {(e) => setUsername(e.target.value)} type = "text"  className="bg-white text-black w-full p-2 rounded-lg"/>
                <p className="leading-none">Password</p>
                <input onChange = {(e) => setPassword(e.target.value)} type = "password" className="bg-white text-black w-full p-2 rounded-lg"/>
                <button type = "submit" className = "w-full cursor-pointer bg-white text-black p-2 rounded-lg ">Login</button>
            </form>
        </div>
    )
}
