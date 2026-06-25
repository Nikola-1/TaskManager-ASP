import { TaskType } from "./TaskType"

 interface AttachmentType{

    Id:number,
    FileName:string,
    FilePath:string,
    TaskItemId:number
    TaskItem?:TaskType
    CreatedAt:string

}

export default AttachmentType