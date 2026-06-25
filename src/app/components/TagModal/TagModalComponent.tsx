import { editTag, getTags, postTag } from '@/app/api/api';
import { supabase } from '@/app/connection/supabaseclient';
import { useAuth } from '@/app/context/AuthContext';
import { useScope } from '@/app/context/ScopeContext';
import { BackgroundColor } from '@tiptap/extension-text-style';
import { group } from 'console';
import React, { act, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
interface TagModalProps{
    isActive:boolean;
    setActive:React.Dispatch<React.SetStateAction<boolean>>;
    Mode:string | undefined;
      onUpdate: ()=>void;
    selectedTag:object | null;
    setSelectedTag:React.Dispatch<React.SetStateAction<object | null>>;
}
const TagModalComponent = ({isActive,setActive,onUpdate,Mode,selectedTag,setSelectedTag}:TagModalProps) => {
    const [name,setName] = useState<string>();
    const [color,setColor] = useState<string | null>(null);
    const [parentTag,setParentTag] = useState<number | null>(null);
    const [activeColor,setActiveColor] = useState<number>(0);
    const [hasChildren,setHasChildren] = useState<boolean>(false);
    const [tags,setTags] = useState<any[]>();
    const [x,setX]= useState<number>();
    const [y,setY] = useState<number>();
   
    const ColorInput = useRef<HTMLDivElement>(null); 
    const {user} = useAuth();
    const {groupId} = useScope();
    const getTag=async()=>{
        let data,error;
        if(groupId != null){
            ({data, error} = await supabase.from("Tags").select("*").eq("id",selectedTag?.id).eq("group_id",groupId).single());
        }
        else{
            ({data, error} = await supabase.from("Tags").select("*").eq("id",selectedTag?.id).single());
        }
            
            if(error){
                console.log(error);
            }
            else{
                    setName(selectedTag?.name);
                    console.log(selectedTag);
            }
    }
    const AddTag = async () =>{
        console.log(user);
       
        let data,error;
        
        const{message,postedTag} =  await postTag(color,name,user?.user.id,parentTag,groupId);
        
        

            toast.success(message);
        
            setActive(false);
            onUpdate();
        
    }
    const UpdateTag = async () =>{
        
      const {message}=  await editTag(selectedTag?.id,name,color,parentTag);
            toast.success(message);
          
            setActive(false);
            onUpdate();
        
    }
    
    const NoChild = async () =>{
        const {data,error } = await supabase.from("Tags").select("*").eq("parent_id",selectedTag?.id);

        if(error){
            console.log(error);
        }
        else{
            if(data.length > 0){
                    setHasChildren(true);
            }
           else{
            setHasChildren(false);
           }
        }
    }
    const ChangePositionColorInput =(e)=>{
            ColorInput.current?.click();
           
            setX(e.clientX);
            setY(e.clientY);
            console.log(x,y);
            console.log(ColorInput);
    }
    const handleClick = async (e)=>{
        let id = 0;
         let colorCode = null;
        if(e.currentTarget.dataset.colorId != activeColor){
            id = e.currentTarget.dataset.colorId;
            colorCode = e.currentTarget.dataset.colorCode;
        }
        
       
   
        setActiveColor(id);
        setColor(colorCode);
        console.log(color);
    }

   useEffect(()=>{
    const getTagsForParent = async()=>{
            try{
                     const {data}= await getTags(user?.user.id,groupId);
       setTags(data)
       console.log(tags);
            }
            catch(err){
                console.log(err);
            }
    }
    getTagsForParent();
   },[isActive])
   useEffect(()=>{
   
    NoChild();
    setName(selectedTag?.name);
    setColor(selectedTag?.color);
   },[selectedTag])
   
  return (
    <div className={isActive == true ? "flex absolute w-2/12 right-2/4 top-2/4  shadow-md rounded-md bg-white  bottom-2/4 m-auto h-1/4  " : " hidden"} >
            <div className=" inset-0 flex items-center align-middle relative justify-center w-full">
                <div className="flex  justify-between w-full h-full relative">
            <div className="flex flex-col p-3 relative  xl:w-full ">
                <h3>Add Tag</h3>
                <div className="flex flex-col w-full">
                    <div className="flex w-full">
                    
                    <input value={name ?? ""} onChange={e=>setName(e.currentTarget.value)} type="text" className=" border-blue-300 border-2 rounded-md  outline-none indent-1  w-full"></input>
                    </div>
                    <div className="relative">
                  
                    </div>
                </div>
               
                <div className="flex w-max items-center align-middle my-1">
                    <p>Color</p>
                    <div className='flex'>
                        <p data-color-id={1} data-color-code={"#991b1b"} className={`rounded-full w-6 h-6 bg-red-800 m-1 p-3 hover:border-blue-400 border-2 transition-all cursor-pointer ${activeColor == 1 || (Mode == "Update" && selectedTag?.color== "#991b1b")  ? `border-blue-400` : ``}`} onClick={handleClick}  ></p>
                           <p data-color-id={2} data-color-code={"#3730a3"} className={`rounded-full w-6 h-6 bg-indigo-800  p-3 m-1 hover:border-blue-400 border-2 transition-all cursor-pointer ${activeColor == 2 || (Mode == "Update" && selectedTag?.color== "#3730a3")  ? `border-blue-400` : ``}` } onClick={handleClick} ></p>
                                <p data-color-id={3} data-color-code={"#9a3412"} className={`rounded-full w-6 h-6 bg-orange-800  p-3 m-1 hover:border-blue-400 border-2 transition-all cursor-pointer ${activeColor == 3 || (Mode == "Update" && selectedTag?.color== "#9a3412") ? `border-blue-400` : ``}`} onClick={handleClick} ></p>
                                  <p data-color-id={4} data-color-code={"#1e40af"} className={`rounded-full w-6 h-6 bg-blue-800  p-3 m-1 hover:border-blue-400 border-2 transition-all cursor-pointer ${activeColor == 4 || (Mode == "Update" && selectedTag?.color== "#1e40af") ? `border-blue-400` : ``}`} onClick={handleClick} ></p>
                                     <p data-color-id={5} data-color-code={"#166534"} className={`rounded-full w-6 h-6 bg-green-800  p-3 m-1 hover:border-blue-400 border-2 transition-all cursor-pointer ${activeColor == 5 || (Mode == "Update" && selectedTag?.color== "#166534") ? `border-blue-400` : ``}`} onClick={handleClick} ></p>
                                     <p data-color-id={6} data-color-code={"#166534"} className={`rounded-full w-6 h-6 ${color && color !="#166534" && color !="#1e40af" && color !="#9a3412" && color != "#3730a3" && color != "#991b1b"   ? "" : "bg-gradient-to-r from-blue-600 via-red-400 to-green-300"}  p-3 m-1 hover:border-blue-400 border-2 transition-all cursor-pointer ${activeColor == 6 ? `border-blue-400` : ``}`} style={{backgroundColor:`${color}`}} onClick={(e)=>{handleClick(e);ChangePositionColorInput(e); }} ></p>
                                      <input ref={ColorInput} onChange={e=>setColor(e.currentTarget.value)} type='color' className={`invisible`} ></input>
                        </div>
                </div>
                <div className=" flex w-full my-1">
                    <p className='w-1/4'>Parent</p>
                    <select className='w-full' disabled={hasChildren} value={selectedTag?.parent_id ?? ""}   onChange={(e)=>{setParentTag(e.currentTarget.value === "" ? null :  Number(e.currentTarget.value))} }>
                        <option   className='w-3/4'>None</option>
                        {tags?.map(tag => tag.id !=selectedTag?.id && tag.parent_id == null ?
                             <option  key={tag.id}     value={tag.id} className='w-3/4'>{tag.name}</option>
                             :
                             ""
                             )}
                    </select>
                </div>
                <div onClick={()=>{
                   
                } } className=" right-1 absolute bottom-1 flex">
                    <p className="hover:bg-blue-300 hover:text-white border-blue-300 hover:cursor-pointer m-2 p-2 border-2 rounded-md " onClick={async()=>{
                       if(Mode == "Update"){
                        UpdateTag()
                       }
                       else{
                            AddTag();
                       }  
                   
                } } >{Mode == "Update" ? "Edit" : "Add"}</p>
                    <p className="border-blue-300 cursor-pointer m-2 p-2 border-2 rounded-md hover:text-white hover:bg-blue-300" onClick={async()=>{
                 setActive(false);
                   setSelectedTag(null);
                } } >Close</p>

                </div>
                
            </div>
               
              
            </div>
            
            </div>
           
            </div>
  )
}

export default TagModalComponent
