'use client'
import { useParams } from 'next/navigation';

import React, { Children, useEffect } from 'react'
import { createContext } from 'react'
import { getGroupById } from '../api/api';
import { GroupType } from '../Types/GroupType';

interface ScopeContextType { //definisem oblike podatka u contextu
  
    group: GroupType|null;
    setGroup:  React.Dispatch<React.SetStateAction<GroupType | null>>;
   groupId: number | null;
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined); // inicijalizujem context
export const ScopeProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ group?: string }>();

  const [group, setGroup] = React.useState<GroupType | null>(null);

  const groupId = params?.group ? Number(params.group) : null;

  useEffect(() => {
    async function loadGroup() {
      if (!params?.group) {
        setGroup(null);
        return;
      }

      const data = await getGroupById(Number(params.group));

      setGroup(data[0]);
    }

    loadGroup();
  }, [params?.group]);

  return (
    <ScopeContext.Provider value={{ group, setGroup, groupId }}>
      {children}
    </ScopeContext.Provider>
  );
};
export function useScope(){
    const context = React.useContext(ScopeContext);
    if(!context) throw new Error("useScope mora biti koriscen unutar ScopeProvider-a");
    return context;
}
