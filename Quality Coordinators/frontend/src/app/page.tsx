'use client';
import About from "@/components/About";
import Contact from "@/components/Contact";
import DecryptedText from "@/components/DecryptedText";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/Searchbar";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Import the useRouter hook

export default function Home() {
  const [searchhover, setsearchhover] = useState(false);
  const [search, setsearch] = useState(false);
  const [currnumber, setnumber] = useState(0);
  const [closeHover, setCloseHover] = useState(false);
  const router = useRouter(); // Initialize the router

  // Modify handleSubmit to navigate to the result page
  const handleSubmit = async (location: string) => {
    console.log("This is the inputed:", location);
    // Route to result page with location as query parameter
    const encodedLocation = encodeURIComponent(location);
    router.push(`/searchresult?location=${encodeURIComponent(encodedLocation)}`);
  }
  

  return (
    <div className="green overflow-hidden h-[100vh] text-black flex flex-col">
      <Navbar className="z-50 absolute" />
      {!search && <About />}
      {/* {!search && <Contact />} */}
      <div className="bg-cover bg-no-repeat relative flex justify-center flex-grow items-center w-full">
        <div
          className="z-50 w-fit h-fit flex gap-[10px] flex-col items-center justify-center"
        >
          <DecryptedText
            revealDirection="center"
            animateOn="view"
            text="AIR QUALITY CHECKER"
            speed={120}
            maxIterations={20}
            useOriginalCharsOnly={true}
            parentClassName="hidden array text-black text-[30px] leading-none text-center sm:text-[65px]"
          />
          <DecryptedText
            revealDirection="center"
            animateOn="view"
            text="Find the air quality of your city."
            speed={120}
            maxIterations={20}
            useOriginalCharsOnly={true}
            characters="AIR QUALITY CHECKER "
            parentClassName="hidden text-black text-[21px]"
          />
          {/* Pass handleSubmit to Searchbar */}
          <Searchbar handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
