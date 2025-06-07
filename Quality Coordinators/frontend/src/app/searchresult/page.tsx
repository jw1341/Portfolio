'use client'
import Developers from "@/components/Developers";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/Searchbar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'; 

export default function searchresult() {
    const searchParams = useSearchParams(); 
    const location = searchParams.get('location');  // Get the 'location' query parameter
    console.log(location);
    type SearchResult = {
        City: string;
        Description: string;
      };
    
    // Initial placeholder data
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [nearbyLocations, setNearbyLocations] = useState([
        { name: 'New Jersey', description: 'Air quality in New Jersey is moderate.' },
        { name: 'Albany', description: 'Air quality in Albany is good.' },
        { name: 'New York City', description: 'Air quality in NYC is fair.' },
    ]);

    const handleSubmit = async (location:string) => {
        console.log("LOCATION:", location);
        setShowResults(false);
        // console.log(searchQuery);
        if (!location) return;  // Prevent empty search
        const Query = location;
        const response = await fetch(`http://localhost:5000/search?query=${Query}`);
        const data = await response.json();
        console.log(data);
        setShowResults(true);
        setSearchResults(data);
          // Update UI with search results
    }
    useEffect(()=>{
        if(location){
            console.log("location exists");
            handleSubmit(location);
        }
    },[])
    return (
        <div className="bg-white text-black w-full flex flex-col">
            <div className="p-5 w-full border-b border-gray-400 items-center flex justify-between">
                <div className="w-full flex items-center gap-2">
                    <div className="overflow-hidden w-[45px] h-[45px] flex justify-center text-white items-center bg-black rounded-lg">
                        <div className="flex gap-7">
                            <i className="animate-wind fa-solid fa-wind"></i>
                            <i className="animate-wind fa-solid fa-wind"></i>
                            <i className="animate-wind fa-solid fa-wind"></i>
                            <i className="animate-wind fa-solid fa-wind"></i>
                        </div>
                    </div>
                    <Searchbar handleSubmit = {handleSubmit}/>
                </div>
                <div className="flex gap-5 items-center">
                    <Developers />
                    <button className="px-5 py-2 rounded-full border">Github</button>
                </div>
            </div>
            <div className="px-5 py-5 flex gap-2 w-full">
            {!showResults ?             <div className="w-[65%] flex flex-col">
                    <div className = "w-full h-full flex flex-col gap-2 items-center justify-center">
                        <div className = "loader"/>
                        <p>Loading</p>
                    </div>
            </div> : <div className="w-[65%] flex flex-col">
                    {/* Map over searchResults */}
                    <p className="text-gray-600">{searchResults.length} Results</p>
                    {searchResults.map((result, index) => (
                        <Link 
                    key={index} 
                    className="p-5 border-b border-gray-300 px-10 gap-2 flex flex-col w-full items-center" 
                    href={`/resultpage?location=${encodeURIComponent(result.City)}&description=${encodeURIComponent(result.Description)}&description=${encodeURIComponent(result.Description)}`}
                    >
                     <div className="items-center gap-2 flex w-full">
                                <div className="w-[40px] h-[40px] rounded-full bg-gray-600"></div>
                                <p className="underline font-semibold text-[21px]">{result.City}</p>
                            </div>
                            <p className="text-gray-500 text-[15px] truncate w-full">
                                {result.Description}
                            </p>
                        </Link>
                    ))}
                </div>}
                <div className="w-[35%] flex flex-col">
                    <h3 className="text-[21px] font-bold">Nearby Locations</h3>
                    {/* Map over nearbyLocations */}
                    {nearbyLocations.map((location, index) => (
                        <div key={index} className="p-3">
                            <Link className="w-full overflow-hidden p-5 bg-gray-200 rounded-full px-10 flex items-center gap-2" href={""}>
                                <i className="fas fa-search"></i>
                                <div>
                                    <p><strong>{location.name}</strong> Air Quality</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
