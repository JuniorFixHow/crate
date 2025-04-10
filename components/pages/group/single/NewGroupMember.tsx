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
import { IEvent } from '@/lib/database/models/event.model'
import { IChurch } from '@/lib/database/models/church.model'
import TipUser from '@/components/misc/TipUser'

export type NewGroupMemberProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentGroup:IGroup,
}

const NewGroupMember = ({infoMode, setInfoMode, currentGroup}:NewGroupMemberProps) => {
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const event = currentGroup?.eventId as IEvent;
    const church = currentGroup?.churchId as unknown as IChurch;
    const {members, loading} = useFetchFreeMembers(event?._id, church?._id);
    const handleClose = ()=>{
        setInfoMode(false);
        setSearch('');
    }

    const searched = SearchMemberReversed(members, search);


  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <div className="new-modal scrollbar-custom overflow-y-scroll  md:max-h-[80%]">
                <div className="w-full flex justify-between p-4 rounded-t border-b border-slate-300 bg-white dark:bg-[#0F1214] dark:text-white">
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
                    <div className="flex flex-col gap-4">
                        <LongSearchbar setSearch={setSearch} reversed={false} />
                        {
                            searched.length === 0 &&
                            <TipUser text="Only members from the group's church will appear here" />
                        }
                    </div>
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