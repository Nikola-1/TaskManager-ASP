'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'
import next from "../../../../public/img/next.png";
import { useResetPasswordState } from '@/app/hooks/useResetPassword';
export default function Reset(){
   
   const Router = useRouter();
   const {email,newPassword,setNewPassword} = useResetPasswordState();
   console.log(email);
    return(
     <div className='flex justify-center items-center h-screen w-full relative'>
        <button onClick={()=>Router.push("/pages/resetPassword")}  className='border-blue-900 p-3 m-2  cursor-pointer rounded-md absolute top-0 left-0 rotate-180 bg-blue-900 placeholder:text-white outline-none border-2 w-fit'><Image src={next} alt="clock image"  width={40} height={40}  /></button>
      <div className='border-blue-300 border-2 p-3 w-6/12 rounded-md h-fit'>
      <h1 className='font-bebas-neue-regular text-blue-900 font-bold'>Insert your email to Reset password</h1>
      <div className='flex flex-col justify-center items-center h-full'>
      <input type='password'  placeholder='password' className='border-b-blue-300 text-white placeholder:text-white rounded-md p-2  w-full bg-blue-300 outline-none'></input>
      
     <button   className='border-blue-900 w-full hover:text-white hover:bg-blue-900 p-2 m-2 cursor-pointer rounded-md flex justify-center items-center bg-white placeholder:text-white outline-none border-2  w-fit '>Sign up </button>

        </div>
        </div>

        
    </div>
   )
}
