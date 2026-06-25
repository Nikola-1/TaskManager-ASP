"use client";
import { createContext,useContext,useState,ReactNode, useEffect } from 'react'
import { UserType } from '../Types/UserType';
import { useRouter,usePathname } from 'next/navigation';

interface AuthContextType {
    user:UserType | null;
    setUser: (user:UserType | null)=> void;
    loggedIn: boolean;
    logout: () => void;
    setLoggedIn:(loggedIn:boolean) => void;
    DisplayTasks:boolean;
     setDisplayTasks:(DisplayTasks:boolean) => void;
     loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children:ReactNode}){
    const [user,setUser] = useState<UserType|null>(null);
    const [loggedIn,setLoggedIn] = useState(false);
    const [loading,setLoading] = useState(true);
    const [DisplayTasks,setDisplayTasks] = useState(false);
    const router = useRouter();
    const pathName=usePathname();
     const logout = async () => {
       if(pathName=="/pages/resetPassword"){
        router.push("/pages/resetPassword");
       }
    
    await router.push("/login");
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
 
  };
 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (storedUser && token) {
    setUser(JSON.parse(storedUser));
    setLoggedIn(true);
  } else {
    setUser(null);
    setLoggedIn(false);
  }

  setLoading(false);
}, []);
console.log(pathName);
 

  return (
    <AuthContext.Provider value = {{user,loading, setUser,loggedIn,setLoggedIn,DisplayTasks,setDisplayTasks,logout}}>
            {children}
        </AuthContext.Provider>
  )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth mora biti koriscen unutar AuthProvider-a");
    return context;
}

