import { getSticker, getStickerById } from "@/app/api/api";
import { useEffect, useState } from "react";



interface TaskCategoryImageProps{
               
                id:number | undefined
                refreshFlag:boolean
}
export default function TaskCategoryImage({id,refreshFlag}:TaskCategoryImageProps){
           const [imageUrl,setImageUrl] = useState<string | null>(null);
          
            useEffect(()=>{
                
                async function  getImage(){
                    console.log(id);
                const {data,error} = await getStickerById(id);
                console.log(data);
                if(!error && data){
                    setImageUrl(data.Stickers.sticker_path)
                }
                else{
                    return;
                }
                
            }
            getImage();
            },[id,refreshFlag])
           
    return(
      
        <>
   
        { imageUrl ? <img  src={"/img/"+imageUrl+".png"} height={20} width={20}></img> : <></>}
        </>
    )

}