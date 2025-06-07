"use client";
import React, { ButtonHTMLAttributes, useState } from "react";
import DecryptedText from "../DecryptedText";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "sm" | "lg";
  content: string;
  contentafter?: string;
  animatetype?: "none" | "decrypt" | "slide";
}

const Button = ({
  variant = "sm",
  content = "Feedback?",
  animatetype = "none",
  contentafter = "",
  className,
  ...prop
}: Props) => {
  const [isHover, setHover] = useState(false);
  const variants = {
    sm: "bg-black px-3 py-2 rounded-full",
    lg: "bg-black px-5 py-3 rounded-full",
  };
  if (animatetype == "decrypt") {
    return (
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`${variants[variant]} ${className}`}
        {...prop}
      >
        {isHover ? (
          <DecryptedText
            revealDirection="center"
            animateOn="view"
            text={contentafter}
            speed={40}
            maxIterations={10}
            useOriginalCharsOnly={true}
            characters="AIR QUALITY CHECKER "
            parentClassName="text-white text-[16px]"
          />
        ) : (
          content
        )}
      </button>
    );
  } else if (animatetype == "slide") {
    return (
      <button  onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)} className={`transition-all duration-300 ease-in-out ${isHover ? 'px-5' : 'px-3'} ${variants[variant]} ${className}`} {...prop}>
        {isHover ? <div className = "flex gap-3 w-full justify-between">{contentafter}<p>h</p></div> : <p>{content}</p>}
      </button>
    );
  } else {
    return (
      <button className={`${variants[variant]} ${className}`} {...prop}>
        {content}
      </button>
    );
  }
};

export default Button;
