import {  useRouter } from "next/navigation";
import { useEffect, useState } from "react";

 interface PasswordComponentProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
}
export default function PasswordComponent(
    {step,
    setStep,
    email,
    setEmail,
    newPassword,
    setNewPassword

    }:PasswordComponentProps){
        const router = useRouter();
         const timeout = setTimeout(() => {
        router.push("/");
    }, 3000);
        useEffect(()=>{
            
            return () => clearTimeout(timeout);
        },[])
    
        return(
            <h1>You successfully changed email</h1>
        )
}