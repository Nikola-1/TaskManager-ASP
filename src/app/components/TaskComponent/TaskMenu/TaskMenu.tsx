/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Image from "next/image"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { faAngleDown, faAngleRight, faAnglesDown, faCheck, faEdit, faEllipsis, faMarker, faPlus, faSign, faTag, faTicket, faTicketAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useState,useEffect, useMemo } from "react"
import "./TaskMenu.css";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare"
//import { FilterType } from "../Types/FilterType"
import useFilterTasks from "../../../hooks/useFilterTasks"
import { useAuth } from "@/app/context/AuthContext"
import useOptionsMenu from "../../../hooks/useOptionsMenu"
import { OptionsMenu } from "../../OptionsMenu/OptionsMenu"
import { useScope } from "@/app/context/ScopeContext"
const Micro = Micro_5({weight:"400",subsets:['latin'],});
import { deleteCategorie, deleteTag, findCategorie, findTag, getCategories, getTags } from "@/app/api/api"
import { Micro_5 } from "next/font/google";
import toast from "react-hot-toast";

interface TaskMenuProps {
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
   ToggleModal:boolean
   setTaskFilter: React.Dispatch<React.SetStateAction<string>>;
   ToggleModalTag:boolean
   setToggleModalTag: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdate:()=>void;
    onUpdateTag:()=>void,
   categoryId:number | null
    setCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
    tagId:number;
    setTagId: React.Dispatch<React.SetStateAction<number|null>>;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    setFilterImage: React.Dispatch<React.SetStateAction<string>>;
    setSelectedTask: React.Dispatch<React.SetStateAction<object | null>>;
    refreshFlag:boolean;
    refreshFlagTags:boolean;
       SideMenuVisible:boolean;
       setEditListItem:React.Dispatch<React.SetStateAction<object | null>>;
       setMode:React.Dispatch<React.SetStateAction<string | undefined>>;
       Mode:string|undefined;
       setModeTag:React.Dispatch<React.SetStateAction<string | undefined>>;
       ModeTag:string|undefined;
       setSelectedTag:React.Dispatch<React.SetStateAction<object | undefined>>;
       setNameCategory:React.Dispatch<React.SetStateAction<string | undefined>>;
       setNameTag:React.Dispatch<React.SetStateAction<string | undefined>>;
  }
  
export default function TaskMenu({refreshFlag,onUpdateTag, ToggleModal,setToggleModal,setTaskFilter,setFilter,categoryId,setCategoryId,onUpdate,setFilterImage,setSelectedTask,SideMenuVisible,setEditListItem,setMode,Mode,setNameCategory,ToggleModalTag,setToggleModalTag,refreshFlagTags,setModeTag,ModeTag,setSelectedTag,setTagId,tagId }: TaskMenuProps){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories,setCategories] = useState<any[]>([]);
    const [visibleTags,setVisibleTags] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tags,setTags] = useState<any[]>([]);
    //Contexts
    const {user} = useAuth();
    const {groupId,group } = useScope();
    //
    const [X,setX] = useState<number>(0);
    const [Y,setY] = useState<number>(0);
    const [sideMenuHidden,setSideMenuHidden] = useState<boolean>(false);
    const { open, toggleMenu,setOpen, options,id,setId } = useOptionsMenu("task", {
    
    
    Delete:{
        label:"Delete",
        icon:faTrash,
        action:async ()=> {const {message} =await deleteCategorie(id); onUpdate();closeMenu(); toast.success(message); }, 
    },
    Edit:{
        label:"Edit",
        icon:faEdit,
        action:async () => {setToggleModal(true); closeMenu();
            
            const {message,EditedCategorie} = await findCategorie(id);
            
           
                toast.success(message);
                 setMode("Update");
                setNameCategory(EditedCategorie.name);
                setEditListItem(EditedCategorie);
                console.log(EditedCategorie);
            

        }
    }
  });
   const { open:openTag, toggleMenu:toggleMenuTag,setOpen:setOpenTag, options:optionsTag,id:idTag,setId:setIdTag } = useOptionsMenu("Tag", {
    
    
    
    EditTag:{
        label:"Edit",
        icon:faEdit,
        action:async () => {setToggleModalTag(true);
            console.log(idTag);
            const tag= await findTag(idTag);
            
            
              
                 setModeTag("Update");
                 console.log(ModeTag);
                setSelectedTag(tag);
                
            
            
        }
    },
    DeleteTag:{
        label:"Delete tag",
        icon:faTrash,
        action:async ()=> {
            console.log(idTag);
       const { message } = await deleteTag(idTag);

onUpdateTag();
closeMenuTag();
toast.success(message);
        
        }, 
    }
  });
  const closeMenu = ()=> setOpen(false);
    const closeMenuTag = ()=> setOpenTag(false);
    
    
    
     
    const [toggle,setToggle] = useState(true);
    const [menuButtonToggle,setMenuButtonToggle] = useState<number | null>(null);
     const [typeMenuButtonTogle,setTypeMenuButtonToggle] = useState<"Categories" | "Tags">("Categories");
   
      useEffect(() => {
  console.log("KURAC KRUAC KURAC:", refreshFlag);
     
  if (!user?.user.id) return;

  async function loadCategories() {
    try{

   
    const {data} = await getCategories(groupId);
    console.log(groupId);
    setCategories(data);
    console.log(categories);
     }
      catch(err){
                 toast.error((err as Error).message);
             }
  }
  console.log("pera");
  loadCategories();
}, [user?.user.id, groupId, refreshFlag]);


  useEffect(() => {
  if (!user?.user.id) return;

  async function loadTags() {
    try {
      const { data } = await getTags(user.user.id, groupId);
      setTags(data);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  loadTags();
}, [user?.user.id, groupId, refreshFlagTags]);
  
  useEffect(() => {
  console.log("GROUP IZ CONTEXTA:", group);
}, [group]);
  useEffect(()=>{
        if(!SideMenuVisible){
            setSideMenuHidden(false);
        }
  },[SideMenuVisible])
  useEffect(()=>{
    console.log(X,Y);
  },[X,Y])
    return(
        <div onClick={(e) => {
            if(open != true){
                setX(e.clientX);
                      setY(e.clientY);
            }
            }} onTransitionEnd={()=>{
                if(SideMenuVisible){
                    setSideMenuHidden(true)
                }
                
                }} className={`Task-menu relative  border-blue-300 transition-all duration-700 ease-in-out md:border-r-2 md:border-l-2  ${SideMenuVisible ? "right-full w-0 " : "right-0 md:w-1/4"} ${SideMenuVisible ? "" : ""}`} id="TaskMenu">
           
        <div className="task-menu-wrapper   w-full   md:h-screen    ">
        <FontAwesomeIcon icon={faAnglesDown} onClick={()=>{
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            toggle ? setToggle(false) : setToggle(true);
            
            }} className="size-16 md:hidden flex items-center justify-center align-middle m-auto text-white w-full bg-blue-300 "></FontAwesomeIcon>
            <div className={toggle ? "visible flex flex-col" : " hidden md:flex flex-col "}>
            {
               group &&   <div className="p-3 text-center flex flex-col-reverse justify-center items-center bg-blue-500 font-bold text-white"><Image src={"/img/"+group?.image_path+".png"} width={30} height={30}/><h1 className={"text-3xl "+Micro.className}>{group?.name}</h1></div>
            }
           
            <div className="Task-intervals ">
                <ul className="p-3">
                
                    <li onClick={async()=>{
                        setTaskFilter("Today");
                         setCategoryId(null);
                         setTagId(null);
                          setMenuButtonToggle(-2);
                         setSelectedTask(null);
                         
                         setFilterImage("");
                        }} className={menuButtonToggle == -2 ? "flex flex-row justify-between align-middle p-1 bg-blue-300   items-center text-blue-900 transition-all" : "flex flex-row justify-between align-middle p-1    items-center text-blue-900 transition-all"}>
                        <div className="flex flex-row align-middle items-center "><Image src={"/img/october.png"} width={30} height={20} alt="Calendar with number on it"></Image> <p className="m-2">Today</p> </div> <p>3</p>
                    </li>
                    <li onClick={async()=>{
                        setTaskFilter("7Days");
                        setCategoryId(null);
                        setTagId(null);
                         setMenuButtonToggle(-1);
                        setSelectedTask(null);
                         setFilterImage("");
                    }} className={menuButtonToggle == -1 ? "flex flex-row justify-between align-middle p-1 bg-blue-300   items-center text-blue-900 transition-all" : "flex flex-row justify-between align-middle p-1    items-center text-blue-900 transition-all"}>
                        <div className="flex flex-row align-middle items-center"><Image src={"/img/7-days.png"} width={30} height={20} alt="Calendar with number on it"></Image><p className="m-2">7 days</p> </div> <p>3</p>
                    </li>
                    <li className="flex justify-between   p-1   items-center text-blue-900">
                        <div className="flex flex-row align-middle items-center"><Image src={"/img/message-alert.png"} width={30} height={20} alt="Calendar with number on it"></Image><p className="m-2">Inbox</p> </div> <p>3</p>
                    </li>
                    <hr className="border-blue-300 border-t-2 mt-3"></hr>
                </ul>
            
                
            </div>
            <div className="Task-list    ">
                <div className="flex items-center   justify-between ">
                    <div className="flex ">
                <h5 className="text-blue-900 font-bold m-3 p-0.5">List</h5>
                <p className="bg-blue-300 w-fit m-3 p-0.5 text-blue-900 rounded-md">Used: 3/9</p>
                </div>
                <FontAwesomeIcon onClick={()=> {setToggleModal(!ToggleModal);  setMode("Insert");}  } className="pr-3 hover:cursor-pointer text-blue-900" icon={faPlus} width={20} height={20}></FontAwesomeIcon>
                </div>
                <ul className="max-h-[calc(3*3.5rem)]  overflow-y-scroll    p-3 ">
                {categories.map((cat,i)=> <li onClick={async (e)=>{
                    setMenuButtonToggle(i);
                      setCategoryId(cat.id);
                      setTagId(null);
                      setSelectedTag(undefined);
                      setSelectedTask(null);
                      setTypeMenuButtonToggle("Categories");
                        setTaskFilter(cat.name);
                        setFilterImage(cat.sticker.sticker_path);
                    }} key={i} className={menuButtonToggle == i && typeMenuButtonTogle == "Categories" ? " grid-cols-1 group  h-fit background-animation flex transition-all duration-200 flex-row justify-between align-middle p-1 bg-blue-300   items-center text-blue-900" : "flex transition-all duration-200 flex-row justify-between align-middle p-1   items-center text-blue-900"}  >
                        <div className=" group-[]:translate-x-3  transition-all  flex flex-row align-middle items-center ">{cat.sticker?.sticker_path != null ?<img src={"/img/"+cat.sticker?.sticker_path+".png"} width={20} height={10} alt="Calendar with number on it"></img> : <></>} <p className="m-2">{cat.name}</p> </div> <div className="flex align-middle items-center"><p className="p-2">3</p><FontAwesomeIcon onClick={()=>{
                            toggleMenu(); setId(cat.id)}} icon={faEllipsis} className="cursor-pointer"></FontAwesomeIcon></div>
                    </li>)}
                
                </ul>

                
            </div>
            <div className="Task-list ">
                <div className="group flex items-center justify-between cursor-pointer">
                    <div className=" flex justify-center align-middle transition-all"onClick={()=> visibleTags ?  setVisibleTags(false) : setVisibleTags(true)}>
                        
                <h5 className="text-blue-900 font-bold m-3 p-0.5 cursor-pointer" >
                    <FontAwesomeIcon icon={faAngleRight} className={visibleTags ? "rotate-90 transition-all duration-500" : "rotate-0 transition-all duration-500"}></FontAwesomeIcon>Tags</h5>
                            
                </div>
                            <div className="group-hover:visible invisible flex justify-end p-1 text-blue-900">
                            <FontAwesomeIcon className="cursor-pointer"  icon={faEllipsis} width={20}></FontAwesomeIcon>
                            <FontAwesomeIcon className="cursor-pointer" onClick={()=> {setToggleModalTag(!ToggleModal);  setModeTag("Add");}} icon={faPlus} width={20}></FontAwesomeIcon>
                            </div>
                </div>
                <ul className="max-h-[calc(3*2.5rem)]  overflow-y-scroll    p-3 " >
              
                <li  className= {visibleTags ? " background-animation flex transition-all duration-200 flex-col justify-between align-middle    items-center text-blue-900" : "group background-animation flex transition-all duration-200 flex-row justify-between align-middle p-1    items-center text-blue-900 hidden" }    >
                        
                        {tags.map(tag=>
                                tag.parent_id == null ?
                               <div key={tag.id} className="w-full">
                            <div onClick={()=>{setMenuButtonToggle(tag.id);setTypeMenuButtonToggle("Tags"); setCategoryId(null); setTagId(tag.id); setFilter(tag.name); setFilterImage(""); }}  className={`group translate-x-3 w-11/12 justify-between transition-all   flex flex-row align-middle items-center p-1 rounded-md ${menuButtonToggle == tag.id && typeMenuButtonTogle == "Tags" ? "bg-blue-300 " : ""}`}>
                            <div className={"flex flex-row justify-center align-middle items-center"}>
                            <FontAwesomeIcon icon={faTag} width={20} height={10}></FontAwesomeIcon> 
                            <p className="m-2">{tag.name}</p>
                            </div>
                            <div className=" flex items-center justify-center ">
                                     <p className="rounded-full  w-2 h-2" style={{backgroundColor:tag.color}}></p>
                             <p className="group-hover:hidden  px-2 text-md">3</p>
                            <FontAwesomeIcon className="group-hover:block hidden px-2 cursor-pointer" onClick={(e)=>{toggleMenuTag(); setIdTag(tag.id); console.log(idTag);  }} icon={faEllipsis} width={20} height={20}/>
                             </div>
                             
                             </div> 
                             {tags.map(tag2=>
                                tag2.parent_id == tag.id ?
                                
                                <div key={tag2.id} onClick={()=>{setMenuButtonToggle(tag2.id);setTypeMenuButtonToggle("Tags"); setTagId(tag2.id); setFilter(tag2.name); setFilterImage("");}}  className={`group translate-x-3 pl-5 w-11/12 justify-between transition-all   flex flex-row align-middle items-center p-1 rounded-md ${menuButtonToggle == tag2.id && typeMenuButtonTogle == "Tags" ? "bg-blue-300 " : ""}`}>
                            <div className={"flex flex-row justify-center align-middle items-center"}>
                            <FontAwesomeIcon icon={faTag} width={20} height={10}></FontAwesomeIcon> 
                            <p className="m-2">{tag2.name}</p>
                            </div>
                            <div className=" flex items-center justify-center ">
                                     <p className="rounded-full  w-2 h-2" style={{backgroundColor:tag2.color}}></p>
                             <p className="group-hover:hidden  px-2 text-md">3</p>
                            <FontAwesomeIcon className="group-hover:block hidden px-2 cursor-pointer" onClick={(e)=>{toggleMenuTag(); setIdTag(tag2.id); console.log(idTag); }} icon={faEllipsis} width={20} height={20}/>
                             </div>
                             
                             </div> : ""
                             )}
                             </div>
                             : ""
                        )}
                    </li>
                    
                </ul>
                        <hr className="border-blue-300 border-t-2 mt-3 m-3"></hr>
                
            </div>
            </div>
            <div onClick={()=>{
                setTaskFilter("Completed");
                  setCategoryId(null);
                    setTagId(0);
                  setMenuButtonToggle(-3);
                  setSelectedTask(null);
                setFilterImage("");
                
            }} className="p-3 flex justify-start items-center align-middle text-center align-middle hover:cursor-pointer text-blue-900">
      
                <FontAwesomeIcon icon={faCheckSquare} width={20} height={10} className="text-blue-300"/>

                <p className="px-2">Completed</p>
                </div>
                <div onClick={()=>{setTaskFilter("Deleted");  setCategoryId(null); setTagId(null); setFilterImage(""); setMenuButtonToggle(-4);}} className="p-3 flex justify-start items-center align-middle text-center align-middle hover:cursor-pointer text-blue-900">
                <FontAwesomeIcon icon={faTrash} width={20} height={10} className="text-blue-300"/>
                <p className="px-2">Deleted</p>
                </div>
        </div>
        <OptionsMenu open={open} options={options} x={X} y={Y} closeMenu={closeMenu} />
        <OptionsMenu open={openTag} options={optionsTag} x={X} y={Y} closeMenu={closeMenuTag} />
    </div>
    )
}