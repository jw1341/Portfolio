'use client'
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; 
import About from "@/components/About"; 
import { desc } from "framer-motion/client";

export default function ResultPage() {
    const router = useRouter();  // Use Next.js router
    const goBack = () => {
        // Explicitly navigate to the previous page with the location as a query parameter
        if (location) {
            router.push(`/searchresult?location=${encodeURIComponent(location)}`); // Update the URL with the location
        } else {
            router.back(); // If there's no location, just go back
        }
    };
    const usercomment = (comment:string) => {
        return (
            <div className = "flex gap-2 items-center p-2 border-b border-gray-400">
                <img src = "https://th.bing.com/th/id/OIP.rC8YhyU3o0agogK61ALrQgHaHa?rs=1&pid=ImgDetMain" className = "w-[45px] h-[45px] rounded-full"/>
                <div className = "flex flex-col">
                    <div className = "flex gap-2 items-center">
                        <p className = "font-bold text-[18px]">Bean</p>
                        <p className = "text-gray-700 text-[14px]">3/16/18</p>
                    </div>
                    <p>{comment}</p>
                </div>
            </div>
        )
    }
    const searchParams = useSearchParams(); 
    const location = searchParams.get('location');  // Get the 'location' query parameter
    const description = searchParams.get('description'); // Get the 'description' query parameter
    const trimmedDescription = description ? description.replace(/^"|"$/g, '') : ''; 
    useEffect(() => {
        if (location) {
            console.log("Location: ", location);
            // Here you can fetch data based on the location
        }
    }, [location]); // Run the effect when location changes
    useEffect(() => {
        //fetch data 
        const getAQI = async () => {
            if (!location) return;  // Prevent empty search
            const response = await fetch(`http://localhost:5000/single?query=${location}`);
            // local for testing
            const data = await response.json();
            setLocationAQI(data[0].AQI_value);
            setLocationAQIRating(data[0].AQI_category);
            setLocationOzone(data[0].CO_AQI_value);
            setLocationRating(data[0].CO_AQI_category);
            setLocationNO2(data[0].Ozone_AQI_value);
            setLocationNO2Rating(data[0].Ozone_AQI_category);
            setLocationCO(data[0].NO2_AQI_value);
            setLocationCORating(data[0].NO2_AQI_category);
            setLocationPM25(data[0].PM2_5_AQI_value);
            setLocationPM25Rating(data[0].PM2_5_AQI_category);
        }
        getAQI();
    },[])
    const [locationAQI, setLocationAQI] = useState(0);
    const [locationAQIRating, setLocationAQIRating] = useState('');
    const [locationOzone, setLocationOzone] = useState(0);
    const [locationOzoneRating, setLocationRating] = useState('');
    const [locationNO2, setLocationNO2] = useState(0);
    const [locationNO2Rating, setLocationNO2Rating] = useState('');
    const [locationCO, setLocationCO] = useState(0);
    const [locationCORating, setLocationCORating] = useState('');
    const [locationPM25, setLocationPM25] = useState(0);
    const [locationPM25Rating, setLocationPM25Rating] = useState('');
    const [ratingColor, setRatingColor] = useState('text-black');
    const informationcard = (rating: string, name: string, number: number) => {
        let ratingColor = "text-green-500"; // Default to green for "good"
        if (rating === "Moderate") {
            ratingColor = "text-yellow-500"; // Use yellow for "moderate"
        } else if (rating === "Bad" || rating === "Unhealthy") {
            ratingColor = "text-red-500"; // Use red for "bad"
        }
    
        return (
            <div className="border border-gray-200 relative greengradient borderborder-gray-200 flex flex-col w-full aspect-square items-center justify-center rounded-[50px] text-black">
                <div className={`glowing w-[10px] absolute top-5 right-5 h-[10px] ${ratingColor} rounded-full`} />
                <p>{name}</p>
                <h4 className="font-bold text-[34px]">{number}</h4>
                <p className={`uppercase font-semibold ${ratingColor}`}>{rating}</p>
            </div>
        );
    }
    
    const [commentModal, setCommentModal] = useState(false);
    const [comment, setComment] = useState('');
    return (
        <div className = "text-white p-2 flex flex-col h-[100vh] items-center justify-center w-full">
            {commentModal && 
            <div className = "z-500 fixed flex items-center justify-center top-0 w-full h-full bg-[rgba(0,0,0,0.5)] left-0">
            <button onClick = {()=>{setCommentModal(false)}} className = "absolute top-0 left-0 w-full h-full"/>
            <div className = 'relative w-[500px] h-[500px] rounded-[20px] overflow-hidden bg-white'>
                <textarea onChange = {(e)=>{setComment(e.target.value)}} placeholder = "Add comment here" className = 'rounded-[20px] p-3 w-full h-full  text-black resize-none'/>
                <button onClick = {()=>setCommentModal(false)} className = "cursor-pointer z-600 text-black absolute top-3 right-3"><i className="text-[30px] fa-solid fa-circle-xmark"></i></button>
                <div className = "absolute left-0 bottom-0 w-full p-2">
                    <button className = "z-600 bg-white text-black w-full cursor-pointer text-black py-2 px-5 rounded-full border border-black">Add Comment +</button>
                </div>
            </div>
            </div>}
            {/* <About/> */}
            <div className = "w-[68%] flex flex-col gap-3 items-center justify-start">
            <div className = "absolute top-0 w-full flex justify-between">
                <div className = "flex w-full bg-white p-5 border-b border-black justify-between items-center">
                <button onClick={goBack} className = "py-2 text-black border-b w-fit"><i className = "fa-solid fa-arrow-left"/> Back to Search Results</button>
            {/* <div className="flex w-[400px] relative rounded-lg border border-black bg-white text-black h-[45px]">
                        <input placeholder="Search location" type="text" className="h-[45px] p-2 w-full" />
                        <button className="aspect-square flex items-center p-3 gap-2">
                            <i className="fas fa-search"></i>
                        </button>
                    </div> */}
                </div>
                </div>
            <div className = "flex items-center gap-2 w-full">
                <div className = "w-[50px] h-[50px] aspect-square border border-black bg-black rounded-full"></div>
                <h1 className = "font-bold w-full leading-none text-[50px] text-left text-black uppercase namefont">{location}</h1>
            </div>
            <p className = "text-left w-full text-black text-[16px]">{trimmedDescription}</p>
            <div className = "flex gap-4 w-full">
            {informationcard(locationAQIRating, 'AQI', locationAQI)}
            {informationcard(locationOzoneRating, 'Ozone', locationOzone)}
            {informationcard(locationNO2Rating, 'NO2', locationNO2)}
            {informationcard(locationCORating, 'CO', locationCO)}
            {informationcard(locationPM25Rating, 'PM2.5', locationPM25)}
            </div>
            </div>
            <div className = "w-[1200px] cursor-pointer absolute h-[500px] bottom-0 text-black translate-y-[350px] bg-white border border-gray-300 rounded-[20px]">
                <div className = "w-full p-2 border-b border-gray-400 flex items-center justify-between">
                    <h2 className = " text-[21px] p-2 font-bold">Comments</h2>
                    <button onClick = {()=>setCommentModal(true)} className = "py-2 px-5 rounded-full border border-black">Add Comment +</button>
                </div>
                {usercomment("wow this is so amazing! This is my first comment")}
                {usercomment("wow this is so amazing! This is my second comment")}
                {usercomment("wow this is so amazing! This is my third comment")}
            </div>
        </div>
    ) 
}