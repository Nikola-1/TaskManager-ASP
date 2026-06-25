import { useState } from "react";

export default function useStepChecker(){}

export  function useStepCheckerState(){
    
    const [step,setStep] = useState<number>(1);
    const stepCheckerProps ={
    step:step,
    setStep:setStep
    
}

        return stepCheckerProps


}
