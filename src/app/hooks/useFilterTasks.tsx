
import { useCallback, useEffect, useState } from "react";
import { getTasks } from "@/app/api/api";
import { TaskType } from "@/app/Types/TaskType";
import { useScope } from "../context/ScopeContext";

export default function useFilterTasks(
  filter: string,
  isCategory: boolean,
  categoryId: number,
  isTag: boolean,
  tagId: number
) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const {group} = useScope();
  const { groupId } = useScope();
  const refresh = useCallback(async () => {
    try {
      const data = group?.id != null ? await getTasks(groupId) : await getTasks(null);
      
      let filteredTasks = data.data as TaskType[];
      console.log(filteredTasks)
      if (filter === "Today") {
        const today = new Date().toISOString().slice(0, 10);

        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.date).toISOString().slice(0, 10);
          
          return (taskDate === today) && (task.deleted == false);
        });
        console.log(filteredTasks);
      }
      if (filter === "7Days") {
          const dateToday = new Date();
          const next7 = new Date(new Date().setDate(new Date().getDate()+7))
            .toISOString()
            .split("T")[0];

          filteredTasks=filteredTasks.filter(task=>{
            
            console.log(new Date(dateToday).toISOString().split("T")[0]);
            
            console.log(task.date <=next7 && task.date >=dateToday.toISOString().slice(0, 10))
            return (task.date <=next7 && task.date >=dateToday.toISOString().slice(0, 10) && (task.deleted == false))})
          
        }
      if (filter === "Completed") {
        filteredTasks = filteredTasks.filter(task => task.completed === true);
      }

      if (filter === "Deleted") {
        filteredTasks = filteredTasks.filter(task => task.deleted === true);
        console.log(filteredTasks);
      }

      if (isCategory) {
        console.log(isCategory)
        console.log(categoryId);
        console.log(filteredTasks);
                filteredTasks = filteredTasks.filter(
          task => task.category_id === categoryId  && (task.deleted == false)
        );
        
        console.log(filteredTasks);
      }

      if (isTag) {
        console.log("isTag");
        filteredTasks = filteredTasks.filter(task =>
          task.tags?.some(tag => tag.id === tagId) && task.deleted == false
        );
        console.log(filteredTasks);
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error(error);
    }
  }, [filter, isCategory, categoryId, isTag, tagId,group?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    tasks,
    refresh,
  };
}