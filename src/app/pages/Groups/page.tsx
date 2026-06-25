'use client'
import GroupsComponent from '@/app/components/GroupsComponent/GroupsComponent'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Micro_5 } from 'next/font/google';

import React from 'react'
import OptionsGroupsComponent from '@/app/components/GroupsComponent/OptionsGroupsComponent';
import { useTaskComponentState } from '@/app/hooks/useTaskComponentState';
import GroupsModal from '@/app/components/GroupsComponent/GroupsModal';
import useGroupState from '@/app/hooks/useGroupState';
import UsersModal from '@/app/components/GroupsComponent/UsersModal';

const page = () => {
 const {groupModalProps} = useGroupState();
 const {useGroup} = useGroupState();
  return (
    <div className='flex justify-start items-start'>
      <OptionsGroupsComponent {...groupModalProps} {...useGroup}  />
      <GroupsComponent {...groupModalProps} {...useGroup}/>
     <GroupsModal {...groupModalProps} {...useGroup}/>
         <UsersModal {...groupModalProps} {...useGroup}/>
    </div>
  )
}

export default page
