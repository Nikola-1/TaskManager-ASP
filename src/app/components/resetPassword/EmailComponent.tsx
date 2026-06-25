'use client'
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import next from "../../../../public/img/next.png";
import { useRouter } from 'next/navigation';
import { ForgotPassword } from '@/app/api/api';
import { useResetPasswordState } from '@/app/hooks/useResetPassword';

interface stepCheckerProps{
    step:number, 
    setStep:React.Dispatch<React.SetStateAction<number>>
    email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
}
export default function EmailComponent({step,setStep,email,setEmail,}:stepCheckerProps) {
    console.log('pera');
   
    async function sendEmail(Email_param:string) {
        if(Email_param != "" || Email_param.length !=0){
            await ForgotPassword(Email_param);
        }
    }
    
    useEffect(()=>{
        console.log(step);
    },[step])
    
    console.log(email);
    const Router = useRouter();
  return (
    <div className='border-blue-300 border-2 p-3 w-6/12 rounded-md h-fit'>
      <h1 className='font-bebas-neue-regular text-blue-900 font-bold'>Insert your email to Reset password</h1>
      <div className='flex flex-col justify-center items-center h-full'>
      <input type='text' onChange={(e)=>setEmail(e.currentTarget.value)} placeholder='Email' className='border-b-blue-300 text-white placeholder:text-white rounded-md p-2  w-full bg-blue-300 outline-none'></input>
     <button onClick={()=>{sendEmail(email); setStep(2)}}  className='border-blue-900 w-full hover:text-white hover:bg-blue-900 p-2 m-2 cursor-pointer rounded-md flex justify-center items-center bg-white placeholder:text-white outline-none border-2  w-fit '>Sign up </button>

        </div>
        </div>
  )
}


