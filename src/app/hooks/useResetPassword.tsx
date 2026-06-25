import { useState } from "react"

export function useResetPasswordState() {
        const [email,setEmail] = useState<string>("")
        const [newPassword,setNewPassword] = useState<string>("");

        const 
    
    return{
        email,setEmail,newPassword,setNewPassword
    }
}