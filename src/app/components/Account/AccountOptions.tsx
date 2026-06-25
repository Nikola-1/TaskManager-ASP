import React from 'react'

import { UserType } from '../../Types/UserType';

interface AccountOptionsProps {
    user: UserType | null;
    logout: () => void;
    visibleOptions?:boolean;
    setvisibleOptions:React.Dispatch<React.SetStateAction<boolean>>;
}
const AccountOptions = ({logout,visibleOptions,setvisibleOptions}: AccountOptionsProps) => {
    
    


  return (
    <div>
      <ul>
        <li className='p-2 hover:bg-blue-300 hover:text-white rounded-md cursor-pointer' onClick={() => setvisibleOptions(!visibleOptions)}>Profile Settings</li>
        <li className='p-2 hover:bg-blue-300 hover:text-white rounded-md cursor-pointer'>Privacy Settings</li>
        <li className='p-2 hover:bg-blue-300 hover:text-white rounded-md cursor-pointer' onClick={() => logout()}>Logout</li>    
      </ul>
    </div>
  )
}

export default AccountOptions

