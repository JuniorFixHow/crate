'use client'
import LongSearchbar from '@/components/features/badges/LongSearchbar'
import Subtitle from '@/components/features/Subtitle'
import { GroupProps } from '@/types/Types'
import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { SearchMemberReversed } from './fxn'
import { members } from '@/components/Dummy/Data'
import BadgeSearchItem from '@/components/features/badges/BadgeSearchItem'
import '../../../../components/features/customscroll.css'

export type NewGroupMemberProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentGroup:GroupProps|null,
    setCurrentGroup:Dispatch<SetStateAction<GroupProps|null>>
}

const NewGroupMember = ({infoMode, setInfoMode, currentGroup, setCurrentGroup}:NewGroupMemberProps) => {
    const [search, setSearch] = useState<string>('');
    const handleClose = ()=>{
        setInfoMode(false);
        setSearch('');
    }
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <div className="new-modal scrollbar-custom overflow-y-scroll  md:max-h-[80%]">
                <div className="w-full flex justify-between p-4 rounded-t border-b border-slate-300 bg-white dark:bg-black">
                    <Subtitle text={`Add member`} />
                    <MdClose onClick={handleClose}  size={24} className='cursor-pointer' />
                </div>
                <LongSearchbar setSearch={setSearch} reversed={false} />

                {
                    SearchMemberReversed(members, search).map((item)=>(
                        <BadgeSearchItem key={item?.id} member={item} isGroupItem />
                    ))
                }

                
            </div>
        </div>
    </Modal>
  )
}

export default NewGroupMember