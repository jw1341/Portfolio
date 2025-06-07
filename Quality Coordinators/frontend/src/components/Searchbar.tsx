'use client'
import React, { useEffect, useState } from "react";

interface Props{
    handleSubmit: (location: string) => Promise<void>;
}
const Searchbar = ({handleSubmit}:Props) => {
    type filterResult = {
        City: string;
        Country:string; 
    }
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState<filterResult[]>([]);
     useEffect(()=>{
            const filterSearch = async () => {
                const response = await fetch(`http://localhost:5000/filter?query=${searchQuery}`);
                const data = await response.json();
                setSearch(data);
                console.log(data); // Check if the data is an array
            }
            filterSearch();
        },[])
        const filteredResults = search.filter(result =>
            (result.City && result.City.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (result.Country && result.Country.toLowerCase().includes(searchQuery.toLowerCase())) // Check both City and Country, ignore null/undefined
        );
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.length>0) {
            e.preventDefault();
            handleSubmit(searchQuery);
            setSearchQuery('');
        }
    };
    
    return (
        <div className="flex w-[775px] relative rounded-lg border border-black h-[45px]">
            <input 
                onChange={(e) => { setSearchQuery(e.target.value); console.log(searchQuery); }} 
                onKeyDown={handleKeyDown} 
                placeholder="Search location" 
                type="text" 
                className="h-[45px] p-2 w-full" 
            />
            <div className="top-[45px] w-full bg-white rounded-lg border-gray-400 absolute">
                {searchQuery !== '' &&
                    (filteredResults.length === 0 ? (
                        <p className="w-full border-b border-gray-400 p-2 text-gray-500">
                            No results found
                        </p>
                    ) : (
                        filteredResults.slice(0, 4).map((result, index) => (
                            <p onClick={() => { handleSubmit(result.City || result.Country); setSearchQuery(''); }}
                                key={index} 
                                className="cursor-pointer w-full border border-gray-400 p-2">
                                {result.City || result.Country}
                            </p>
                        ))
                    ))}
            </div>
            <div className="aspect-square text-black flex items-center p-3 gap-2 cursor-pointer"
                onClick={() => { handleSubmit(searchQuery); setSearchQuery(''); }}>
                <i className="fas fa-search"></i>
            </div>
        </div>
    )
}

export default Searchbar;
