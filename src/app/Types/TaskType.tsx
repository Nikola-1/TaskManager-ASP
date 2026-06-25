import AttachmentType from "./AttachmentType";
import CategoryType from "./CategoryType";
import { UserType } from "./UserType";

export interface TaskType {
  id: number;
  name: string | null;
  content: string | null;
  status: string | null;

  user_id: number | null;
  category_id: number | null;
  group_id: number | null;

  completed: boolean;
  deleted: boolean;

  file_name: string | null;

  createdAt: string; // DateTime iz ASP.NET dolazi kao ISO string
  date: string; // DateOnly takođe dolazi kao string (npr. "2026-06-15")

  category?: CategoryType | null;
  user?: UserType | null;
  

  
  attachments: AttachmentType[];
}