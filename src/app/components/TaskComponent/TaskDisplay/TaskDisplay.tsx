/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
 'use client'
 import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar,  faEllipsis, faLeftLong ,faPlus,faArrowDown } from "@fortawesome/free-solid-svg-icons";

import Placeholder from '@tiptap/extension-placeholder'
import React, {  useEffect, useReducer, useState } from "react";

import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Document from '@tiptap/extension-document'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from "@tiptap/extension-list-item";
import TaskCategoryImage from "./TaskCategoryImage";
import  {TextStyle,FontFamily}  from '@tiptap/extension-text-style'
import Task from "../Task/Task";

import { TaskType } from "../../../Types/TaskType";


import { OptionsMenu } from "../../OptionsMenu/OptionsMenu";

import { useTaskDisplay } from "@/app/hooks/useTaskDisplay";
import TaskEditorPanel from "./TaskEditorPanel";
import { createTask, getTasks, updateTaskContent } from "@/app/api/api";
import useFilterTasks from "@/app/hooks/useFilterTasks";
import { useScope } from "@/app/context/ScopeContext";
import toast from "react-hot-toast";


interface TaskDisplayProps {
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;

   ToggleModal:boolean;
    fullDate: Date | null;
   setFullDate:React.Dispatch<React.SetStateAction<Date | null>>;
   tasksArray:TaskType[];
   setTasksProp: React.Dispatch<React.SetStateAction<any[]>>
   refreshTasks: ()=> Promise<void>
   filter: string
   filterImage:string
   categoryId:number;
   tagId:number;
   refreshFlag:boolean;
   setSelectedTaskProp: React.Dispatch<React.SetStateAction<TaskType | null>>
   selectedTaskProp:TaskType | null
   
  
   setSideMenuVisible:React.Dispatch<React.SetStateAction<boolean>>
   SideMenuVisible:boolean;
   tagsDisplayProps:object[];
  }
export default function TaskDisplay({
  setToggleModal,
  fullDate,
  setFullDate,
  tasksArray,

  setTasksProp,
  refreshTasks,
  filter,
  filterImage,
  refreshFlag,
  categoryId,
  tagId,
  setSelectedTaskProp,
  selectedTaskProp,
  SideMenuVisible,
  setSideMenuVisible,
  tagsDisplayProps
}:TaskDisplayProps){
  
     
   
    const {
  user,
  inputValue,
  handleChange,
  addTask,
  deleteDeleted,
  handleOpenModal,
  open,
  setOpen,
  options,
  x,
  y,
  openOptionsMenu,
} = useTaskDisplay({
  fullDate,
  tasksArray,

  refreshTasks,
  refreshFlag,
  categoryId,
  tagId,
  setToggleModal,
  setSelectedTaskProp,
});
   const {group} = useScope();
  const [tasksTest,setTasksTest] = useState<TaskType[]>([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        
          const data = group?.id != null ? await getTasks(group?.id) :await getTasks(null);
       
         
       
        console.log(data.data);
        setTasksTest(data.data)
        
      } catch (error) {
        console.error(error);
      }
    };
   
    fetchTasks();
  
  }, [group?.id]);
     const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      OrderedList,
      ListItem,
      Document,
      Placeholder.configure({
        placeholder: "Write something awesome..."
      }),
      FontFamily
    ],
    content: selectedTaskProp != null ? `${selectedTaskProp.content}` : `${Placeholder}`,
      immediatelyRender: false
    
  })
   
useEffect(() => {
  if (!editor || !selectedTaskProp) return;
  
  const currentHTML = editor.getHTML();
  if (currentHTML !== selectedTaskProp.content) {
    editor.commands.setContent(selectedTaskProp.content || "");
  }
}, [selectedTaskProp?.id]);

 
 
  const saveContent = async(id:number)=>{
      const html = editor?.getHTML() || "";

      
      
      const updatedTask = await updateTaskContent(id,html);
     
  
      
  
    console.log("Uspeh")
  
    refreshTasks();
     setSelectedTaskProp(updatedTask);
      
      
    
     
     
        
    

   
    return;
  
  }
   
   
    
    
   
    




    
       
 
    useEffect(()=>{
      console.log(user);
      
         refreshTasks();
           console.log(tasksArray);
    },[])
    

    
    
        function DateExpression(item: any){
       
            switch(new Date(item).getDate() - new Date().getDate() ){
                case 0: return "Today";
                case 1: return "Tomorrow";
            
                default: return `${ new Date(item).toLocaleDateString("sr-RS")}`;
              
            }
          
        }
         const [, forceUpdate] = useReducer(x=>x+1,0);
          useEffect(()=>{
            if(!editor) return;

            const rerender = () => forceUpdate();
            editor.on('selectionUpdate',rerender);
            editor.on('transaction',rerender);

            return ()=>{
              editor.off('selectionUpdate',rerender);
              editor.off('transaction',rerender);
            }
          }, [editor])
          
            useEffect(() => {
           
             refreshTasks();
            
             
           }, [refreshFlag]);

          if (!editor) return null;
     
         
    return(
        
        <div className="w-full flex h-full   ">
            
            <div  className={`task-list h-full relative w-full md:w-2/4 md:border-r-2  flex flex-col transition-all duration-700 ease-in-out ${SideMenuVisible ? "right-1" : ""}`}>
            <div className="flex justify-between h-fit items-center p-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faLeftLong} onClick={()=>setSideMenuVisible(!SideMenuVisible)} className={`transition-all cursor-pointer ${SideMenuVisible ? "rotate-180 " : "rotate-0 transition-all"}`}/>
                
                    <h3 className="pr-3 pl-3 flex align-middle items-center ">{filter}{ filterImage == "" ? <p></p> : <img width={20} height={20} className="mx-2" src={"/img/"+filterImage+".png"}/>}</h3>
                    </div>
                    <FontAwesomeIcon
  className="cursor-pointer text-2xl"
  icon={faEllipsis}
  onClick={openOptionsMenu}
/>
                    </div>
                    <div className="relative flex justify-between text-white items-center m-3 p-1 bg-blue-300  rounded-md z-0 group">
                       
         
                        <input
  className="absolute z-20 bg-transparent outline-none group-focus-within:outline-none placeholder-white"
  value={inputValue}
  onChange={handleChange}
  onKeyDown={async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      console.log("USER",user);
      console.log("TAG!!!",tagId);
      try{
    const {message} =  await createTask(inputValue,"",fullDate?.toISOString().split('T')[0],categoryId,user?.user.id,tagId,group?.id);
      toast.success(message);
      refreshTasks();
  }
        catch(err){
            toast.error((err as Error).message);
        }
      
    }
  }}
 
/>
                       
                      
                        <div className="flex  items-center z-10 group-focus-within:invisible">   
                            <FontAwesomeIcon className={ inputValue == "" || inputValue == " " ? "" : "hidden"} icon={faPlus} height={15} width={15} ></FontAwesomeIcon>
                            <p  className="m-1">{inputValue == "" || inputValue == " " ? "Add task" : ""}</p>
                        </div>
                             <div className="flex  items-center">
                                <p>{fullDate != new Date() && fullDate != null ? new Date(fullDate.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString("sr-RS"): ""}</p>
                                <FontAwesomeIcon className="m-1" onClick={handleOpenModal} icon={faCalendar} width={15} height={15}>
                                    </FontAwesomeIcon><FontAwesomeIcon icon={faArrowDown} width={15} height={15}></FontAwesomeIcon>
                        </div>
                        
                    </div>
                    
                    {filter == "Deleted" ?  <div className="flex justify-center  mx-auto m-3 w-9/12 h-fit bg-blue-400 font-bold text-white rounded-md cursor-pointer" onClick={deleteDeleted}>Delete</div> : <></>}
                    

                 <div className={user?.display == 1  ? "grid grid-cols-2 overflow-y-scroll" : " overflow-y-scroll h-96"}>
                    {
                      
                        tasksArray.length != 0 ?
                    tasksArray?.map((item)=>( 
                 <Task
  key={item.id}
  task={item}
  
  selectedTask={selectedTaskProp}
  refreshFlag={refreshFlag}
  setSelectedTask={setSelectedTaskProp}
  refreshTasks={refreshTasks}
  filter={filter}
  editor={editor}
/>
                )): <div className="flex justify-center align-middle items-center m-auto"><p className="flex justify-center align-middle items-center font-bold text-blue-900 ">No Tasks </p></div>
                }
                {tasksTest.map((x)=>(<h1 key={x.id}>{x.title}</h1>))}
                 </div>
            </div> 
                
         {selectedTaskProp && (
            <TaskEditorPanel
    editor={editor}
    taskId={selectedTaskProp.id}
    onSave={saveContent}
  />
         )}
            
            
           <OptionsMenu
  options={options}
  open={open}
  closeMenu={() => setOpen(!open)}
  x={x}
  y={y}
/>
        </div>
        
    )
} 