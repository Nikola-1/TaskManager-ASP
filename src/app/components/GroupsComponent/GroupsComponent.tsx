'use client'
import { deleteGroup, getAllGroups } from '@/app/api/api';

import { useAuth } from '@/app/context/AuthContext';

import { GroupType } from '@/app/Types/GroupType';

import { useRouter } from 'next/navigation';

import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
interface GroupStateProps{
                EditOn:boolean,
                setEditOn:React.Dispatch<React.SetStateAction<boolean>>;
                Group:GroupType,
                setGroup:React.Dispatch<React.SetStateAction<GroupType>>;
                AddUserOn:boolean,
                setAddUserOn:React.Dispatch<React.SetStateAction<boolean>>;
                DeleteOn:boolean,
                setDeleteOn:React.Dispatch<React.SetStateAction<boolean>>;
}
interface GroupsModalProps{
    setActiveGroup:React.Dispatch<React.SetStateAction<boolean>>;
    isActiveGroup:boolean
    onUpdate: ()=>void;
    setTaskFilter:React.Dispatch<React.SetStateAction<string>>;
    setFilterImage:React.Dispatch<React.SetStateAction<string>>;
    editListItem:object | null;
    setEditListItem:React.Dispatch<React.SetStateAction<object | null>>;
    Mode:string | undefined;
    nameCategory:string | undefined;
    setnameCategory:React.Dispatch<React.SetStateAction<string | undefined>>;
     isActiveUser:boolean,
    setActiveUser:React.Dispatch<React.SetStateAction<boolean>>;
    refreshFlagGroups:()=>void
}
type GroupsModalAllProps = GroupsModalProps & GroupStateProps;
const GroupsComponent = ({Group,Mode,DeleteOn,setGroup,EditOn,setActiveGroup,setEditOn,setAddUserOn,refreshFlagGroups,AddUserOn,setActiveUser}:GroupsModalAllProps) => {
    const [groups,setGroups] =React.useState<object[]>([]);
    const router = useRouter()
    const {user} =useAuth();
    const getGroups = async () => {
            const groupsData = await getAllGroups();
            
             
            console.log(groupsData);
             setGroups(groupsData);
            

    }
    
    useEffect(()=>{
        getGroups();
        
    },[refreshFlagGroups])
     
   
     
     useEffect(()=>{
        console.log(EditOn);
    },[EditOn])
  return (

   
    <div>
        {groups.map((group:any)=>(
            <div onClick={async()=>{
                if(!EditOn && !AddUserOn && !DeleteOn){
                         router.push(`/pages/Task/${group.id}`); 
                }
                else{
                        
                          if(EditOn){
                            setGroup(group);
                                 setActiveGroup(true);
                                 setAddUserOn(false);
                          }
                         if(AddUserOn){
                            setGroup(group);
                                setActiveUser(true);
                                   setEditOn(false);
                         }
                         if(DeleteOn){
                            console.log(Group);
                                await deleteGroup(group?.id);
                                refreshFlagGroups();
                                toast.success(`Successfully removed Group ${group?.name}`)
                         }
                         
                         
                }
                
               
                
                }} key={group.id} className={'border p-4 m-4 rounded  cursor-pointer relative ' }>
                <div className='w-full h-4'></div>
                {EditOn && <p className='absolute top-0 right-0  w-fit px-2 bg-blue-600 text-white text-center'>Edit</p>}
                {AddUserOn && Mode == "Insert" && <p className='absolute top-0 right-0  w-fit px-2 bg-blue-600 text-white text-center'>Add User</p>}
                   {AddUserOn && Mode == "Delete" && <p className='absolute top-0 right-0  w-fit px-2 bg-blue-600 text-white text-center'>Remove User</p>}
                    {DeleteOn && Mode == "Delete" && <p className='absolute top-0 right-0  w-fit px-2 bg-red-600 text-white text-center'>Delete</p>}
                <h2 className='text-xl font-bold mb-2'>{group.name}</h2>
                
                <p>{group.memberCount || 0} members</p>
                <p className=' top-0 right-0  w-fit px-2 bg-green-600 text-white text-center'>New message</p>
            </div>
        ))}
   
    </div>
  )
}

export default GroupsComponent
