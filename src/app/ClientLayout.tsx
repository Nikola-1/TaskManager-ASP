"use client";


import Nav from "./components/fixed/nav";
import LoginComponent from "./components/Login/LoginComponent";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from 'react-hot-toast';
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [User,setUser] = useState<object>();
  useEffect(() => {
    // primer: proveri localStorage ili Supabase auth
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
    console.log(User);
    }, []);
    const pathName = usePathname();
  if (!loggedIn && pathName!="/pages/resetPassword" && pathName!="/pages/reset") {
    
    return (
      <>
        <Toaster position="top-right" />
       <LoginComponent setLoginProps={setLoggedIn} setUserProps={setUser}  />
       </>
    )
   
  }

  return (
    <> <Toaster position="top-right" />
    <div className="flex md:flex-row flex-col justify-center md:justify-start w-dvw">
      {
       pathName != "/pages/resetPassword" && pathName!="/pages/reset" ? <Nav /> :  <></>
      }
     
      
      {children}
    </div>
    </>
  );
}

