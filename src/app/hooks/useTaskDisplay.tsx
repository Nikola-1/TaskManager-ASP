import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from "@/app/connection/supabaseclient";
import { useAuth } from "@/app/context/AuthContext";
import { useScope } from "@/app/context/ScopeContext";
import useOptionsMenu from "@/app/hooks/useOptionsMenu";
import { faColumns } from "@fortawesome/free-solid-svg-icons";
import { TaskType } from "../Types/TaskType";
import { CreateTagTaskConnection } from "../api/api";

interface UseTaskDisplayProps {
  fullDate: Date | null;
  tasksArray: TaskType[];
  refreshTasks: () => Promise<void>;
  refreshFlag: boolean;
  categoryId: number;
  tagId: number;
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTaskProp: React.Dispatch<React.SetStateAction<TaskType | null>>;
}

export function useTaskDisplay({
  fullDate,
  tasksArray,
  refreshTasks,
  refreshFlag,
  categoryId,
  tagId,
  setToggleModal,
  setSelectedTaskProp,
}: UseTaskDisplayProps) {
  const { user, setUser } = useAuth();
  const { groupId } = useScope();

  const [inputValue, setInputValue] = useState("");
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleOpenModal = () => {
    setToggleModal(true);
  };

  const setUserAfterDisplay = async () => {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error) {
      console.error(error.message);
      return;
    }

    setUser(data);
  };

  

 

  const deleteDeleted = async () => {
    setSelectedTaskProp(null);

    const ids = tasksArray.map(task => task.id);

    if (ids.length === 0) return;

    const { error } = await supabase.from("tasks").delete().in("id", ids);

    if (error) {
      console.error(error.message);
      return;
    }

    await refreshTasks();
  };

  const updateStatus = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ Completed: true })
      .eq("id", id);

    if (error) {
      console.error(error.message);
      return;
    }

    await refreshTasks();
  };

  const { open, toggleMenu, setOpen, options } = useOptionsMenu("task", {
    complete: {
      label: user?.display === false ? "Display Tasks:Column" : "Display Tasks:Row",
      icon: faColumns,
      action: async () => {
        await supabase.rpc("toggle_display_tasks", { uid: user?.id });
        await setUserAfterDisplay();
      },
    },
  });

  const openOptionsMenu = (event: React.MouseEvent<SVGSVGElement>) => {
    toggleMenu();
    setX(event.clientX);
    setY(event.clientY);
  };

  useEffect(() => {
    refreshTasks();
  }, [refreshFlag]);

  return {
    user,

    inputValue,
    setInputValue,
    handleChange,

   
    deleteDeleted,
    
    updateStatus,

    handleOpenModal,

    open,
    setOpen,
    options,
    x,
    y,
    openOptionsMenu,
  };
}