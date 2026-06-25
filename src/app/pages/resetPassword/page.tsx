'use client'
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useState } from 'react'
import next from "../../../../public/img/next.png";
import { useRouter } from 'next/navigation';
import { ForgotPassword } from '@/app/api/api';
import { useResetPasswordState } from '@/app/hooks/useResetPassword';
import EmailComponent from '@/app/components/resetPassword/EmailComponent';
import PasswordComponent from '@/app/components/resetPassword/PasswordComponent';
import CodeComponent from '@/app/components/resetPassword/CodeComponent';
import useStepChecker, { useStepCheckerState } from '@/app/hooks/useStepCheckerState';
export default function ResetPasswordPage() {
    console.log('pera');
      const Router = useRouter();
    async function sendEmail(Email_param:string) {
        if(Email_param != "" || Email_param.length !=0){
            await ForgotPassword(Email_param);
        }
    }
   
    const resetPassword = useResetPasswordState();
    const stepCheckerProps = useStepCheckerState();
    const {step,setStep} = stepCheckerProps
  return (
    <div className='flex justify-center items-center h-screen w-full relative'>
        <button onClick={()=>Router.push("/pages")}  className='border-blue-900 p-3 m-2  cursor-pointer rounded-md absolute top-0 left-0 rotate-180 bg-blue-900 placeholder:text-white outline-none border-2 w-fit'><Image src={next} alt="clock image"  width={40} height={40}  /></button>
      {
        step == 1 && (<EmailComponent {...stepCheckerProps} {...resetPassword} />)
        
       
      }
      {
        step == 2 && (<CodeComponent {...stepCheckerProps} {...resetPassword} />)
        
       
      }
      {
        step == 3 && (<PasswordComponent {...stepCheckerProps} {...resetPassword} />)
        
       
      }

        
    </div>
  )
}


