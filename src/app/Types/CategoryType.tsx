import UserType from "./AttachmentType";
import StickerType from "./StickerType";

interface CategoryType {
    
    Id:number,
    sticker_id:number,
    Sticker:StickerType
    Name:string,
    user_id:number,
    User:UserType
}

export default CategoryType