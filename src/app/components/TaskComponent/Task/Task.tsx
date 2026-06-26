import { supabase } from '@/app/connection/supabaseclient';
//import React, {  useEffect, useState } from 'react'
import { Editor } from '@tiptap/core';
import TaskCategoryImage from '../TaskDisplay/TaskCategoryImage';
import { faCheckSquare, faClose, faDotCircle, faDownload, faEllipsis, faFile, faFileAlt, faFlag, faNoteSticky, faSquareCheck, faTag, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TaskType } from '../../../Types/TaskType';
import useOptionsMenu from '../../../hooks/useOptionsMenu';
import { OptionsMenu } from '../../OptionsMenu/OptionsMenu';
import {  useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useScope } from '@/app/context/ScopeContext';
import { AddFile, CreateTagTaskConnection, deleteOneDeleted, deleteTagTaskConnection, deleteTask, downloadAttachment, getTags, getTasks, updateStatus } from '@/app/api/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useGroupState from '@/app/hooks/useGroupState';
export interface TaskProps {
  task: TaskType;
  selectedTask: TaskType | null;
  refreshFlag:boolean;
  filter: string;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskType | null>>;
  refreshTasks: () => Promise<void>;
  editor: Editor;
  
}
export default function Task({ task, filter, setSelectedTask, selectedTask, refreshTasks,refreshFlag }: TaskProps) {

  const { group} = useScope();

 
 
  
 

  const fileInput = useRef<HTMLInputElement>(null);
   const {user} = useAuth();
   const [tags,setTags] = useState<object[]>([]);
   
  const { open, toggleMenu,setOpen, options } = useOptionsMenu("", {
     
      complete:{
                label:task.completed ? "Remove completed" : "Mark as complete",
                icon:faCheckSquare,
                action:async ()=>{await updateStatus(task.id);await refreshTasks()}
            },
             Tag:{
                label:"Add tag",
                icon:faTag,
                action:async()=>{setOpenMenuTag2(true);console.log(group);console.log(user?.user.id); const dataTagsMenu = await getTags(user?.user.id,group?.id)
                if(dataTagsMenu) setTags(dataTagsMenu.data);
                console.log(tags);
               }
            },
             Prioirity:{
                label:"Set priority",
                icon:faFlag,
                action:()=>{console.log("mark")}
            },
            File:{
                label:task.file_name != null ? "Change file" : "Add file",
                icon:faFile,
                action:async ()=>{
                 
                  
                  fileInput.current.onchange = async (e) => {
                    
      const file = e.target.files[0];
      if (!file) {
        console.log("Korisnik zatvorio File Explorer bez izbora fajla");
        return;
      }
      
                  
                    
                  

                    try{
                   const {data,error} = await AddFile(task.id,file);
                   toast.success("File successfully added");
                     refreshTasks();
                   }
                   catch(err){
                    console.log(err);
                   }
                 
                  // const {data2,error2} = await supabase.from("tasks").update({folder_name:`user-${user?.id}`}).eq("id",task.id).eq("user_id",user?.id);
                  // const {data3,error3} = await supabase.from("tasks").update({file_name:file.name}).eq("id",task.id).eq("user_id",user?.id);
    }
    fileInput.current?.click();
                  
                  }
                  
            },
             ...(filter === "Completed" && {
       undo: {
      label: "Undo complete",
      icon: faSquareCheck,
      action: async()=>{await supabase.from("tasks").update({Completed: "FALSE"}).eq("id",task.id); refreshTasks()}
    }
  })
      
    });
    const {open:openMenu2,toggleMenu:toggleMenuTag2,setOpen:setOpenMenuTag2,options:optionsTag2,id:idTag2,setId:setIdTag2} = useOptionsMenu("tag",{
      ...(tags.map((tag:any) => ({
        [`tag-${tag.id}`]:{
          label:task.tags?.some((t:any) => t.id === tag.id) ? `✔  ${tag.name}` : `${tag.name}`,
          icon:faTag,
          action:async()=>{
            console.log(`Adding tag ${tag.name} to task ${task.id}`);
            if(task.tags?.some((t:any) => t.id === tag.id)){
              await deleteTagTaskConnection(tag.id,task.id);
              
             
                console.log("Tag removed from task");
                refreshTasks();
                ClosemenuTag2();
              
              return;
            }
            else{
               await  CreateTagTaskConnection(task.id,tag.id)
              
                console.log("Tag added to task");
                 refreshTasks();
                ClosemenuTag2();
              

            }
          }
        }
      }))
      ).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    });
  function DateExpression(item: any) {
    switch (new Date(item).getDate() - new Date().getDate()) {
      case 0: return "Today";
      case 1: return "Tomorrow";
      default: return `${new Date(item).toLocaleDateString("sr-RS")}`;
    }
  }
  const [X,setX] = useState<number>(0);
    const [Y,setY] = useState<number>(0);
  
 const DeleteData = async (id:number)=>{
        
        const { error } = await supabase.from("tasks").update({Deleted:"TRUE"}).eq("id", id);
  if (!error) {
    setSelectedTask(null);
    refreshTasks(); // <<< ovo pokreće ponovni fetch iz hooka
  } else {
    console.error("Delete failed:", error.message);
  }
  
    }
    const closeMenu = ()=> setOpen(false);
    const ClosemenuTag2 = ()=> setOpenMenuTag2(false);
   useEffect(() => {
            
             

             
           }, [refreshFlag]);

           useEffect(()=>{
            console.log(task);
            console.log(group)
            console.log("GroupId in Task component:", group?.id);
           },[group?.id])
  return (
    <div
      
      className={`group flex items-center m-2 `}
    >
      <div onClick={() => {
        if (selectedTask === task) return;
        setSelectedTask(task); 
        
      }} className={` flex justify-between w-full items-center text-blue-900 transition-all p-3 cursor-pointer ${
        selectedTask === task ? "bg-blue-400 rounded-md" : "hover:bg-blue-300 rounded-md"
      } ${task.completed == true ? `opacity-50 bg-blue-300` : ``}`}>
      <div className={`flex items-center align-top ${user?.display == false ? "" : "p-5 "}`}>
        {/*filter == "Completed" ?  <input checked={task.Completed}  type="checkbox" className="m-1" onChange={() => updateStatus(task.id)} /> :  <input  type="checkbox" className="m-1" onChange={() => updateStatus(task.id)} />*/}
        
        <div className='flex flex-col'>
          <div className='flex'>
            <div className='flex'>
            <input checked={task.completed}  type="checkbox" className="m-1" onChange={async() => {await updateStatus(task.id); await refreshTasks()}} />
        <p>{task.name}</p>
        </div>
        
         {task.category_id ? <img src={`/img/${task.sticker_path}.png`} width={20} height={20}></img> : null}
         </div>
         <div className='flex max-w-64 overflow-x-scroll scrollbar-hide touch-pan-x'>
         {task.attachments.length != 0 ? task.attachments.map((x)=>
         
            <div key={x.id} className='flex  '>
         <p className='p-2'></p>
         <p className='bg-teal-900 text-white text-xs rounded-md p-1'>{x.fileName}</p> 
           <p className='bg-blue-800 text-white text-xs rounded-md p-1 mx-1'><button onClick={async (e) => {
    e.stopPropagation();

    const blob = await downloadAttachment(task.id, x.id);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = x.fileName;
    a.click();

    URL.revokeObjectURL(url);
  }}><FontAwesomeIcon  icon={faDownload}/></button></p> 
        </div>
        )
         
         : ""} 
         </div>
         <div className='flex items-start justify-start'>
        {task.tags?.map((tag: any) => <p className={`m-1  text-white p-1 text-sm rounded-md w-fit`} style={tag.color ? { backgroundColor:tag.color} : { backgroundColor:"#4463BD"}} key={tag.id}>{tag.name}</p>)}
        </div>
        </div>
       
       
      </div>
      <div className='flex items-center'>
      <div className="flex items-center">
        
        <p className={`mx-2 ${task.date < new Date().toISOString().split("T")[0] ? "text-red-700" : ""}`}>{task.date ? DateExpression(task.date) : "no date"}</p>
        <FontAwesomeIcon
          icon={filter !== "Deleted" ? faClose : faTrashAlt}
          onClick={filter !== "Deleted" ? async() => {
            try{
             const {message}= await deleteTask(task.id);
             toast.success(message);
              refreshTasks();
            }
            catch(err){
                  toast.error((err as Error).message);
            }
              
          }
          :
          async() =>
          {
              try{
             const {message}= await deleteOneDeleted(task.id);
             toast.success(message);
              refreshTasks();
            }
            catch(err){
                  toast.error((err as Error).message);
            }
          }
            
            
             
              
          }
          className="cursor-pointer mx-2"
        />
        
      </div>
      </div>
      </div>
      <FontAwesomeIcon
          icon={faEllipsis}
          onClick={(e)=>{

          toggleMenu()
            setX(e.clientX);
        setY(e.clientY);
          }
            }
          className="cursor-pointer invisible  group-hover:visible m-1 size-3"
           
        />
         <input type='file' ref={fileInput} className="hidden " />
        <OptionsMenu open={open} options={options} x={X} y={Y} closeMenu={closeMenu} />
        <OptionsMenu open={openMenu2} options={optionsTag2} x={X+150} y={Y+50} closeMenu={ClosemenuTag2} />
    </div>
  );
}

