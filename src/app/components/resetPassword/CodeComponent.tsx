'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import next from "../../../../public/img/next.png";
import { useResetPasswordState } from '@/app/hooks/useResetPassword';
import useStepChecker, { useStepCheckerState } from '@/app/hooks/useStepCheckerState';
import { ResetPassword } from '@/app/api/api';
interface stepCheckerProps{
    step:number, 
    setStep:React.Dispatch<React.SetStateAction<number>>
    email: string;
      setEmail: React.Dispatch<React.SetStateAction<string>>;
      newPassword: string;
      setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    
}
export default function CodeComponent({step,setStep,email,setEmail,newPassword,setNewPassword}:stepCheckerProps){
   const [code,setCode] = useState<string>("");
   
   useEffect(()=>{
        console.log(step);
        console.log(email)
   },[step])
   const Router = useRouter();
   
   async function  updatePassword(code_param:string) {
         const data=   await ResetPassword(email,newPassword,code_param);
            setStep(3);
            console.log(data);
   }
   
    return(
     <div className='flex justify-center items-center h-screen w-full relative'>
        <button onClick={()=>setStep(1)}  className='border-blue-900 p-3 m-2  cursor-pointer rounded-md absolute top-0 left-0 rotate-180 bg-blue-900 placeholder:text-white outline-none border-2 w-fit'><Image src={next} alt="clock image"  width={40} height={40}  /></button>
      <div className='border-blue-300 border-2 p-3 w-6/12 rounded-md h-fit'>
      <h1 className='font-bebas-neue-regular text-blue-900 font-bold'>Insert the code you recieved</h1>
      <div className='flex flex-col justify-center items-center h-full'>
      <input type='password' onChange={(e)=>setCode(e.currentTarget.value)}  placeholder='code' className='border-b-blue-300 text-white m-2 placeholder:text-white rounded-md p-2  w-full bg-blue-300 outline-none'></input>
      <input type='password' onChange={(e)=>setNewPassword(e.currentTarget.value)}  placeholder='New Password' className='border-b-blue-300 text-white m-2 placeholder:text-white rounded-md p-2  w-full bg-blue-300 outline-none'></input>
     <button onClick={()=>{updatePassword(code)}}  className='border-blue-900 w-full hover:text-white hover:bg-blue-900 p-2 m-2 cursor-pointer rounded-md flex justify-center items-center bg-white placeholder:text-white outline-none border-2  w-fit '>Enter code </button>

        </div>
        </div>

        
    </div>
   )
}
