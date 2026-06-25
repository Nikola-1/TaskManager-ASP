"use client";

import TaskDisplay from "./TaskDisplay/TaskDisplay";
import TaskMenu from "./TaskMenu/TaskMenu";
import ListModal from "./ListModal/ListModal";
import CalendarModal from "../CalendarModal/CalendarModal";
import TagModalComponent from "../TagModal/TagModalComponent";
import { useTaskComponentState } from "@/app/hooks/useTaskComponentState";
import GroupsModal from "../GroupsComponent/GroupsModal";

export default function TaskComponent() {
  const {
    taskMenuProps,
    taskDisplayProps,
    listModalProps,
    calendarModalProps,
    tagModalProps,
  } = useTaskComponentState();

  return (
    <div className="flex md:flex-row flex-col w-full">
      <TaskMenu {...taskMenuProps} />
      <TaskDisplay {...taskDisplayProps} />
      <ListModal {...listModalProps} />
      <CalendarModal {...calendarModalProps} />
      <TagModalComponent {...tagModalProps} />
      
    </div>
  );
}