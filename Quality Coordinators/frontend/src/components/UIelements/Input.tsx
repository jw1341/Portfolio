import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "sm" | "lg";

}

const Input = ({ variant = "sm", className, ...prop }: Props) => {
    const variants = {
        sm: '',
        lg: '',
    };
    return (
        <input className = {`${variants[variant]} ${className}`} {...prop}/>
    )
};

export default Input;
