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
   
    
        return(
            <h1>{email}</h1>
        )
}