'use client'
import LongSearchbar from '@/components/features/badges/LongSearchbar'
import Subtitle from '@/components/features/Subtitle'
import { Alert, LinearProgress, Modal } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { SearchMemberReversed } from './fxn'
import BadgeSearchItem from '@/components/features/badges/BadgeSearchItem'
import '../../../../components/features/customscroll.css'
import { IGroup } from '@/lib/database/models/group.model'
import { useFetchFreeMembers } from '@/hooks/fetch/useMember'
import { ErrorProps } from '@/types/Types'

export type NewGroupMemberProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentGroup:IGroup|null,
    setCurrentGroup:Dispatch<SetStateAction<IGroup|null>>
}

const NewGroupMember = ({infoMode, setInfoMode, currentGroup, setCurrentGroup}:NewGroupMemberProps) => {
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const eventId = typeof currentGroup?.eventId === 'object' && '_id' in currentGroup?.eventId && currentGroup?.eventId._id;
    const {members, loading} = useFetchFreeMembers(eventId.toString());
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
                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error?'error':'success'} >{response.message}</Alert>
                }
                {
                    loading ?
                    <LinearProgress/>
                    :
                    <LongSearchbar setSearch={setSearch} reversed={false} />
                }

                {
                    SearchMemberReversed(members, search).map((item)=>(
                        <BadgeSearchItem currentGroup={currentGroup!} setResponse={setResponse}  key={item?._id} member={item} isGroupItem />
                    ))
                }

                
            </div>
        </div>
    </Modal>
  )
}

export default NewGroupMember